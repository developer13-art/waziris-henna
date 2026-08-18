<?php

namespace Middleware;

class RateLimitMiddleware
{
    private int $limit = 100;
    private int $window = 3600; // 1 hour

    public function check(): bool
    {
        session_start();
        
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = 'rate_limit_' . $ip;
        
        $currentTime = time();
        
        if (!isset($_SESSION[$key])) {
            $_SESSION[$key] = [
                'count' => 1,
                'start_time' => $currentTime,
            ];
            return true;
        }
        
        $data = $_SESSION[$key];
        
        if ($currentTime - $data['start_time'] > $this->window) {
            $_SESSION[$key] = [
                'count' => 1,
                'start_time' => $currentTime,
            ];
            return true;
        }
        
        if ($data['count'] >= $this->limit) {
            return false;
        }
        
        $_SESSION[$key]['count']++;
        return true;
    }
}