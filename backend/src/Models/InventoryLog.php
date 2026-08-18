<?php

namespace Models;

use Config\Database;

class InventoryLog
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function create(array $data): int
    {
        return $this->db->insert('inventory_log', $data);
    }

    public function findByProductId(int $productId): array
    {
        return $this->db->query(
            "SELECT il.*, u.full_name as created_by_name 
             FROM inventory_log il 
             LEFT JOIN users u ON il.created_by = u.id 
             WHERE il.product_id = ? 
             ORDER BY il.created_at DESC",
            [$productId]
        );
    }
}