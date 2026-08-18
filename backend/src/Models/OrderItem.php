<?php

namespace Models;

use Config\Database;

class OrderItem
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findByOrderId(int $orderId): array
    {
        return $this->db->query("SELECT * FROM order_items WHERE order_id = ?", [$orderId]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('order_items', $data);
    }
}