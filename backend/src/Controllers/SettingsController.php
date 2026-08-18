<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;

class SettingsController
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
                if ($id) {
                    $this->getSetting($id);
                } else {
                    $this->getAllSettings();
                }
                break;
            case 'POST':
                $this->saveSettings();
                break;
            case 'PUT':
                if ($id) {
                    $this->updateSetting((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllSettings(): void
    {
        $group = $_GET['group'] ?? null;

        if ($group) {
            $sql = "SELECT * FROM settings WHERE setting_group = ? ORDER BY setting_key ASC";
            $settings = $this->db->query($sql, [$group]);
        } else {
            $sql = "SELECT * FROM settings ORDER BY setting_group ASC, setting_key ASC";
            $settings = $this->db->query($sql);
        }

        // Convert to key-value format
        $formatted = [];
        foreach ($settings as $setting) {
            $formatted[$setting['setting_key']] = $setting['setting_value'];
        }

        Response::success($formatted, 'Settings retrieved successfully');
    }

    private function getSetting(string $key): void
    {
        $sql = "SELECT * FROM settings WHERE setting_key = ?";
        $setting = $this->db->queryOne($sql, [$key]);

        if (!$setting) {
            Response::error('Setting not found', 404);
        }

        Response::success($setting, 'Setting retrieved successfully');
    }

    private function saveSettings(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $group = $input['group'] ?? 'general';
        $settings = $input['settings'] ?? [];

        if (empty($settings) || !is_array($settings)) {
            Response::error('No settings to save');
        }

        $this->db->beginTransaction();

        try {
            foreach ($settings as $key => $value) {
                $existing = $this->db->queryOne(
                    "SELECT id FROM settings WHERE setting_key = ?",
                    [$key]
                );

                if ($existing) {
                    $this->db->update('settings', [
                        'setting_value' => $value,
                        'setting_group' => $group,
                    ], (int)$existing['id']);
                } else {
                    $this->db->insert('settings', [
                        'setting_key' => $key,
                        'setting_value' => $value,
                        'setting_group' => $group,
                    ]);
                }
            }

            $this->db->commit();

            Response::success([], 'Settings saved successfully');
        } catch (\Exception $e) {
            $this->db->rollBack();
            Response::error('Failed to save settings: ' . $e->getMessage(), 500);
        }
    }

    private function updateSetting(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM settings WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Setting not found', 404);
        }

        $data = [];
        $allowedFields = ['setting_value', 'setting_group'];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('settings', $data, $id);

        Response::success([], 'Setting updated successfully');
    }
}