<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;

class CustomerController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function handle(string $method, ?string $id = null, ?string $action = null): void
    {
        switch ($method) {
            case 'GET':
                if ($id && $action === 'bookings') {
                    $this->getCustomerBookings((int)$id);
                } elseif ($id && $action === 'orders') {
                    $this->getCustomerOrders((int)$id);
                } elseif ($id && $action === 'favorites') {
                    $this->getCustomerFavorites((int)$id);
                } elseif ($id) {
                    $this->getCustomer((int)$id);
                } else {
                    $this->getAllCustomers();
                }
                break;
            case 'PUT':
                if ($id) {
                    $this->updateCustomer((int)$id);
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deactivateCustomer((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllCustomers(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $where = ['u.role = "customer"'];
        $params = [];

        if (!empty($_GET['search'])) {
            $where[] = '(u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) as total FROM users u WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);

        $sql = "SELECT u.id, u.full_name, u.email, u.phone, u.created_at, u.last_login,
                (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as total_bookings,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as total_orders
                FROM users u 
                WHERE {$whereClause} 
                ORDER BY u.created_at DESC 
                LIMIT ? OFFSET ?";

        $params[] = $perPage;
        $params[] = $offset;

        $customers = $this->db->query($sql, $params);

        Response::paginated($customers, $total, $page, $perPage);
    }

    private function getCustomer(int $id): void
    {
        $sql = "SELECT u.id, u.full_name, u.email, u.phone, u.created_at, u.last_login,
                (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as total_bookings,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as total_orders,
                (SELECT COALESCE(SUM(p.amount), 0) FROM payments p 
                 INNER JOIN bookings b ON p.booking_id = b.id 
                 WHERE b.user_id = u.id AND p.payment_status = 'Successful') as total_booking_spend,
                (SELECT COALESCE(SUM(p.amount), 0) FROM payments p 
                 INNER JOIN orders o ON p.order_id = o.id 
                 WHERE o.user_id = u.id AND p.payment_status = 'Successful') as total_order_spend
                FROM users u 
                WHERE u.id = ? AND u.role = 'customer'";

        $customer = $this->db->queryOne($sql, [$id]);

        if (!$customer) {
            Response::error('Customer not found', 404);
        }

        Response::success($customer, 'Customer retrieved successfully');
    }

    private function getCustomerBookings(int $id): void
    {
        $sql = "SELECT b.*, s.name as service_name, d.title as design_title 
                FROM bookings b 
                LEFT JOIN services s ON b.service_id = s.id 
                LEFT JOIN designs d ON b.design_id = d.id 
                WHERE b.user_id = ? 
                ORDER BY b.created_at DESC";

        $bookings = $this->db->query($sql, [$id]);

        Response::success($bookings, 'Customer bookings retrieved');
    }

    private function getCustomerOrders(int $id): void
    {
        $sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
        $orders = $this->db->query($sql, [$id]);

        Response::success($orders, 'Customer orders retrieved');
    }

    private function getCustomerFavorites(int $id): void
    {
        $sql = "SELECT d.*, sd.created_at as saved_at 
                FROM saved_designs sd 
                INNER JOIN designs d ON sd.design_id = d.id 
                WHERE sd.user_id = ? AND d.is_active = 1 
                ORDER BY sd.created_at DESC";

        $favorites = $this->db->query($sql, [$id]);

        Response::success($favorites, 'Customer favorites retrieved');
    }

    private function updateCustomer(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM users WHERE id = ? AND role = 'customer'", [$id]);
        if (!$existing) {
            Response::error('Customer not found', 404);
        }

        $data = [];
        $allowedFields = ['full_name', 'phone', 'is_active'];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('users', $data, $id);

        Response::success([], 'Customer updated successfully');
    }

    private function deactivateCustomer(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM users WHERE id = ? AND role = 'customer'", [$id]);
        if (!$existing) {
            Response::error('Customer not found', 404);
        }

        $this->db->update('users', ['is_active' => false], $id);

        Response::success([], 'Customer deactivated successfully');
    }
}