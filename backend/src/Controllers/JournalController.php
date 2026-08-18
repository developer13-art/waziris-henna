<?php

namespace Controllers;

use Config\Database;
use Helpers\Response;
use Helpers\ReferenceGenerator;

class JournalController
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
                if ($id && $action === 'by-slug') {
                    $this->getArticleBySlug($id);
                } elseif ($id) {
                    $this->getArticle((int)$id);
                } else {
                    $this->getAllArticles();
                }
                break;
            case 'POST':
                $this->createArticle();
                break;
            case 'PUT':
                if ($id) {
                    $this->updateArticle((int)$id);
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deleteArticle((int)$id);
                }
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getAllArticles(): void
    {
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 9);
        $offset = ($page - 1) * $perPage;

        $where = ['is_published = 1'];
        $params = [];

        if (!empty($_GET['category'])) {
            $where[] = 'category = ?';
            $params[] = $_GET['category'];
        }
        if (!empty($_GET['search'])) {
            $where[] = '(title LIKE ? OR content LIKE ? OR tags LIKE ?)';
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) as total FROM journal_articles WHERE {$whereClause}";
        $totalResult = $this->db->queryOne($countSql, $params);
        $total = (int)($totalResult['total'] ?? 0);

        $sql = "SELECT id, title, slug, category, excerpt, image_url, author, tags, 
                views_count, published_at, created_at 
                FROM journal_articles 
                WHERE {$whereClause} 
                ORDER BY published_at DESC, created_at DESC 
                LIMIT ? OFFSET ?";

        $params[] = $perPage;
        $params[] = $offset;

        $articles = $this->db->query($sql, $params);

        Response::paginated($articles, $total, $page, $perPage);
    }

    private function getArticle(int $id): void
    {
        $sql = "SELECT * FROM journal_articles WHERE id = ? AND is_published = 1";
        $article = $this->db->queryOne($sql, [$id]);

        if (!$article) {
            Response::error('Article not found', 404);
        }

        // Increment views
        $this->db->query("UPDATE journal_articles SET views_count = views_count + 1 WHERE id = ?", [$id]);

        Response::success($article, 'Article retrieved successfully');
    }

    private function getArticleBySlug(string $slug): void
    {
        $sql = "SELECT * FROM journal_articles WHERE slug = ? AND is_published = 1";
        $article = $this->db->queryOne($sql, [$slug]);

        if (!$article) {
            Response::error('Article not found', 404);
        }

        // Increment views
        $this->db->query("UPDATE journal_articles SET views_count = views_count + 1 WHERE id = ?", [$article['id']]);

        Response::success($article, 'Article retrieved successfully');
    }

    private function createArticle(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            Response::error('Article title is required');
        }

        $content = trim($input['content'] ?? '');
        if (empty($content)) {
            Response::error('Article content is required');
        }

        $slug = $input['slug'] ?? ReferenceGenerator::slugify($title);

        $existing = $this->db->queryOne("SELECT id FROM journal_articles WHERE slug = ?", [$slug]);
        if ($existing) {
            Response::error('Slug already exists');
        }

        $data = [
            'title' => $title,
            'slug' => $slug,
            'category' => $input['category'] ?? 'Guides',
            'excerpt' => $input['excerpt'] ?? substr(strip_tags($content), 0, 200),
            'content' => $content,
            'image_url' => $input['image_url'] ?? null,
            'author' => $input['author'] ?? 'Waziri\'s Henna',
            'tags' => $input['tags'] ?? null,
            'is_published' => $input['is_published'] ?? false,
            'published_at' => ($input['is_published'] ?? false) ? date('Y-m-d H:i:s') : null,
        ];

        $id = $this->db->insert('journal_articles', $data);

        Response::success(['id' => $id], 'Article created successfully', 201);
    }

    private function updateArticle(int $id): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid input data');
        }

        $existing = $this->db->queryOne("SELECT * FROM journal_articles WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Article not found', 404);
        }

        $data = [];
        $allowedFields = [
            'title', 'category', 'excerpt', 'content', 'image_url',
            'author', 'tags', 'is_published'
        ];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        // Handle publish state
        if (isset($input['is_published'])) {
            if ($input['is_published'] && !$existing['is_published']) {
                $data['published_at'] = date('Y-m-d H:i:s');
            }
            if (!$input['is_published']) {
                $data['published_at'] = null;
            }
        }

        if (empty($data)) {
            Response::error('No data to update');
        }

        $this->db->update('journal_articles', $data, $id);

        Response::success([], 'Article updated successfully');
    }

    private function deleteArticle(int $id): void
    {
        $existing = $this->db->queryOne("SELECT * FROM journal_articles WHERE id = ?", [$id]);
        if (!$existing) {
            Response::error('Article not found', 404);
        }

        $this->db->delete('journal_articles', $id);

        Response::success([], 'Article deleted successfully');
    }
}