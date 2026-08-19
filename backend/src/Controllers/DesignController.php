<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class DesignController
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
                if ($id && $action === 'similar') {
                    $this->getSimilarDesigns((int)$id);
                } elseif ($id) {
                    $this->getDesign((int)$id);
                } else {
                    $this->getAllDesigns();
                }
                break;
                
            case 'POST':
                $this->createDesign();
                break;
                
            case 'PUT':
                if ($id) {
                    $this->updateDesign((int)$id);
                }
                break;
                
            case 'DELETE':
                if ($id) {
                    $this->deleteDesign((int)$id);
                }
                break;
                
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllDesigns(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 12);
        $offset = ($page - 1) * $perPage;
        
        $where = ['d.is_active = 1'];
        $params = [];
        
        // Filters
        if (!empty($_GET['category'])) {
            $where[] = 'd.category_id = ?';
            $params[] = (int)$_GET['category'];
        }
        if (!empty($_GET['style'])) {
            $where[] = 'd.style = ?';
            $params[] = $_GET['style'];
        }
        if (!empty($_GET['occasion'])) {
            $where[] = 'd.occasion = ?';
            $params[] = $_GET['occasion'];
        }
        if (!empty($_GET['body_area'])) {
            $where[] = 'd.body_area = ?';
            $params[] = $_GET['body_area'];
        }
        if (!empty($_GET['complexity'])) {
            $where[] = 'd.complexity = ?';
            $params[] = $_GET['complexity'];
        }
        if (!empty($_GET['search'])) {
            $where[] = '(d.title LIKE ? OR d.description LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $whereClause = implode(' AND ', $where);
        
        $countSql = "SELECT COUNT(*) as total FROM designs d WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);
        
        $sql = "SELECT d.*, c.name as category_name 
                FROM designs d 
                LEFT JOIN design_categories c ON d.category_id = c.id 
                WHERE {$whereClause} 
                ORDER BY d.created_at DESC 
                LIMIT ? OFFSET ?";
        
        $params[] = $perPage;
        $params[] = $offset;
        
        $designs = $this->db->query($sql, $params);
        
        Response::paginated($designs, $total, $page, $perPage);
    }

    private function getDesign(int $id): void
    {
        $sql = "SELECT d.*, c.name as category_name 
                FROM designs d 
                LEFT JOIN design_categories c ON d.category_id = c.id 
                WHERE d.id = ? AND d.is_active = 1";
        
        $design = $this->db->queryOne($sql, [$id]);
        
        if (!$design) {
            Response::error('Design not found', 404);
        }
        
        // Increment views
        $this->db->query("UPDATE designs SET views_count = views_count + 1 WHERE id = ?", [$id]);
        
        Response::success($design, 'Design retrieved successfully');
    }

    private function getSimilarDesigns(int $id): void
    {
        $design = $this->db->queryOne("SELECT * FROM designs WHERE id = ?", [$id]);
        
        if (!$design) {
            Response::error('Design not found', 404);
        }
        
        $sql = "SELECT d.*, c.name as category_name 
                FROM designs d 
                LEFT JOIN design_categories c ON d.category_id = c.id 
                WHERE d.id != ? AND d.is_active = 1 
                AND (d.style = ? OR d.occasion = ? OR d.category_id = ?) 
                LIMIT 6";
        
        $similar = $this->db->query($sql, [
            $id,
            $design['style'],
            $design['occasion'],
            $design['category_id']
        ]);
        
        Response::success($similar, 'Similar designs retrieved');
    }

    private function createDesign(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            Response::error('Design title is required');
        }

        // Generate unique slug
        $baseSlug = ReferenceGenerator::slugify($title);
        $slug = $baseSlug;
        $counter = 1;

        // Check if slug exists, if so add a number
        while ($this->db->queryOne("SELECT id FROM designs WHERE slug = ?", [$slug])) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        // Handle category_id
        $categoryId = !empty($input['category_id']) ? (int)$input['category_id'] : null;

        if ($categoryId) {
            $category = $this->db->queryOne("SELECT id FROM design_categories WHERE id = ?", [$categoryId]);
            if (!$category) {
                Response::error('Invalid category selected');
            }
        }

        $data = [
            'title' => $title,
            'slug' => $slug,
            'description' => !empty($input['description']) ? $input['description'] : null,
            'category_id' => $categoryId,
            'style' => !empty($input['style']) ? $input['style'] : null,
            'occasion' => !empty($input['occasion']) ? $input['occasion'] : null,
            'body_area' => !empty($input['body_area']) ? $input['body_area'] : null,
            'complexity' => $input['complexity'] ?? 'Medium',
            'price' => !empty($input['price']) ? (float)$input['price'] : null,
            'image_url' => !empty($input['image_url']) ? $input['image_url'] : null,
            'additional_images' => !empty($input['additional_images']) ? $input['additional_images'] : null,
            'is_featured' => $input['is_featured'] ?? false,
            'is_design_of_week' => $input['is_design_of_week'] ?? false,
            'is_active' => $input['is_active'] ?? true,
        ];

        $id = $this->db->insert('designs', $data);

        Response::success(['id' => $id, 'slug' => $slug], 'Design created successfully', 201);
    }

    private function updateDesign(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM designs WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Design not found', 404);
        }

        $data = [];

        // Handle category_id separately
        if (isset($input['category_id'])) {
            $categoryId = !empty($input['category_id']) ? (int)$input['category_id'] : null;
            
            if ($categoryId) {
                $category = $this->db->queryOne("SELECT id FROM design_categories WHERE id = ?", [$categoryId]);
                if (!$category) {
                    Response::error('Invalid category selected');
                }
            }
            
            $data['category_id'] = $categoryId;
        }

        // Handle other fields
        $allowedFields = [
            'title', 'description', 'style', 'occasion',
            'body_area', 'complexity', 'price', 'image_url',
            'additional_images', 'is_featured', 'is_design_of_week', 'is_active'
        ];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                // Convert empty strings to null for nullable fields
                if (in_array($field, ['description', 'style', 'occasion', 'body_area', 'image_url', 'additional_images'])) {
                    $data[$field] = !empty($input[$field]) ? $input[$field] : null;
                } elseif ($field === 'price') {
                    $data[$field] = !empty($input[$field]) ? (float)$input[$field] : null;
                } else {
                    $data[$field] = $input[$field];
                }
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('designs', $data, $id);

        Response::success([], 'Design updated successfully');
    }

    private function deleteDesign(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM designs WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Design not found', 404);
        }
        
        // Soft delete
        $this->db->update('designs', ['is_active' => false], $id);
        
        Response::success([], 'Design deleted successfully');
    }
}