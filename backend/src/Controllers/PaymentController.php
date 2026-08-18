<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;
use Services\PaystackService;

class PaymentController
{
    private $db;
    private $paystack;

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->paystack = new PaystackService();
    }

    public function handle(string $method, ?string $id = null, ?string $action = null): void
    {
        switch ($method) {
            case 'GET':
                if ($id && $action === 'verify') {
                    $this->verifyPayment($id);
                } elseif ($id) {
                    $this->getPayment((int)$id);
                } else {
                    $this->getAllPayments();
                }
                break;
            case 'POST':
                if ($id && $action === 'initialize') {
                    $this->initializePayment((int)$id);
                } elseif ($action === 'webhook') {
                    $this->handleWebhook();
                } else {
                    $this->createPayment();
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllPayments(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $where = ['1=1'];
        $params = [];

        if (!empty($_GET['status'])) {
            $where[] = 'p.payment_status = ?';
            $params[] = $_GET['status'];
        }
        if (!empty($_GET['method'])) {
            $where[] = 'p.payment_method = ?';
            $params[] = $_GET['method'];
        }
        if (!empty($_GET['date_from'])) {
            $where[] = 'DATE(p.created_at) >= ?';
            $params[] = $_GET['date_from'];
        }
        if (!empty($_GET['date_to'])) {
            $where[] = 'DATE(p.created_at) <= ?';
            $params[] = $_GET['date_to'];
        }

        $whereClause = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) as total FROM payments p WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);

        $sql = "SELECT p.*, b.booking_reference, o.order_reference 
                FROM payments p 
                LEFT JOIN bookings b ON p.booking_id = b.id 
                LEFT JOIN orders o ON p.order_id = o.id 
                WHERE {$whereClause} 
                ORDER BY p.created_at DESC 
                LIMIT ? OFFSET ?";

        $params[] = $perPage;
        $params[] = $offset;

        $payments = $this->db->query($sql, $params);

        Response::paginated($payments, $total, $page, $perPage);
    }

    private function getPayment(int $id): void
    {
        $sql = "SELECT p.*, b.booking_reference, o.order_reference 
                FROM payments p 
                LEFT JOIN bookings b ON p.booking_id = b.id 
                LEFT JOIN orders o ON p.order_id = o.id 
                WHERE p.id = ?";

        $payment = $this->db->queryOne($sql, [$id]);

        if (!$payment) {
            Response::error('Payment not found', 404);
        }

        Response::success($payment, 'Payment retrieved successfully');
    }

    private function initializePayment(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $paymentType = $input['payment_type'] ?? null; // 'booking' or 'order'
        $email = $input['email'] ?? null;
        $amount = (float)($input['amount'] ?? 0);
        $callbackUrl = $input['callback_url'] ?? null;

        if (!$paymentType || !in_array($paymentType, ['booking', 'order'])) {
            Response::error('Invalid payment type');
        }

        if (!$email) {
            Response::error('Email is required for payment');
        }

        if ($amount <= 0) {
            Response::error('Invalid payment amount');
        }

        // Create payment record
        $paymentReference = ReferenceGenerator::paymentReference();

        $paymentData = [
            'payment_reference' => $paymentReference,
            'booking_id' => $paymentType === 'booking' ? $id : null,
            'order_id' => $paymentType === 'order' ? $id : null,
            'amount' => $amount,
            'currency' => 'NGN',
            'payment_method' => 'Paystack',
            'payment_status' => 'Pending',
        ];

        $paymentId = $this->db->insert('payments', $paymentData);

        // Initialize Paystack transaction
        $result = $this->paystack->initializeTransaction([
            'email' => $email,
            'amount' => $amount * 100, // Convert to kobo
            'reference' => $paymentReference,
            'callback_url' => $callbackUrl,
            'metadata' => [
                'payment_id' => $paymentId,
                'payment_type' => $paymentType,
                'booking_id' => $paymentType === 'booking' ? $id : null,
                'order_id' => $paymentType === 'order' ? $id : null,
            ]
        ]);

        if (!$result['success']) {
            $this->db->update('payments', ['payment_status' => 'Failed', 'failure_reason' => $result['message']], $paymentId);
            Response::error('Failed to initialize payment: ' . $result['message']);
        }

        Response::success([
            'payment_id' => $paymentId,
            'authorization_url' => $result['authorization_url'],
            'reference' => $paymentReference,
        ], 'Payment initialized successfully');
    }

    private function verifyPayment(string $reference): void
    {
        $payment = $this->db->queryOne("SELECT * FROM payments WHERE payment_reference = ?", [$reference]);

        if (!$payment) {
            Response::error('Payment not found', 404);
        }

        if ($payment['payment_status'] === 'Successful') {
            Response::success($payment, 'Payment already verified');
        }

        $result = $this->paystack->verifyTransaction($reference);

        if (!$result['success']) {
            Response::error('Failed to verify payment: ' . $result['message']);
        }

        $transactionData = $result['data'];

        $this->db->beginTransaction();

        try {
            // Update payment record
            $this->db->update('payments', [
                'payment_status' => 'Successful',
                'paystack_transaction_id' => $transactionData['id'] ?? null,
                'paystack_reference' => $transactionData['reference'] ?? $reference,
                'paystack_authorization_code' => $transactionData['authorization']['authorization_code'] ?? null,
                'payment_date' => date('Y-m-d H:i:s'),
            ], (int)$payment['id']);

            // Update booking or order payment status
            if ($payment['booking_id']) {
                $this->db->update('bookings', ['payment_status' => 'Successful'], (int)$payment['booking_id']);
            }

            if ($payment['order_id']) {
                $this->db->update('orders', [
                    'payment_status' => 'Successful',
                    'order_status' => 'Paid',
                ], (int)$payment['order_id']);
            }

            $this->db->commit();

            Response::success([
                'payment_id' => $payment['id'],
                'status' => 'Successful',
                'reference' => $reference,
            ], 'Payment verified successfully');

        } catch (\Exception $e) {
            $this->db->rollBack();
            Response::error('Failed to verify payment: ' . $e->getMessage(), 500);
        }
    }

    private function handleWebhook(): void
    {
        $payload = file_get_contents('php://input');
        $signature = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '';

        // Verify webhook signature
        $secretKey = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';
        $expectedSignature = hash_hmac('sha512', $payload, $secretKey);

        if (!hash_equals($expectedSignature, $signature)) {
            Response::error('Invalid webhook signature', 401);
        }

        $event = json_decode($payload, true);

        if (!$event || !isset($event['event'])) {
            Response::error('Invalid webhook payload');
        }

        switch ($event['event']) {
            case 'charge.success':
                $this->processWebhookSuccess($event['data']);
                break;
            case 'charge.failed':
                $this->processWebhookFailure($event['data']);
                break;
            default:
                // Ignore other events
                break;
        }

        Response::success([], 'Webhook processed');
    }

    private function processWebhookSuccess(array $data): void
    {
        $reference = $data['reference'] ?? null;

        if (!$reference) {
            return;
        }

        $payment = $this->db->queryOne("SELECT * FROM payments WHERE payment_reference = ?", [$reference]);

        if (!$payment || $payment['payment_status'] === 'Successful') {
            return;
        }

        $this->db->beginTransaction();

        try {
            $this->db->update('payments', [
                'payment_status' => 'Successful',
                'paystack_transaction_id' => $data['id'] ?? null,
                'paystack_reference' => $reference,
                'paystack_authorization_code' => $data['authorization']['authorization_code'] ?? null,
                'payment_date' => date('Y-m-d H:i:s'),
            ], (int)$payment['id']);

            if ($payment['booking_id']) {
                $this->db->update('bookings', ['payment_status' => 'Successful'], (int)$payment['booking_id']);
            }

            if ($payment['order_id']) {
                $this->db->update('orders', [
                    'payment_status' => 'Successful',
                    'order_status' => 'Paid',
                ], (int)$payment['order_id']);
            }

            $this->db->commit();
        } catch (\Exception $e) {
            $this->db->rollBack();
        }
    }

    private function processWebhookFailure(array $data): void
    {
        $reference = $data['reference'] ?? null;

        if (!$reference) {
            return;
        }

        $payment = $this->db->queryOne("SELECT * FROM payments WHERE payment_reference = ?", [$reference]);

        if (!$payment) {
            return;
        }

        $this->db->update('payments', [
            'payment_status' => 'Failed',
            'failure_reason' => $data['gateway_response'] ?? 'Payment failed',
        ], (int)$payment['id']);
    }

    private function createPayment(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $amount = (float)($input['amount'] ?? 0);
        $bookingId = $input['booking_id'] ?? null;
        $orderId = $input['order_id'] ?? null;

        if ($amount <= 0) {
            Response::error('Invalid payment amount');
        }

        if (!$bookingId && !$orderId) {
            Response::error('Booking ID or Order ID is required');
        }

        $paymentReference = ReferenceGenerator::paymentReference();

        $data = [
            'payment_reference' => $paymentReference,
            'booking_id' => $bookingId,
            'order_id' => $orderId,
            'amount' => $amount,
            'currency' => 'NGN',
            'payment_method' => $input['payment_method'] ?? 'Manual',
            'payment_status' => $input['payment_status'] ?? 'Pending',
        ];

        $id = $this->db->insert('payments', $data);

        Response::success(['id' => $id, 'payment_reference' => $paymentReference], 'Payment record created', 201);
    }
}