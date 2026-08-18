<?php

namespace Config;

use PDO;
use PDOException;

class Database
{
    private static ?Database $instance = null;
    private PDO $connection;

    private function __construct()
    {
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $dbname = $_ENV['DB_NAME'] ?? 'waziris_henna';
        $username = $_ENV['DB_USER'] ?? 'root';
        $password = $_ENV['DB_PASS'] ?? '';

        try {
            $this->connection = new PDO(
                "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]));
        }
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }

    public function query(string $sql, array $params = []): array
    {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array
    {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function insert(string $table, array $data): int
    {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $stmt = $this->connection->prepare($sql);
        $stmt->execute(array_values($data));
        
        return (int) $this->connection->lastInsertId();
    }

    public function update(string $table, array $data, int $id): bool
    {
        $setParts = [];
        foreach ($data as $key => $value) {
            $setParts[] = "{$key} = ?";
        }
        $setClause = implode(', ', $setParts);
        $sql = "UPDATE {$table} SET {$setClause} WHERE id = ?";
        
        $params = array_values($data);
        $params[] = $id;
        
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(string $table, int $id): bool
    {
        $sql = "DELETE FROM {$table} WHERE id = ?";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute([$id]);
    }

    public function beginTransaction(): void
    {
        $this->connection->beginTransaction();
    }

    public function commit(): void
    {
        $this->connection->commit();
    }

    public function rollBack(): void
    {
        $this->connection->rollBack();
    }
}