<?php

namespace Models;

use Config\Database;

class Settings
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll(string $group = null): array
    {
        if ($group) {
            return $this->db->query("SELECT * FROM settings WHERE setting_group = ?", [$group]);
        }
        return $this->db->query("SELECT * FROM settings");
    }

    public function get(string $key): ?array
    {
        return $this->db->queryOne("SELECT * FROM settings WHERE setting_key = ?", [$key]);
    }

    public function set(string $key, string $value, string $group = 'general'): bool
    {
        $existing = $this->get($key);
        
        if ($existing) {
            return $this->db->update('settings', [
                'setting_value' => $value,
                'setting_group' => $group,
            ], (int)$existing['id']);
        }
        
        $this->db->insert('settings', [
            'setting_key' => $key,
            'setting_value' => $value,
            'setting_group' => $group,
        ]);
        
        return true;
    }
}