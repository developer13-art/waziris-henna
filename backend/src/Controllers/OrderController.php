<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class OrderController
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
                if ($id && $action === 'status') {
                    $this->getOrderStatus((int)$id);
                } elseif ($id) {
                    $this->getOrder((int)$id);
                } else {
                    $this->getAllOrders();
                }
                break;
            case 'POST':
                if ($id && $action === 'status') {
                    $this->updateOrderStatus((int)$id);
                } else {
                    $this->createOrder();
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllOrders(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $where = ['1=1'];
        $params = [];

        if (!empty($_GET['status'])) {
            $where[] = 'o.order_status = ?';
            $params[] = $_GET['status'];
        }
        if (!empty($_GET['payment_status'])) {
            $where[] = 'o.payment_status = ?';
            $params[] = $_GET['payment_status'];
        }
        if (!empty($_GET['search'])) {
            $where[] = '(o.customer_name LIKE ? OR o.order_reference LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) as total FROM orders o WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);

        $sql = "SELECT * FROM orders o WHERE {$whereClause} ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $perPage;
        $params[] = $offset;

        $orders = $this->db->query($sql, $params);

        Response::paginated($orders, $total, $page, $perPage);
    }

    private function getOrder(int $id): void
    {
        $sql = "SELECT * FROM orders WHERE id = ?";
        $order = $this->db->queryOne($sql, [$id]);

        if (!$order) {
            Response::error('Order not found', 404);
        }

        $items = $this->db->query("SELECT * FROM order_items WHERE order_id = ?", [$id]);
        $payment = $this->db->queryOne(
            "SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
            [$id]
        );

        $order['items'] = $items;
        $order['payment'] = $payment;

        Response::success($order, 'Order retrieved successfully');
    }

    private function getOrderStatus(int $id): void
    {
        $order = $this->db->queryOne(
            "SELECT order_reference, order_status, payment_status FROM orders WHERE id = ?",
            [$id]
        );

        if (!$order) {
            Response::error('Order not found', 404);
        }

        Response::success($order, 'Order status retrieved');
    }

    private function createOrder(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $customerName = trim($input['customer_name'] ?? '');
        $customerPhone = trim($input['customer_phone'] ?? '');
        $items = $input['items'] ?? [];

        if (empty($customerName)) {
            Response::error('Customer name is required');
        }
        if (empty($customerPhone)) {
            Response::error('Customer phone is required');
        }
        if (empty($items) || !is_array($items)) {
            Response::error('Order items are required');
        }

        $orderReference = ReferenceGenerator::orderReference();

        $this->db->beginTransaction();

        try {
            $subtotal = 0;

            // Validate items and calculate subtotal
            foreach ($items as $item) {
                $productId = (int)($item['product_id'] ?? 0);
                $quantity = (int)($item['quantity'] ?? 1);

                $product = $this->db->queryOne("SELECT * FROM products WHERE id = ? AND is_active = 1", [$productId]);

                if (!$product) {
                    throw new \Exception("Product ID {$productId} not found or inactive");
                }

                if ($product['stock_quantity'] < $quantity) {
                    throw new \Exception("Insufficient stock for product: {$product['name']}");
                }

                $price = $product['sale_price'] ?? $product['price'];
                $subtotal += $price * $quantity;
            }

            $deliveryFee = (float)($input['delivery_fee'] ?? 0);
            $total = $subtotal + $deliveryFee;

            $orderId = $this->db->insert('orders', [
                'order_reference' => $orderReference,
                'user_id' => $input['user_id'] ?? null,
                'customer_name' => $customerName,
                'customer_email' => $input['customer_email'] ?? null,
                'customer_phone' => $customerPhone,
                'delivery_address' => $input['delivery_address'] ?? null,
                'delivery_method' => $input['delivery_method'] ?? 'Pickup',
                'delivery_fee' => $deliveryFee,
                'order_status' => 'Pending',
                'payment_status' => 'Pending',
                'subtotal' => $subtotal,
                'total_amount' => $total,
                'notes' => $input['notes'] ?? null,
            ]);

            // Insert order items and update inventory
            foreach ($items as $item) {
                $productId = (int)($item['product_id'] ?? 0);
                $quantity = (int)($item['quantity'] ?? 1);

                $product = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$productId]);
                $price = $product['sale_price'] ?? $product['price'];
                $itemSubtotal = $price * $quantity;

                $this->db->insert('order_items', [
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'product_name' => $product['name'],
                    'product_image' => $product['image_url'],
                    'quantity' => $quantity,
                    'unit_price' => $price,
                    'subtotal' => $itemSubtotal,
                ]);

                // Update inventory
                $newQuantity = $product['stock_quantity'] - $quantity;
                $this->db->update('products', ['stock_quantity' => $newQuantity], $productId);

                $this->db->insert('inventory_log', [
                    'product_id' => $productId,
                    'change_type' => 'sale',
                    'quantity_changed' => $quantity,
                    'previous_quantity' => $product['stock_quantity'],
                    'new_quantity' => $newQuantity,
                    'reason' => "Order #{$orderReference}",
                    'order_id' => $orderId,
                ]);
            }

            $this->db->commit();

            Response::success([
                'id' => $orderId,
                'order_reference' => $orderReference,
                'total_amount' => $total,
            ], 'Order created successfully', 201);

        } catch (\Exception $e) {
            $this->db->rollBack();
            Response::error('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    private function updateOrderStatus(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $order = $this->db->queryOne("SELECT * FROM orders WHERE id = ?", [$id]);
        if (!$order) {
            Response::error('Order not found', 404);
        }

        $allowedStatuses = ['Pending', 'Paid', 'Processing', 'Ready', 'Delivered', 'Completed', 'Cancelled'];
        $newStatus = $input['order_status'] ?? null;

        if (!$newStatus || !in_array($newStatus, $allowedStatuses)) {
            Response::error('Invalid order status');
        }

        $this->db->update('orders', ['order_status' => $newStatus], $id);

        Response::success([], 'Order status updated successfully');
    }
}