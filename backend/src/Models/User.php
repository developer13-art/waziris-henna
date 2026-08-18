<?php

namespace Models;

use Config\Database;

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM users WHERE id = ?", [$id]);
    }

    public function findByEmail(string $email): ?array
    {
        return $this->db->queryOne("SELECT * FROM users WHERE email = ?", [$email]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('users', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('users', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->delete('users', $id);
    }

    public function getAll(array $filters = []): array
    {
        $where = ['1=1'];
        $params = [];

        if (!empty($filters['role'])) {
            $where[] = 'role = ?';
            $params[] = $filters['role'];
        }

        $whereClause = implode(' AND ', $where);
        return $this->db->query("SELECT * FROM users WHERE {$whereClause}", $params);
    }
}