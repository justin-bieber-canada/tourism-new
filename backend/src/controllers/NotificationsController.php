<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class NotificationsController
{
    public function __construct(private PDO $db)
    {
    }

    public function index(array $context): array
    {
        return [
            'items' => [],
            'user_id' => $context['sub'] ?? null,
        ];
    }

    public function markRead(int $notificationId, array $context): array
    {
        return [
            'message' => 'Notification marked as read',
            'notification_id' => $notificationId,
            'user_id' => $context['sub'] ?? null,
        ];
    }
}
