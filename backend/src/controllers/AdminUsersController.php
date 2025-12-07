<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class AdminUsersController
{
    public function __construct(private PDO $db)
    {
    }

    public function list(): array
    {
        $stmt = $this->db->query('SELECT user_id, first_name, last_name, email, phone_number, user_type, is_active, created_at FROM Users ORDER BY user_id DESC');
        return ['users' => $stmt->fetchAll()];
    }

    public function create(array $input): array
    {
        $required = ['first_name', 'last_name', 'email', 'user_type', 'password'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return ['_status' => 400, 'error' => "$field is required"];
            }
        }

        $email = strtolower(trim((string) $input['email']));
        $exists = $this->db->prepare('SELECT user_id FROM Users WHERE email = :email LIMIT 1');
        $exists->execute(['email' => $email]);
        if ($exists->fetchColumn()) {
            return ['_status' => 409, 'error' => 'Email already exists'];
        }

        $stmt = $this->db->prepare(
            'INSERT INTO Users (first_name, last_name, email, phone_number, password_hash, profile_picture, user_type, is_active)
             VALUES (:first_name, :last_name, :email, :phone_number, :password_hash, :profile_picture, :user_type, :is_active)'
        );

        $stmt->execute([
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'email' => $email,
            'phone_number' => $input['phone_number'] ?? null,
            'password_hash' => password_hash((string) $input['password'], PASSWORD_BCRYPT),
            'profile_picture' => $input['profile_picture'] ?? null,
            'user_type' => $input['user_type'],
            'is_active' => isset($input['is_active']) ? (bool) $input['is_active'] : true,
        ]);

        return [
            'message' => 'User created',
            'user_id' => (int) $this->db->lastInsertId(),
        ];
    }

    public function updateStatus(int $userId, array $input): array
    {
        if (!isset($input['is_active'])) {
            return ['_status' => 400, 'error' => 'is_active is required'];
        }

        $stmt = $this->db->prepare('UPDATE Users SET is_active = :is_active WHERE user_id = :id');
        $stmt->execute([
            'is_active' => (bool) $input['is_active'],
            'id' => $userId,
        ]);

        return ['message' => 'User status updated', 'user_id' => $userId];
    }

    public function delete(int $userId): array
    {
        $stmt = $this->db->prepare('DELETE FROM Users WHERE user_id = :id');
        $stmt->execute(['id' => $userId]);
        return ['message' => 'User deleted', 'user_id' => $userId];
    }
}
