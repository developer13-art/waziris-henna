<?php

namespace Models;

use Config\Database;

class DesignCategory
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM design_categories WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug): ?array
    {
        return $this->db->queryOne("SELECT * FROM design_categories WHERE slug = ?", [$slug]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('design_categories', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('design_categories', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->update('design_categories', ['is_active' => false], $id);
    }
}