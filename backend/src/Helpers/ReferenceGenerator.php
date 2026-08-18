<?php

namespace Helpers;

class ReferenceGenerator
{
    public static function bookingReference(): string
    {
        return 'WH-BKG-' . strtoupper(uniqid());
    }

    public static function orderReference(): string
    {
        return 'WH-ORD-' . strtoupper(uniqid());
    }

    public static function paymentReference(): string
    {
        return 'WH-PAY-' . strtoupper(uniqid());
    }

    public static function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        $text = strtolower($text);
        return $text ?: 'item-' . time();
    }
}