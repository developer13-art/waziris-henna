<?php

namespace Models;

use Config\Database;

class Order
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM orders WHERE id = ?", [$id]);
    }

    public function findByReference(string $reference): ?array
    {
        return $this->db->queryOne("SELECT * FROM orders WHERE order_reference = ?", [$reference]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('orders', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('orders', $data, $id);
    }
}