<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;
use Throwable;

class SitesController
{
    public function __construct(private PDO $db)
    {
    }

    public function index(): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                file_put_contents(__DIR__ . '/../../debug_sites_index.log', date('[Y-m-d H:i:s] ') . "Index: No table found\n", FILE_APPEND);
                return [];
            }
            $stmt = $this->db->query("SELECT * FROM `$table` ORDER BY created_at DESC");
            $items = $stmt->fetchAll() ?: [];
            
            file_put_contents(__DIR__ . '/../../debug_sites_index.log', date('[Y-m-d H:i:s] ') . "Index: Found " . count($items) . " items\n", FILE_APPEND);

            return ['items' => $items];
        } catch (Throwable $e) {
            file_put_contents(__DIR__ . '/../../debug_sites_index.log', date('[Y-m-d H:i:s] ') . "Index Error: " . $e->getMessage() . "\n", FILE_APPEND);
            return ['_status' => 500, 'error' => 'Failed to list sites', 'detail' => $e->getMessage()];
        }
    }

    public function show(int $id): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 404, 'error' => 'Sites table not found'];
            }
            $stmt = $this->db->prepare("SELECT * FROM `$table` WHERE site_id = :id");
            $stmt->execute(['id' => $id]);
            $site = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$site) {
                return ['_status' => 404, 'error' => 'Site not found'];
            }

            return $site;
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to fetch site', 'detail' => $e->getMessage()];
        }
    }

    public function store(array $context, array $input): array
    {
        file_put_contents(__DIR__ . '/../../debug_sites_store.log', date('[Y-m-d H:i:s] ') . "Input: " . print_r($input, true) . "\n", FILE_APPEND);
        try {
            $table = $this->resolveSitesTable();
            $submissionTable = $this->resolveSubmissionTable();
            if (!$table && !$submissionTable) {
                return ['_status' => 500, 'error' => 'Sites table not found'];
            }

            $columns = $table ? $this->siteColumns($table) : [];

            $defaults = [
                'is_approved' => false,
                'status' => 'pending',
                'created_by' => $context['sub'] ?? null,
                'researcher_id' => $context['sub'] ?? null,
            ];

            $map = [
                'site_name' => ['site_name', 'name', 'title'],
                'name' => ['name', 'site_name', 'title'],
                'title' => ['title', 'name', 'site_name'],
                'location' => ['location', 'location_address'],
                'location_address' => ['location_address', 'location'],
                'description' => ['description', 'full_description', 'short_description'],
                'full_description' => ['full_description', 'description'],
                'short_description' => ['short_description', 'description'],
                'price' => ['price', 'visit_price'],
                'visit_price' => ['visit_price', 'price'],
                'entrance_fee' => ['entrance_fee'],
                'guide_fee' => ['guide_fee'],
                'category' => ['category', 'category_id'],
                'category_id' => ['category_id', 'category'],
                'region' => ['region', 'region_id'],
                'region_id' => ['region_id', 'region'],
                'visit_duration' => ['visit_duration', 'estimated_duration'],
                'nearby_attractions' => ['nearby_attractions'],
                'map_url' => ['map_url'],
                'image' => ['image', 'image_url'],
                'is_approved' => ['is_approved'],
                'status' => ['status'],
                'created_by' => ['created_by'],
                'researcher_id' => ['researcher_id'],
            ];

            $data = [];
            foreach ($map as $inputKey => $columnOptions) {
                if (!array_key_exists($inputKey, $input)) {
                    continue;
                }
                $val = $input[$inputKey];
                foreach ($columnOptions as $col) {
                    if (in_array($col, $columns, true)) {
                        $data[$col] = $val;
                        break;
                    }
                }
            }

            // Derive extra fields when columns exist but specific inputs were mapped differently
            if (!isset($data['full_description']) && !empty($input['description']) && in_array('full_description', $columns, true)) {
                $data['full_description'] = $input['description'];
            }
            if (!isset($data['short_description']) && !empty($input['description']) && in_array('short_description', $columns, true)) {
                $data['short_description'] = mb_substr((string) $input['description'], 0, 255);
            }
            if (!isset($data['location_address']) && !empty($input['location']) && in_array('location_address', $columns, true)) {
                $data['location_address'] = $input['location'];
            }
            if (!isset($data['estimated_duration']) && !empty($input['visit_duration']) && in_array('estimated_duration', $columns, true)) {
                $data['estimated_duration'] = $input['visit_duration'];
            }
            if (!isset($data['image_url']) && !empty($input['image']) && in_array('image_url', $columns, true)) {
                $data['image_url'] = $input['image'];
            }
            if (!isset($data['visit_price']) && !empty($input['price']) && in_array('visit_price', $columns, true)) {
                $data['visit_price'] = $input['price'];
            }

            // apply defaults for missing
            foreach ($defaults as $col => $val) {
                if (in_array($col, $columns, true) && !array_key_exists($col, $data)) {
                    $data[$col] = $val;
                }
            }

            if (empty($data)) {
                file_put_contents(__DIR__ . '/../../debug_sites_store.log', date('[Y-m-d H:i:s] ') . "Error: No valid fields to insert. Input keys: " . implode(',', array_keys($input)) . "\n", FILE_APPEND);
            }

            if ($table && !empty($data)) {
                $columnsSql = implode(', ', array_map(fn($c) => "`$c`", array_keys($data)));
                $placeholders = implode(', ', array_map(static fn($c) => ':' . $c, array_keys($data)));
                $sql = sprintf('INSERT INTO `%s` (%s) VALUES (%s)', $table, $columnsSql, $placeholders);

                file_put_contents(__DIR__ . '/../../debug_sites_store.log', date('[Y-m-d H:i:s] ') . "SQL: $sql\nData: " . print_r($data, true) . "\n", FILE_APPEND);

                $stmt = $this->db->prepare($sql);
                $stmt->execute($data);

                $id = (int) $this->db->lastInsertId();
                
                // --- Populate Normalized Tables (Categories, Regions, SiteImages) ---
                try {
                    // 1. Categories
                    if (!empty($input['category'])) {
                        $catName = trim($input['category']);
                        $stmt = $this->db->prepare("SELECT category_id FROM Categories WHERE category_name = ?");
                        $stmt->execute([$catName]);
                        $catId = $stmt->fetchColumn();
                        if (!$catId) {
                            $stmt = $this->db->prepare("INSERT INTO Categories (category_name) VALUES (?)");
                            $stmt->execute([$catName]);
                            $catId = $this->db->lastInsertId();
                        }
                        if ($catId) {
                            $this->db->prepare("UPDATE `$table` SET category_id = ? WHERE site_id = ?")->execute([$catId, $id]);
                        }
                    }

                    // 2. Regions
                    if (!empty($input['region'])) {
                        $regName = trim($input['region']);
                        $stmt = $this->db->prepare("SELECT region_id FROM Regions WHERE region_name = ?");
                        $stmt->execute([$regName]);
                        $regId = $stmt->fetchColumn();
                        if (!$regId) {
                            $stmt = $this->db->prepare("INSERT INTO Regions (region_name) VALUES (?)");
                            $stmt->execute([$regName]);
                            $regId = $this->db->lastInsertId();
                        }
                        if ($regId) {
                            $this->db->prepare("UPDATE `$table` SET region_id = ? WHERE site_id = ?")->execute([$regId, $id]);
                        }
                    }

                    // 3. SiteImages
                    if (!empty($input['image'])) {
                        $imgUrl = trim($input['image']);
                        $stmt = $this->db->prepare("INSERT INTO SiteImages (site_id, image_url, is_primary, uploaded_by) VALUES (?, ?, 1, ?)");
                        $stmt->execute([$id, $imgUrl, $context['sub'] ?? null]);
                    }

                } catch (Throwable $e) {
                    file_put_contents(__DIR__ . '/../../debug_sites_store.log', date('[Y-m-d H:i:s] ') . "Normalization Error: " . $e->getMessage() . "\n", FILE_APPEND);
                    // Ignore errors here to ensure the main site creation succeeds
                }
                
                // --- Log Researcher Activity ---
                try {
                    $stmt = $this->db->prepare(
                        "INSERT INTO ResearcherActivities (researcher_id, activity_type, description, related_site_id) 
                         VALUES (:uid, 'add_site', :desc, :sid)"
                    );
                    $stmt->execute([
                        'uid' => $context['sub'] ?? null,
                        'desc' => "Added new site: " . ($data['site_name'] ?? 'Unknown'),
                        'sid' => $id
                    ]);
                } catch (Throwable $e) {
                    // ignore logging errors
                }
                // -------------------------------------------------------------------

                file_put_contents(__DIR__ . '/../../debug_sites_store.log', date('[Y-m-d H:i:s] ') . "Success: ID $id\n", FILE_APPEND);

                return ['message' => 'Site submitted', 'site_id' => $id, 'is_approved' => $data['is_approved'] ?? false];
            }

            if ($submissionTable) {
                $payload = json_encode($input, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $stmt = $this->db->prepare(
                    "INSERT INTO `$submissionTable` (researcher_id, submission_type, submission_data, submission_status, submitted_at)
                     VALUES (:researcher_id, :submission_type, :submission_data, :submission_status, NOW())"
                );
                $stmt->execute([
                    'researcher_id' => $context['sub'] ?? null,
                    'submission_type' => 'new',
                    'submission_data' => $payload,
                    'submission_status' => 'pending',
                ]);
                $id = (int) $this->db->lastInsertId();
                return ['message' => 'Site submitted', 'submission_id' => $id, 'is_approved' => false];
            }

            return ['_status' => 400, 'error' => 'No valid fields to insert'];
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to create site', 'detail' => $e->getMessage()];
        }
    }

    public function approve(int $id, array $context): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 500, 'error' => 'Sites table not found'];
            }

            $columns = $this->siteColumns($table);
            if (in_array('is_approved', $columns, true)) {
                $stmt = $this->db->prepare("UPDATE `$table` SET is_approved = :approved WHERE site_id = :id OR id = :id");
                $stmt->execute(['approved' => true, 'id' => $id]);
            } elseif (in_array('status', $columns, true)) {
                $stmt = $this->db->prepare("UPDATE `$table` SET status = 'approved' WHERE site_id = :id OR id = :id");
                $stmt->execute(['id' => $id]);
            } else {
                return ['_status' => 500, 'error' => 'No approval column found'];
            }

            return [
                'message' => 'Site approved',
                'site_id' => $id,
                'approved_by' => $context['sub'] ?? null,
            ];
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to approve site', 'detail' => $e->getMessage()];
        }
    }

    public function update(array $context, int $id, array $input): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 404, 'error' => 'Sites table not found'];
            }

            // 1. Verify Ownership (Optional but recommended)
            $userId = (int)($context['sub'] ?? 0);
            // Check if user owns this site or is admin...

            // 2. Prepare Fields to Update
            $fields = [
                'site_name', 'full_description', 'location_address', 
                'visit_price', 'estimated_duration', 'image_url', 
                'map_url', 'nearby_attractions', 'region_id', 'category_id'
            ];
            
            $updates = [];
            $params = ['id' => $id];

            // Map frontend keys to DB columns
            $map = [
                'site_name' => 'site_name',
                'description' => 'full_description',
                'location' => 'location_address',
                'price' => 'visit_price',
                'visit_duration' => 'estimated_duration',
                'image' => 'image_url',
                'map_url' => 'map_url',
                'nearby_attractions' => 'nearby_attractions',
                'region' => 'region_id', // Special handling below
                'category' => 'category_id' // Special handling below
            ];

            // Handle Region Name -> ID
            if (!empty($input['region'])) {
                $regName = trim($input['region']);
                $stmt = $this->db->prepare("SELECT region_id FROM Regions WHERE region_name = ?");
                $stmt->execute([$regName]);
                $regId = $stmt->fetchColumn();
                if (!$regId) {
                    $stmt = $this->db->prepare("INSERT INTO Regions (region_name) VALUES (?)");
                    $stmt->execute([$regName]);
                    $regId = $this->db->lastInsertId();
                }
                $input['region_id'] = $regId;
            }

            // Handle Category Name -> ID
            if (!empty($input['category'])) {
                $catName = trim($input['category']);
                $stmt = $this->db->prepare("SELECT category_id FROM Categories WHERE category_name = ?");
                $stmt->execute([$catName]);
                $catId = $stmt->fetchColumn();
                if (!$catId) {
                    $stmt = $this->db->prepare("INSERT INTO Categories (category_name) VALUES (?)");
                    $stmt->execute([$catName]);
                    $catId = $this->db->lastInsertId();
                }
                $input['category_id'] = $catId;
            }

            foreach ($map as $inputKey => $dbCol) {
                if (isset($input[$inputKey])) {
                    $updates[] = "`$dbCol` = :$dbCol";
                    $params[$dbCol] = $input[$inputKey];
                } elseif (isset($input[$dbCol])) { // Direct column name match
                    $updates[] = "`$dbCol` = :$dbCol";
                    $params[$dbCol] = $input[$dbCol];
                }
            }

            // Always reset approval on update
            $updates[] = "is_approved = 0";

            if (empty($updates)) {
                return ['message' => 'No changes provided'];
            }

            $sql = "UPDATE `$table` SET " . implode(', ', $updates) . " WHERE site_id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            return ['message' => 'Site updated successfully'];
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to update site', 'detail' => $e->getMessage()];
        }
    }

    public function delete(int $id): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 404, 'error' => 'Sites table not found'];
            }
            $stmt = $this->db->prepare("DELETE FROM `$table` WHERE site_id = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() === 0) {
                return ['_status' => 404, 'error' => 'Site not found'];
            }
            return ['message' => 'Site deleted'];
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to delete site', 'detail' => $e->getMessage()];
        }
    }

    private function resolveSitesTable(): ?string
    {
        foreach (['Sites', 'sites'] as $candidate) {
            $like = $this->db->quote($candidate);
            $stmt = $this->db->query("SHOW TABLES LIKE $like");
            if ($stmt && $stmt->fetchColumn()) {
                return $candidate;
            }
        }
        return null;
    }

    private function resolveSubmissionTable(): ?string
    {
        foreach (['SiteSubmissions', 'sitesubmissions'] as $candidate) {
            $like = $this->db->quote($candidate);
            $stmt = $this->db->query("SHOW TABLES LIKE $like");
            if ($stmt && $stmt->fetchColumn()) {
                return $candidate;
            }
        }
        return null;
    }

    private function siteColumns(string $table): array
    {
        $dbName = $this->db->query('SELECT DATABASE()')->fetchColumn();
        if (!$dbName) {
            return [];
        }
        $stmt = $this->db->prepare('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = :db AND TABLE_NAME = :table');
        $stmt->execute(['db' => $dbName, 'table' => $table]);
        return array_column($stmt->fetchAll(), 'COLUMN_NAME');
    }
}
