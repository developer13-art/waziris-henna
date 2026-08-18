<?php

namespace Models;

use Config\Database;

class Product
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug): ?array
    {
        return $this->db->queryOne("SELECT * FROM products WHERE slug = ?", [$slug]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('products', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('products', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->update('products', ['is_active' => false], $id);
    }
}