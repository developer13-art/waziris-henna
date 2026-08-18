<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;

class ReviewController
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
                if ($id) {
                    $this->getReview((int)$id);
                } else {
                    $this->getAllReviews();
                }
                break;
            case 'POST':
                $this->createReview();
                break;
            case 'PUT':
                if ($id) {
                    $this->updateReview((int)$id);
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deleteReview((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllReviews(): void
    {
        $where = ['r.status = "Approved"'];
        $params = [];

        if (!empty($_GET['type'])) {
            $where[] = 'r.review_type = ?';
            $params[] = $_GET['type'];
        }
        if (!empty($_GET['rating'])) {
            $where[] = 'r.rating = ?';
            $params[] = (int)$_GET['rating'];
        }
        if (!empty($_GET['featured'])) {
            $where[] = 'r.is_featured = 1';
        }

        $whereClause = implode(' AND ', $where);

        $sql = "SELECT r.*, s.name as service_name, p.name as product_name 
                FROM reviews r 
                LEFT JOIN services s ON r.service_id = s.id 
                LEFT JOIN products p ON r.product_id = p.id 
                WHERE {$whereClause} 
                ORDER BY r.created_at DESC 
                LIMIT 50";

        $reviews = $this->db->query($sql, $params);

        Response::success($reviews, 'Reviews retrieved successfully');
    }

    private function getReview(int $id): void
    {
        $sql = "SELECT * FROM reviews WHERE id = ?";
        $review = $this->db->queryOne($sql, [$id]);

        if (!$review) {
            Response::error('Review not found', 404);
        }

        Response::success($review, 'Review retrieved successfully');
    }

    private function createReview(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $rating = (int)($input['rating'] ?? 0);
        $comment = trim($input['comment'] ?? '');

        if ($rating < 1 || $rating > 5) {
            Response::error('Rating must be between 1 and 5');
        }

        if (empty($comment)) {
            Response::error('Comment is required');
        }

        $data = [
            'user_id' => $input['user_id'] ?? null,
            'customer_name' => $input['customer_name'] ?? 'Anonymous',
            'customer_email' => $input['customer_email'] ?? null,
            'rating' => $rating,
            'title' => $input['title'] ?? null,
            'comment' => $comment,
            'review_type' => $input['review_type'] ?? 'service',
            'service_id' => $input['service_id'] ?? null,
            'product_id' => $input['product_id'] ?? null,
            'booking_id' => $input['booking_id'] ?? null,
            'status' => 'Pending',
        ];

        $id = $this->db->insert('reviews', $data);

        Response::success(['id' => $id], 'Review submitted successfully. It will be published after approval.', 201);
    }

    private function updateReview(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM reviews WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Review not found', 404);
        }

        $data = [];
        $allowedFields = ['status', 'is_featured'];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('reviews', $data, $id);

        Response::success([], 'Review updated successfully');
    }

    private function deleteReview(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM reviews WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Review not found', 404);
        }

        $this->db->delete('reviews', $id);

        Response::success([], 'Review deleted successfully');
    }
}