<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class ServiceController
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
                    $this->getService((int)$id);
                } else {
                    $this->getAllServices();
                }
                break;
            case 'POST':
                $this->createService();
                break;
            case 'PUT':
                if ($id) {
                    $this->updateService((int)$id);
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deleteService((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllServices(): void
    {
        $where = ['is_active = 1'];
        $params = [];

        if (!empty($_GET['search'])) {
            $where[] = '(name LIKE ? OR description LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);
        $sql = "SELECT * FROM services WHERE {$whereClause} ORDER BY sort_order ASC, created_at DESC";
        $services = $this->db->query($sql, $params);

        Response::success($services, 'Services retrieved successfully');
    }

    private function getService(int $id): void
    {
        $sql = "SELECT * FROM services WHERE id = ? AND is_active = 1";
        $service = $this->db->queryOne($sql, [$id]);

        if (!$service) {
            Response::error('Service not found', 404);
        }

        Response::success($service, 'Service retrieved successfully');
    }

    private function createService(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            Response::error('Service name is required');
        }

        $slug = $input['slug'] ?? ReferenceGenerator::slugify($name);

        $existing = $this->db->queryOne("SELECT id FROM services WHERE slug = ?", [$slug]);
        if ($existing) {
            Response::error('Slug already exists');
        }

        $data = [
            'name' => $name,
            'slug' => $slug,
            'description' => $input['description'] ?? '',
            'short_description' => $input['short_description'] ?? '',
            'starting_price' => $input['starting_price'] ?? 0,
            'duration_minutes' => $input['duration_minutes'] ?? 60,
            'suitable_occasions' => $input['suitable_occasions'] ?? '',
            'image_url' => $input['image_url'] ?? null,
            'is_active' => $input['is_active'] ?? true,
            'sort_order' => $input['sort_order'] ?? 0,
        ];

        $id = $this->db->insert('services', $data);

        Response::success(['id' => $id], 'Service created successfully', 201);
    }

    private function updateService(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Service not found', 404);
        }

        $data = [];
        $allowedFields = [
            'name', 'description', 'short_description', 'starting_price',
            'duration_minutes', 'suitable_occasions', 'image_url',
            'is_active', 'sort_order'
        ];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('services', $data, $id);

        Response::success([], 'Service updated successfully');
    }

    private function deleteService(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Service not found', 404);
        }

        $this->db->update('services', ['is_active' => false], $id);

        Response::success([], 'Service deleted successfully');
    }
}