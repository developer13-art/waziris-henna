<?php

namespace Models;

use Config\Database;

class Customer
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne(
            "SELECT u.*, 
             (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as total_bookings,
             (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as total_orders
             FROM users u WHERE u.id = ? AND u.role = 'customer'",
            [$id]
        );
    }

    public function getAll(array $filters = []): array
    {
        $where = ["u.role = 'customer'"];
        $params = [];

        if (!empty($filters['search'])) {
            $where[] = '(u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);

        return $this->db->query(
            "SELECT u.id, u.full_name, u.email, u.phone, u.created_at,
             (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as total_bookings,
             (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as total_orders
             FROM users u WHERE {$whereClause} ORDER BY u.created_at DESC",
            $params
        );
    }
}