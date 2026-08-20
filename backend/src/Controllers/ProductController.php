<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class ProductController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function handle(string $method, ?string $id = null, ?string $action = null): void
    {
        switch ($method) {
            case 'GET':
                if ($id && $action === 'inventory') {
                    $this->getInventoryHistory((int)$id);
                } elseif ($id) {
                    $this->getProduct($id);  // Pass $id as-is (could be ID or slug)
                } else {
                    $this->getAllProducts();
                }
                break;
                
            case 'POST':
                if ($id && $action === 'inventory') {
                    $this->adjustInventory((int)$id);
                } else {
                    $this->createProduct();
                }
                break;
                
            case 'PUT':
                if ($id) {
                    $this->updateProduct((int)$id);
                }
                break;
                
            case 'DELETE':
                if ($id) {
                    $this->deleteProduct((int)$id);
                }
                break;
                
            default:
                Response::error('Method not allowed', 405);
        }
    }
    private function getAllProducts(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 12);
        $offset = ($page - 1) * $perPage;

        $where = ['p.is_active = 1'];
        $params = [];

        if (!empty($_GET['category'])) {
            $where[] = 'p.category = ?';
            $params[] = $_GET['category'];
        }
        if (!empty($_GET['search'])) {
            $where[] = '(p.name LIKE ? OR p.description LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        if (!empty($_GET['featured'])) {
            $where[] = 'p.is_featured = 1';
        }

        $whereClause = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) as total FROM products p WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);

        $sql = "SELECT * FROM products p WHERE {$whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $perPage;
        $params[] = $offset;

        $products = $this->db->query($sql, $params);

        Response::paginated($products, $total, $page, $perPage);
    }

    private function getProduct($id): void
    {
        // Check if the parameter is a numeric ID or a slug
        if (is_numeric($id)) {
            $sql = "SELECT * FROM products WHERE id = ? AND is_active = 1";
            $product = $this->db->queryOne($sql, [(int)$id]);
        } else {
            $sql = "SELECT * FROM products WHERE slug = ? AND is_active = 1";
            $product = $this->db->queryOne($sql, [$id]);
        }

        if (!$product) {
            Response::error('Product not found', 404);
        }

        Response::success($product, 'Product retrieved successfully');
    }

    private function getInventoryHistory(int $id): void
    {
        $sql = "SELECT il.*, u.full_name as created_by_name 
                FROM inventory_log il 
                LEFT JOIN users u ON il.created_by = u.id 
                WHERE il.product_id = ? 
                ORDER BY il.created_at DESC 
                LIMIT 50";
        
        $history = $this->db->query($sql, [$id]);

        Response::success($history, 'Inventory history retrieved');
    }

    private function createProduct(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            Response::error('Product name is required');
        }

        // Generate unique slug
        $baseSlug = ReferenceGenerator::slugify($name);
        $slug = $baseSlug;
        $counter = 1;

        // Check if slug exists, if so add a number
        while ($this->db->queryOne("SELECT id FROM products WHERE slug = ?", [$slug])) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $data = [
            'name' => $name,
            'slug' => $slug,
            'description' => $input['description'] ?? '',
            'short_description' => $input['short_description'] ?? '',
            'price' => (float)($input['price'] ?? 0),
            'sale_price' => !empty($input['sale_price']) ? (float)$input['sale_price'] : null,
            'stock_quantity' => (int)($input['stock_quantity'] ?? 0),
            'low_stock_threshold' => (int)($input['low_stock_threshold'] ?? 5),
            'sku' => $input['sku'] ?? null,
            'image_url' => !empty($input['image_url']) ? $input['image_url'] : null,
            'additional_images' => $input['additional_images'] ?? null,
            'category' => $input['category'] ?? 'General',
            'is_active' => $input['is_active'] ?? true,
            'is_featured' => $input['is_featured'] ?? false,
        ];

        $this->db->beginTransaction();

        try {
            $id = $this->db->insert('products', $data);

            if ($data['stock_quantity'] > 0) {
                $this->db->insert('inventory_log', [
                    'product_id' => $id,
                    'change_type' => 'add',
                    'quantity_changed' => $data['stock_quantity'],
                    'previous_quantity' => 0,
                    'new_quantity' => $data['stock_quantity'],
                    'reason' => 'Initial stock',
                ]);
            }

            $this->db->commit();

            Response::success(['id' => $id, 'slug' => $slug], 'Product created successfully', 201);
        } catch (\Exception $e) {
            $this->db->rollBack();
            Response::error('Failed to create product: ' . $e->getMessage(), 500);
        }
    }
    private function updateProduct(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Product not found', 404);
        }

        $data = [];
        $allowedFields = [
            'name', 'description', 'short_description', 'price', 'sale_price',
            'low_stock_threshold', 'sku', 'image_url', 'additional_images',
            'category', 'is_active', 'is_featured'
        ];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('products', $data, $id);

        Response::success([], 'Product updated successfully');
    }

    private function adjustInventory(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $product = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        if (!$product) {
            Response::error('Product not found', 404);
        }

        $changeType = $input['change_type'] ?? 'adjust';
        $quantityChanged = (int)($input['quantity_changed'] ?? 0);
        $reason = $input['reason'] ?? 'Manual adjustment';

        $previousQuantity = (int)$product['stock_quantity'];
        $newQuantity = $previousQuantity;

        switch ($changeType) {
            case 'add':
            case 'restock':
                $newQuantity = $previousQuantity + $quantityChanged;
                break;
            case 'remove':
            case 'sale':
                $newQuantity = max(0, $previousQuantity - $quantityChanged);
                break;
            case 'adjust':
                $newQuantity = $quantityChanged;
                break;
        }

        $this->db->beginTransaction();

        try {
            $this->db->update('products', ['stock_quantity' => $newQuantity], $id);

            $this->db->insert('inventory_log', [
                'product_id' => $id,
                'change_type' => $changeType,
                'quantity_changed' => $quantityChanged,
                'previous_quantity' => $previousQuantity,
                'new_quantity' => $newQuantity,
                'reason' => $reason,
            ]);

            $this->db->commit();

            Response::success([
                'product_id' => $id,
                'previous_quantity' => $previousQuantity,
                'new_quantity' => $newQuantity,
            ], 'Inventory updated successfully');
        } catch (\Exception $e) {
            $this->db->rollBack();
            Response::error('Failed to update inventory: ' . $e->getMessage(), 500);
        }
    }

    private function deleteProduct(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Product not found', 404);
        }

        $this->db->update('products', ['is_active' => false], $id);

        Response::success([], 'Product deleted successfully');
    }
}