<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;

class AuthController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function handle(string $method, ?string $id = null, ?string $action = null): void
    {
        switch ($method) {
            case 'POST':
                if ($action === 'login') {
                    $this->login();
                } elseif ($action === 'register') {
                    $this->register();
                } elseif ($action === 'logout') {
                    $this->logout();
                } else {
                    // If no action specified but it's a POST, try login by default
                    $this->login();
                }
                break;
                
            case 'GET':
                if ($action === 'profile') {
                    $this->getProfile();
                } else {
                    Response::error('Invalid auth action', 400);
                }
                break;
                
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('Email and password are required');
        }

        $user = $this->db->queryOne(
            "SELECT * FROM users WHERE email = ? AND is_active = 1",
            [$email]
        );

        if (!$user) {
            Response::error('Invalid credentials', 401);
        }

        if (!password_verify($password, $user['password_hash'])) {
            Response::error('Invalid credentials', 401);
        }

        // Update last login
        $this->db->update('users', ['last_login' => date('Y-m-d H:i:s')], (int)$user['id']);

        // Generate token
        $token = bin2hex(random_bytes(32));

        unset($user['password_hash']);

        Response::success([
            'user' => $user,
            'token' => $token,
        ], 'Login successful');
    }

    private function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($name)) {
            Response::error('Name is required');
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Valid email is required');
        }
        if (empty($phone)) {
            Response::error('Phone number is required');
        }
        if (strlen($password) < 8) {
            Response::error('Password must be at least 8 characters');
        }

        $existing = $this->db->queryOne("SELECT id FROM users WHERE email = ?", [$email]);
        if ($existing) {
            Response::error('Email already exists');
        }

        $data = [
            'full_name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
            'role' => 'customer',
            'is_active' => true,
        ];

        $id = $this->db->insert('users', $data);

        $token = bin2hex(random_bytes(32));

        Response::success([
            'user' => [
                'id' => $id,
                'full_name' => $name,
                'email' => $email,
                'phone' => $phone,
                'role' => 'customer',
            ],
            'token' => $token,
        ], 'Registration successful', 201);
    }

    private function logout(): void
    {
        Response::success([], 'Logout successful');
    }

    private function getProfile(): void
    {
        $userId = (int)($_GET['user_id'] ?? 0);

        if (!$userId) {
            Response::error('User ID is required', 401);
        }

        $user = $this->db->queryOne(
            "SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?",
            [$userId]
        );

        if (!$user) {
            Response::error('User not found', 404);
        }

        Response::success($user, 'Profile retrieved');
    }
}