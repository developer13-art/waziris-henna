<?php

namespace Models;

use Config\Database;

class Booking
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
    }

    public function findByReference(string $reference): ?array
    {
        return $this->db->queryOne("SELECT * FROM bookings WHERE booking_reference = ?", [$reference]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('bookings', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('bookings', $data, $id);
    }

    public function checkDateAvailability(string $date): bool
    {
        $booking = $this->db->queryOne(
            "SELECT id FROM bookings WHERE event_date = ? AND booking_status NOT IN ('Cancelled', 'Rejected') LIMIT 1",
            [$date]
        );
        
        return $booking === null;
    }
}