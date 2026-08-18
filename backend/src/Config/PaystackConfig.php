<?php

namespace Config;

class PaystackConfig
{
    private static array $config = [];

    public static function load(): void
    {
        self::$config = [
            'secret_key' => $_ENV['PAYSTACK_SECRET_KEY'] ?? '',
            'public_key' => $_ENV['PAYSTACK_PUBLIC_KEY'] ?? '',
            'base_url' => 'https://api.paystack.co',
        ];
    }

    public static function getSecretKey(): string
    {
        if (empty(self::$config)) {
            self::load();
        }
        return self::$config['secret_key'];
    }

    public static function getPublicKey(): string
    {
        if (empty(self::$config)) {
            self::load();
        }
        return self::$config['public_key'];
    }

    public static function getBaseUrl(): string
    {
        return self::$config['base_url'];
    }
}