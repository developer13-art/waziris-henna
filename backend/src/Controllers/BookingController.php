<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class BookingController
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
                if ($id && $action === 'status') {
                    $this->getBookingStatus((int)$id);
                } elseif ($id) {
                    $this->getBooking((int)$id);
                } else {
                    $this->getAllBookings();
                }
                break;
            case 'POST':
                if ($id && $action === 'status') {
                    $this->updateBookingStatus((int)$id);
                } else {
                    $this->createBooking();
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->cancelBooking((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllBookings(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $where = ['1=1'];
        $params = [];

        if (!empty($_GET['status'])) {
            $where[] = 'b.booking_status = ?';
            $params[] = $_GET['status'];
        }
        if (!empty($_GET['payment_status'])) {
            $where[] = 'b.payment_status = ?';
            $params[] = $_GET['payment_status'];
        }
        if (!empty($_GET['date_from'])) {
            $where[] = 'b.event_date >= ?';
            $params[] = $_GET['date_from'];
        }
        if (!empty($_GET['date_to'])) {
            $where[] = 'b.event_date <= ?';
            $params[] = $_GET['date_to'];
        }
        if (!empty($_GET['search'])) {
            $where[] = '(b.customer_name LIKE ? OR b.booking_reference LIKE ? OR b.customer_phone LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) as total FROM bookings b WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);

        $sql = "SELECT b.*, s.name as service_name, d.title as design_title 
                FROM bookings b 
                LEFT JOIN services s ON b.service_id = s.id 
                LEFT JOIN designs d ON b.design_id = d.id 
                WHERE {$whereClause} 
                ORDER BY b.created_at DESC 
                LIMIT ? OFFSET ?";

        $params[] = $perPage;
        $params[] = $offset;

        $bookings = $this->db->query($sql, $params);

        Response::paginated($bookings, $total, $page, $perPage);
    }

    private function getBooking(int $id): void
    {
        $sql = "SELECT b.*, s.name as service_name, d.title as design_title, d.image_url as design_image 
                FROM bookings b 
                LEFT JOIN services s ON b.service_id = s.id 
                LEFT JOIN designs d ON b.design_id = d.id 
                WHERE b.id = ?";

        $booking = $this->db->queryOne($sql, [$id]);

        if (!$booking) {
            Response::error('Booking not found', 404);
        }

        // Get payment info
        $payment = $this->db->queryOne(
            "SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1",
            [$id]
        );

        $booking['payment'] = $payment;

        Response::success($booking, 'Booking retrieved successfully');
    }

    private function getBookingStatus(int $id): void
    {
        $booking = $this->db->queryOne(
            "SELECT booking_reference, booking_status, payment_status, event_date, event_time 
             FROM bookings WHERE id = ?",
            [$id]
        );

        if (!$booking) {
            Response::error('Booking not found', 404);
        }

        Response::success($booking, 'Booking status retrieved');
    }

    private function createBooking(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $customerName = trim($input['customer_name'] ?? '');
        $customerPhone = trim($input['customer_phone'] ?? '');
        $eventDate = $input['event_date'] ?? null;
        $serviceId = $input['service_id'] ?? null;
        $designId = $input['design_id'] ?? null;

        if (empty($customerName)) {
            Response::error('Customer name is required');
        }
        if (empty($customerPhone)) {
            Response::error('Customer phone is required');
        }
        if (empty($eventDate)) {
            Response::error('Event date is required');
        }

        // Handle empty string values - convert to NULL
        $serviceId = !empty($serviceId) ? (int)$serviceId : null;
        $designId = !empty($designId) ? (int)$designId : null;
        $customerEmail = !empty($input['customer_email']) ? $input['customer_email'] : null;
        $eventTime = !empty($input['event_time']) ? $input['event_time'] : null;
        $additionalNotes = !empty($input['additional_notes']) ? $input['additional_notes'] : null;
        $userId = !empty($input['user_id']) ? (int)$input['user_id'] : null;

        // Validate service_id exists
        if ($serviceId) {
            $service = $this->db->queryOne("SELECT id FROM services WHERE id = ?", [$serviceId]);
            if (!$service) {
                Response::error('Invalid service selected');
            }
        }

        // Validate design_id exists if provided
        if ($designId) {
            $design = $this->db->queryOne("SELECT id FROM designs WHERE id = ?", [$designId]);
            if (!$design) {
                Response::error('Invalid design selected');
            }
        }

        // Check if date is available
        $existingBooking = $this->db->queryOne(
            "SELECT id FROM bookings WHERE event_date = ? AND booking_status NOT IN ('Cancelled', 'Rejected') LIMIT 1",
            [$eventDate]
        );

        if ($existingBooking) {
            Response::error('This date is already booked. Please choose another date.');
        }

        $bookingReference = ReferenceGenerator::bookingReference();

        $data = [
            'booking_reference' => $bookingReference,
            'user_id' => $userId,
            'customer_name' => $customerName,
            'customer_email' => $customerEmail,
            'customer_phone' => $customerPhone,
            'service_id' => $serviceId,
            'design_id' => $designId,
            'event_type' => $input['event_type'] ?? 'Other',
            'event_date' => $eventDate,
            'event_time' => $eventTime,
            'number_of_people' => (int)($input['number_of_people'] ?? 1),
            'additional_notes' => $additionalNotes,
            'booking_status' => 'Pending',
            'payment_status' => 'Pending',
            'total_amount' => (float)($input['total_amount'] ?? 0),
        ];

        $id = $this->db->insert('bookings', $data);

        Response::success([
            'id' => $id,
            'booking_reference' => $bookingReference,
        ], 'Booking created successfully', 201);
    }

    private function updateBookingStatus(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $booking = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$booking) {
            Response::error('Booking not found', 404);
        }

        $allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];
        $newStatus = $input['booking_status'] ?? null;

        if (!$newStatus || !in_array($newStatus, $allowedStatuses)) {
            Response::error('Invalid booking status');
        }

        $this->db->update('bookings', ['booking_status' => $newStatus], $id);

        Response::success([], 'Booking status updated successfully');
    }

    private function cancelBooking(int $id): void
    {
        $booking = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$booking) {
            Response::error('Booking not found', 404);
        }

        $this->db->update('bookings', ['booking_status' => 'Cancelled'], $id);

        Response::success([], 'Booking cancelled successfully');
    }
}