<?php

namespace Models;

use Config\Database;

class Review
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM reviews WHERE id = ?", [$id]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('reviews', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('reviews', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->delete('reviews', $id);
    }
}