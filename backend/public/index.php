<?php
// ============================================
// WAZIRI'S HENNA - API ENTRY POINT
// ============================================

declare(strict_types=1);

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../logs/error.log');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Autoload
require_once __DIR__ . '/../vendor/autoload.php';

use Config\Database;
use Helpers\Response;
use Middleware\CorsMiddleware;
use Middleware\AuthMiddleware;

// Initialize
$database = Database::getInstance();
$cors = new CorsMiddleware();
$cors->handle();

// Get request data
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);
$uriParts = explode('/', trim($uri, '/'));
$resource = $uriParts[0] ?? '';
$id = $uriParts[1] ?? null;
$action = $uriParts[2] ?? null;

// Route the request
try {
    switch ($resource) {
        case 'auth':
            require_once __DIR__ . '/../src/Controllers/AuthController.php';
            $controller = new Controllers\AuthController();
            break;
            
        case 'services':
            require_once __DIR__ . '/../src/Controllers/ServiceController.php';
            $controller = new Controllers\ServiceController();
            break;
            
        case 'designs':
            require_once __DIR__ . '/../src/Controllers/DesignController.php';
            $controller = new Controllers\DesignController();
            break;
            
        case 'categories':
            require_once __DIR__ . '/../src/Controllers/DesignCategoryController.php';
            $controller = new Controllers\DesignCategoryController();
            break;
            
        case 'products':
            require_once __DIR__ . '/../src/Controllers/ProductController.php';
            $controller = new Controllers\ProductController();
            break;
            
        case 'bookings':
            require_once __DIR__ . '/../src/Controllers/BookingController.php';
            $controller = new Controllers\BookingController();
            break;
            
        case 'orders':
            require_once __DIR__ . '/../src/Controllers/OrderController.php';
            $controller = new Controllers\OrderController();
            break;
            
        case 'payments':
            require_once __DIR__ . '/../src/Controllers/PaymentController.php';
            $controller = new Controllers\PaymentController();
            break;
            
        case 'reviews':
            require_once __DIR__ . '/../src/Controllers/ReviewController.php';
            $controller = new Controllers\ReviewController();
            break;
            
        case 'journal':
            require_once __DIR__ . '/../src/Controllers/JournalController.php';
            $controller = new Controllers\JournalController();
            break;
            
        case 'dashboard':
            require_once __DIR__ . '/../src/Controllers/DashboardController.php';
            $controller = new Controllers\DashboardController();
            break;
            
        case 'reports':
            require_once __DIR__ . '/../src/Controllers/ReportController.php';
            $controller = new Controllers\ReportController();
            break;
            
        case 'settings':
            require_once __DIR__ . '/../src/Controllers/SettingsController.php';
            $controller = new Controllers\SettingsController();
            break;
            
        case 'customers':
            require_once __DIR__ . '/../src/Controllers/CustomerController.php';
            $controller = new Controllers\CustomerController();
            break;
            
        default:
            Response::error('Endpoint not found', 404);
            exit();
    }

    // Dispatch request
    $controller->handle($method, $id, $action);

} catch (Exception $e) {
    Response::error($e->getMessage(), 500);
}