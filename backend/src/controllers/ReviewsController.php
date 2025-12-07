<?php

declare(strict_types=1);

namespace App\Controllers;

class ReviewsController
{
    public function create(array $context, array $input): array
    {
        return [
            'message' => 'Review created stub',
            'visitor_id' => $context['sub'] ?? null,
            'payload' => $input,
        ];
    }

    public function list(?int $siteId = null): array
    {
        return [
            'message' => 'Reviews list stub',
            'site_id' => $siteId,
            'items' => [],
        ];
    }
}
