<?php

namespace Helpers;

class Response
{
    public static function success($data = [], string $message = 'Success', int $code = 200): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
        exit();
    }

    public static function error(string $message = 'Error', int $code = 400, $errors = []): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ]);
        exit();
    }

    public static function paginated(array $data, int $total, int $page, int $perPage): void
    {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'total_pages' => ceil($total / $perPage)
            ]
        ]);
        exit();
    }
}