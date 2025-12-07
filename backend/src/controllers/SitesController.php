<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class SitesController
{
    public function __construct(private PDO $db)
    {
    }

    public function index(): array
    {
        return [
            'message' => 'List sites',
            'items' => [],
        ];
    }

    public function show(int $id): array
    {
        return [
            'message' => 'Site detail',
            'site_id' => $id,
        ];
    }

    public function store(array $context, array $input): array
    {
        return [
            'message' => 'Create site stub',
            'status' => 'pending',
            'submitted_by' => $context['sub'] ?? null,
            'payload' => $input,
        ];
    }

    public function approve(int $id, array $context): array
    {
        return [
            'message' => 'Site approved',
            'site_id' => $id,
            'approved_by' => $context['sub'] ?? null,
        ];
    }
}
