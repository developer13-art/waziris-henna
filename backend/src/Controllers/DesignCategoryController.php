<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class DesignCategoryController
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
                if ($id) {
                    $this->getCategory((int)$id);
                } else {
                    $this->getAllCategories();
                }
                break;
            case 'POST':
                $this->createCategory();
                break;
            case 'PUT':
                if ($id) {
                    $this->updateCategory((int)$id);
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deleteCategory((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllCategories(): void
    {
        $sql = "SELECT c.*, 
                (SELECT COUNT(*) FROM designs d WHERE d.category_id = c.id AND d.is_active = 1) as design_count 
                FROM design_categories c 
                WHERE c.is_active = 1 
                ORDER BY c.sort_order ASC, c.name ASC";

        $categories = $this->db->query($sql);

        Response::success($categories, 'Categories retrieved successfully');
    }

    private function getCategory(int $id): void
    {
        $sql = "SELECT c.*, 
                (SELECT COUNT(*) FROM designs d WHERE d.category_id = c.id AND d.is_active = 1) as design_count 
                FROM design_categories c 
                WHERE c.id = ? AND c.is_active = 1";

        $category = $this->db->queryOne($sql, [$id]);

        if (!$category) {
            Response::error('Category not found', 404);
        }

        Response::success($category, 'Category retrieved successfully');
    }

    private function createCategory(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            Response::error('Category name is required');
        }

        $slug = $input['slug'] ?? ReferenceGenerator::slugify($name);

        $existing = $this->db->queryOne("SELECT id FROM design_categories WHERE slug = ?", [$slug]);
        if ($existing) {
            Response::error('Slug already exists');
        }

        $data = [
            'name' => $name,
            'slug' => $slug,
            'description' => $input['description'] ?? '',
            'image_url' => $input['image_url'] ?? null,
            'is_active' => $input['is_active'] ?? true,
            'sort_order' => $input['sort_order'] ?? 0,
        ];

        $id = $this->db->insert('design_categories', $data);

        Response::success(['id' => $id], 'Category created successfully', 201);
    }

    private function updateCategory(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM design_categories WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Category not found', 404);
        }

        $data = [];
        $allowedFields = ['name', 'description', 'image_url', 'is_active', 'sort_order'];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('design_categories', $data, $id);

        Response::success([], 'Category updated successfully');
    }

    private function deleteCategory(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM design_categories WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Category not found', 404);
        }

        // Check if category has designs
        $designCount = (int)($this->db->queryOne("SELECT COUNT(*) as total FROM designs WHERE category_id = ?", [$id])['total'] ?? 0);

        if ($designCount > 0) {
            Response::error('Cannot delete category with existing designs. Move designs first or deactivate the category.');
        }

        $this->db->update('design_categories', ['is_active' => false], $id);

        Response::success([], 'Category deleted successfully');
    }
}