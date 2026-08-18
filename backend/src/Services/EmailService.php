<?php

namespace Services;

class EmailService
{
    public function sendBookingConfirmation(array $booking): bool
    {
        $to = $booking['customer_email'];
        $subject = 'Booking Confirmation - ' . $booking['booking_reference'];
        $message = $this->buildBookingEmail($booking);
        
        return $this->send($to, $subject, $message);
    }

    public function sendOrderConfirmation(array $order): bool
    {
        $to = $order['customer_email'];
        $subject = 'Order Confirmation - ' . $order['order_reference'];
        $message = $this->buildOrderEmail($order);
        
        return $this->send($to, $subject, $message);
    }

    private function buildBookingEmail(array $booking): string
    {
        return "
            <h2>Booking Confirmation</h2>
            <p>Dear {$booking['customer_name']},</p>
            <p>Your booking has been received successfully.</p>
            <p><strong>Booking Reference:</strong> {$booking['booking_reference']}</p>
            <p><strong>Event Date:</strong> {$booking['event_date']}</p>
            <p><strong>Number of People:</strong> {$booking['number_of_people']}</p>
            <p>We will contact you shortly to confirm your booking.</p>
            <p>Thank you for choosing Waziri's Henna!</p>
        ";
    }

    private function buildOrderEmail(array $order): string
    {
        return "
            <h2>Order Confirmation</h2>
            <p>Dear {$order['customer_name']},</p>
            <p>Your order has been received successfully.</p>
            <p><strong>Order Reference:</strong> {$order['order_reference']}</p>
            <p><strong>Total Amount:</strong> ₦{$order['total_amount']}</p>
            <p>We will notify you when your order is ready.</p>
            <p>Thank you for shopping with Waziri's Henna!</p>
        ";
    }

    private function send(string $to, string $subject, string $message): bool
    {
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: Waziri's Henna <noreply@wazirishenna.com>\r\n";
        
        return mail($to, $subject, $message, $headers);
    }
}