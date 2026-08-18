<?php
// ============================================
// WAZIRI'S HENNA - API ENTRY POINT
// ============================================

declare(strict_types=1);

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

$logDir = __DIR__ . '/../logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}
ini_set('error_log', $logDir . '/error.log');

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

// Manual Autoloader
spl_autoload_register(function ($class) {
    $prefixes = [
        'Controllers\\' => __DIR__ . '/../src/Controllers/',
        'Models\\' => __DIR__ . '/../src/Models/',
        'Middleware\\' => __DIR__ . '/../src/Middleware/',
        'Services\\' => __DIR__ . '/../src/Services/',
        'Helpers\\' => __DIR__ . '/../src/Helpers/',
        'Config\\' => __DIR__ . '/../src/Config/',
    ];

    foreach ($prefixes as $prefix => $baseDir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) === 0) {
            $relativeClass = substr($class, $len);
            $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
            if (file_exists($file)) {
                require_once $file;
            }
            return;
        }
    }
});

// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $envLines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($envLines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, '"\'');
            if (!getenv($key)) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
            }
        }
    }
}

use Config\Database;
use Helpers\Response;

$database = Database::getInstance();

// ==================== ROUTING ====================
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);
$uriParts = explode('/', trim($uri, '/'));
$resource = $uriParts[0] ?? '';
$id = $uriParts[1] ?? null;
$action = $uriParts[2] ?? null;

// For /auth/login, the URI parts are: ['auth', 'login']
// So resource = 'auth', id = 'login', action = null
// We need to fix this

try {
    $controllerClass = null;

    switch ($resource) {
        case 'auth':
            $controllerClass = 'Controllers\\AuthController';
            // For auth routes, the second part IS the action
            if ($id && !$action) {
                $action = $id;
                $id = null;
            }
            break;
            
        case 'services':
            $controllerClass = 'Controllers\\ServiceController';
            break;
            
        case 'designs':
            $controllerClass = 'Controllers\\DesignController';
            break;
            
        case 'categories':
            $controllerClass = 'Controllers\\DesignCategoryController';
            break;
            
        case 'products':
            $controllerClass = 'Controllers\\ProductController';
            break;
            
        case 'bookings':
            $controllerClass = 'Controllers\\BookingController';
            break;
            
        case 'orders':
            $controllerClass = 'Controllers\\OrderController';
            break;
            
        case 'payments':
            $controllerClass = 'Controllers\\PaymentController';
            break;
            
        case 'reviews':
            $controllerClass = 'Controllers\\ReviewController';
            break;
            
        case 'journal':
            $controllerClass = 'Controllers\\JournalController';
            break;
            
        case 'dashboard':
            $controllerClass = 'Controllers\\DashboardController';
            break;
            
        case 'reports':
            $controllerClass = 'Controllers\\ReportController';
            break;
            
        case 'settings':
            $controllerClass = 'Controllers\\SettingsController';
            break;
            
        case 'customers':
            $controllerClass = 'Controllers\\CustomerController';
            break;
            
        default:
            Response::error('Endpoint not found', 404);
            exit();
    }

    if ($controllerClass && class_exists($controllerClass)) {
        $controller = new $controllerClass();
        $controller->handle($method, $id, $action);
    } else {
        Response::error('Controller not found: ' . $controllerClass, 500);
    }

} catch (Exception $e) {
    Response::error($e->getMessage(), 500);
}