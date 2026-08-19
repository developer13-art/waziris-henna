<?php

namespace Controllers;

use Helpers\Response;
use Services\FileUploadService;

class UploadController
{
    private $uploadService;

    public function __construct()
    {
        $this->uploadService = new FileUploadService();
    }

    public function handle(string $method, ?string $id = null, ?string $action = null): void
    {
        switch ($method) {
            case 'POST':
                $this->upload();
                break;
            case 'DELETE':
                $this->delete($id);
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function upload(): void
    {
        if (!isset($_FILES['image'])) {
            Response::error('No image file uploaded');
        }

        $directory = $_POST['directory'] ?? 'designs';
        
        // Validate directory
        $allowedDirectories = ['designs', 'products', 'gallery', 'journal'];
        if (!in_array($directory, $allowedDirectories)) {
            Response::error('Invalid upload directory');
        }

        $result = $this->uploadService->upload($_FILES['image'], $directory);

        if (!$result['success']) {
            Response::error($result['message']);
        }

        Response::success([
            'url' => $result['url'],
            'filename' => $result['filename'],
        ], 'File uploaded successfully', 201);
    }

    private function delete(?string $id): void
    {
        if (!$id) {
            Response::error('File path is required');
        }

        $filePath = urldecode($id);
        $result = $this->uploadService->delete($filePath);

        if (!$result) {
            Response::error('Failed to delete file');
        }

        Response::success([], 'File deleted successfully');
    }
}