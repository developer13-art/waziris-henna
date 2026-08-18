<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;

class ReportController
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
                switch ($action) {
                    case 'bookings':
                        $this->getBookingReport();
                        break;
                    case 'sales':
                        $this->getSalesReport();
                        break;
                    case 'products':
                        $this->getProductReport();
                        break;
                    case 'customers':
                        $this->getCustomerReport();
                        break;
                    default:
                        $this->getGeneralReport();
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getGeneralReport(): void
    {
        $report = [
            'summary' => [
                'total_bookings' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM bookings")['total'] ?? 0),
                'total_orders' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM orders")['total'] ?? 0),
                'total_customers' => (int)($this->db->queryOne("SELECT COUNT(*) as total FROM users WHERE role = 'customer'")['total'] ?? 0),
                'total_revenue' => (float)($this->db->queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Successful'")['total'] ?? 0),
                'total_products_sold' => (int)($this->db->queryOne("SELECT COALESCE(SUM(quantity), 0) as total FROM order_items")['total'] ?? 0),
                'average_rating' => (float)($this->db->queryOne("SELECT COALESCE(AVG(rating), 0) as avg_rating FROM reviews WHERE status = 'Approved'")['avg_rating'] ?? 0),
            ],
            'booking_status_breakdown' => $this->db->query(
                "SELECT booking_status, COUNT(*) as count FROM bookings GROUP BY booking_status"
            ),
            'order_status_breakdown' => $this->db->query(
                "SELECT order_status, COUNT(*) as count FROM orders GROUP BY order_status"
            ),
            'payment_status_breakdown' => $this->db->query(
                "SELECT payment_status, COUNT(*) as count FROM payments GROUP BY payment_status"
            ),
        ];

        Response::success($report, 'General report retrieved');
    }

    private function getBookingReport(): void
    {
        $dateFrom = $_GET['date_from'] ?? date('Y-m-01');
        $dateTo = $_GET['date_to'] ?? date('Y-m-d');

        $report = $this->db->query(
            "SELECT 
                DATE(event_date) as booking_date,
                COUNT(*) as total_bookings,
                SUM(CASE WHEN booking_status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN booking_status = 'Completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN booking_status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled,
                SUM(total_amount) as total_amount
             FROM bookings 
             WHERE event_date BETWEEN ? AND ? 
             GROUP BY DATE(event_date) 
             ORDER BY booking_date ASC",
            [$dateFrom, $dateTo]
        );

        Response::success($report, 'Booking report retrieved');
    }

    private function getSalesReport(): void
    {
        $dateFrom = $_GET['date_from'] ?? date('Y-m-01');
        $dateTo = $_GET['date_to'] ?? date('Y-m-d');

        $report = $this->db->query(
            "SELECT 
                DATE(created_at) as sale_date,
                COUNT(*) as total_transactions,
                SUM(amount) as total_amount
             FROM payments 
             WHERE payment_status = 'Successful' 
             AND created_at BETWEEN ? AND ? 
             GROUP BY DATE(created_at) 
             ORDER BY sale_date ASC",
            [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']
        );

        Response::success($report, 'Sales report retrieved');
    }

    private function getProductReport(): void
    {
        $report = $this->db->query(
            "SELECT 
                p.id, p.name, p.price, p.stock_quantity,
                COALESCE(SUM(oi.quantity), 0) as total_sold,
                COALESCE(SUM(oi.subtotal), 0) as total_revenue
             FROM products p 
             LEFT JOIN order_items oi ON p.id = oi.product_id 
             LEFT JOIN orders o ON oi.order_id = o.id 
             WHERE o.order_status NOT IN ('Cancelled')
             GROUP BY p.id, p.name, p.price, p.stock_quantity 
             ORDER BY total_sold DESC"
        );

        Response::success($report, 'Product report retrieved');
    }

    private function getCustomerReport(): void
    {
        $report = $this->db->query(
            "SELECT 
                u.id, u.full_name, u.email, u.phone,
                COUNT(DISTINCT b.id) as total_bookings,
                COUNT(DISTINCT o.id) as total_orders,
                COALESCE(SUM(CASE WHEN p.payment_status = 'Successful' THEN p.amount ELSE 0 END), 0) as total_spent
             FROM users u 
             LEFT JOIN bookings b ON u.id = b.user_id 
             LEFT JOIN orders o ON u.id = o.user_id 
             LEFT JOIN payments p ON (p.booking_id = b.id OR p.order_id = o.id)
             WHERE u.role = 'customer' 
             GROUP BY u.id, u.full_name, u.email, u.phone 
             ORDER BY total_spent DESC"
        );

        Response::success($report, 'Customer report retrieved');
    }
}