<?php

namespace Middleware;

use Helpers\Response;

class AuthMiddleware
{
    public static function authenticate(): void
    {
        $token = self::getBearerToken();

        if (!$token) {
            Response::error('Authentication required', 401);
        }

        // In production, verify JWT token
        // For now, check if token exists in session or database
        // This is a simplified version - use proper JWT in production
    }

    public static function authorizeAdmin(): void
    {
        self::authenticate();

        // Check if user is admin
        // In production, decode JWT and check role
        $isAdmin = $_SERVER['HTTP_X_ADMIN'] ?? false;

        if (!$isAdmin) {
            Response::error('Admin access required', 403);
        }
    }

    private static function getBearerToken(): ?string
    {
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            return $matches[1];
        }

        return null;
    }
}