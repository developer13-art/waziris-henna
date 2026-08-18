<?php

namespace Models;

use Config\Database;

class Service
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug): ?array
    {
        return $this->db->queryOne("SELECT * FROM services WHERE slug = ?", [$slug]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('services', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('services', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->update('services', ['is_active' => false], $id);
    }
}