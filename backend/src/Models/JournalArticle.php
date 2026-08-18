<?php

namespace Models;

use Config\Database;

class JournalArticle
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array
    {
        return $this->db->queryOne("SELECT * FROM journal_articles WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug): ?array
    {
        return $this->db->queryOne("SELECT * FROM journal_articles WHERE slug = ?", [$slug]);
    }

    public function create(array $data): int
    {
        return $this->db->insert('journal_articles', $data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->update('journal_articles', $data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->db->delete('journal_articles', $id);
    }
}