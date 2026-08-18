<?php

namespace Models;

use Config\Database;

class Design
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM designs WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug): ?array
    {
        return $this->db->queryOne("SELECT * FROM designs WHERE slug = ?", [$slug]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('designs', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('designs', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->update('designs', ['is_active' => false], $id);
    }

    public function incrementViews(int $id): void
    {
        $this->db->query("UPDATE designs SET views_count = views_count + 1 WHERE id = ?", [$id]);
    }
}