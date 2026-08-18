<?php

namespace Middleware;

class CorsMiddleware
{
    private array $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080',
    ];

    public function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $this->allowedOrigins) || empty($origin)) {
            header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        }
    }
}