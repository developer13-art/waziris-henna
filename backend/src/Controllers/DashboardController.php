<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;

class DashboardController
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
                if ($action === 'stats') {
                    $this->getStats();
                } elseif ($action === 'recent-bookings') {
                    $this->getRecentBookings();
                } elseif ($action === 'recent-orders') {
                    $this->getRecentOrders();
                } elseif ($action === 'revenue') {
                    $this->getRevenueData();
                } else {
                    $this->getOverview();
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getOverview(): void
    {
        $stats = [
            'total_customers' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM users WHERE role = 'customer'")['total'] ?? 0),
            'total_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings")['total'] ?? 0),
            'pending_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'Pending'")['total'] ?? 0),
            'confirmed_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'Confirmed'")['total'] ?? 0),
            'total_orders' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM orders")['total'] ?? 0),
            'pending_orders' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM orders WHERE order_status = 'Pending'")['total'] ?? 0),
            'total_products' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM products WHERE is_active = 1")['total'] ?? 0),
            'low_stock_products' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM products WHERE stock_quantity <= low_stock_threshold AND is_active = 1")['total'] ?? 0),
            'total_designs' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM designs WHERE is_active = 1")['total'] ?? 0),
            'total_services' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM services WHERE is_active = 1")['total'] ?? 0),
            'pending_reviews' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM reviews WHERE status = 'Pending'")['total'] ?? 0),
            'total_revenue' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful'")['total'] ?? 0),
        ];

        Response::success($stats, 'Dashboard overview retrieved');
    }

    private function getStats(): void
    {
        $overview = [
            'total_customers' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM users WHERE role = 'customer'")['total'] ?? 0),
            'total_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings")['total'] ?? 0),
            'pending_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'Pending'")['total'] ?? 0),
            'confirmed_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'Confirmed'")['total'] ?? 0),
            'completed_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'Completed'")['total'] ?? 0),
            'cancelled_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'Cancelled'")['total'] ?? 0),
            'total_orders' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM orders")['total'] ?? 0),
            'pending_orders' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM orders WHERE order_status = 'Pending'")['total'] ?? 0),
            'completed_orders' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM orders WHERE order_status = 'Completed'")['total'] ?? 0),
            'total_products' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM products WHERE is_active = 1")['total'] ?? 0),
            'low_stock_products' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM products WHERE stock_quantity <= low_stock_threshold AND is_active = 1")['total'] ?? 0),
            'out_of_stock' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM products WHERE stock_quantity = 0 AND is_active = 1")['total'] ?? 0),
            'total_designs' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM designs WHERE is_active = 1")['total'] ?? 0),
            'total_services' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM services WHERE is_active = 1")['total'] ?? 0),
            'pending_reviews' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM reviews WHERE status = 'Pending'")['total'] ?? 0),
            'approved_reviews' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM reviews WHERE status = 'Approved'")['total'] ?? 0),
            'total_articles' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM journal_articles WHERE is_published = 1")['total'] ?? 0),
            'total_revenue' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful'")['total'] ?? 0),
        ];

        Response::success($overview, 'Stats retrieved');
    }

    private function getRecentBookings(): void
    {
        $sql = "SELECT b.*, s.name as service_name, d.title as design_title 
                FROM bookings b 
                LEFT JOIN services s ON b.service_id = s.id 
                LEFT JOIN designs d ON b.design_id = d.id 
                ORDER BY b.created_at DESC 
                LIMIT 10";

        $bookings = $this->db->query($sql);

        Response::success($bookings, 'Recent bookings retrieved');
    }

    private function getRecentOrders(): void
    {
        $sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10";
        $orders = $this->db->query($sql);

        Response::success($orders, 'Recent orders retrieved');
    }

    private function getRevenueData(): void
    {
        $period = $_GET['period'] ?? 'month';

        switch ($period) {
            case 'week':
                $sql = "SELECT DATE(created_at) as date, SUM(amount) as revenue 
                        FROM payments 
                        WHERE payment_status = 'Successful' 
                        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
                        GROUP BY DATE(created_at) 
                        ORDER BY date ASC";
                break;
            case 'year':
                $sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') as date, SUM(amount) as revenue 
                        FROM payments 
                        WHERE payment_status = 'Successful' 
                        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) 
                        GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
                        ORDER BY date ASC";
                break;
            default:
                $sql = "SELECT DATE(created_at) as date, SUM(amount) as revenue 
                        FROM payments 
                        WHERE payment_status = 'Successful' 
                        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
                        GROUP BY DATE(created_at) 
                        ORDER BY date ASC";
        }

        $revenue = $this->db->query($sql);

        // Also get totals
        $totals = [
            'today' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful' AND DATE(created_at) = CURDATE()")['total'] ?? 0),
            'this_week' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")['total'] ?? 0),
            'this_month' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")['total'] ?? 0),
            'this_year' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)")['total'] ?? 0),
        ];

        Response::success([
            'revenue_data' => $revenue,
            'totals' => $totals,
        ], 'Revenue data retrieved');
    }
}