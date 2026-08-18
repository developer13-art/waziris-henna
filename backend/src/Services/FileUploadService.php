<?php

namespace Services;

class FileUploadService
{
    private array $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    
    private int $maxFileSize = 5242880; // 5MB

    public function upload(array $file, string $directory): array
    {
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return ['success' => false, 'message' => 'No file uploaded'];
        }

        if ($file['size'] > $this->maxFileSize) {
            return ['success' => false, 'message' => 'File size exceeds 5MB limit'];
        }

        $mimeType = mime_content_type($file['tmp_name']);
        
        if (!isset($this->allowedTypes[$mimeType])) {
            return ['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and WebP are allowed'];
        }

        $extension = $this->allowedTypes[$mimeType];
        $filename = uniqid('img_') . '_' . time() . '.' . $extension;
        
        $uploadPath = __DIR__ . '/../../public/uploads/' . $directory;
        
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        $destination = $uploadPath . '/' . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return [
                'success' => true,
                'url' => '/uploads/' . $directory . '/' . $filename,
            ];
        }

        return ['success' => false, 'message' => 'Failed to upload file'];
    }

    public function delete(string $filePath): bool
    {
        $fullPath = __DIR__ . '/../../public' . $filePath;
        
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        
        return false;
    }
}