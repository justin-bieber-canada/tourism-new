<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\PaymentService;
use PDO;

class RequestsController
{
    public function __construct(private PDO $db, private PaymentService $paymentService)
    {
    }

    public function create(array $context, array $input): array
    {
        $visitorId = (int) ($context['sub'] ?? 0);
        if ($visitorId <= 0) {
            return ['_status' => 401, 'error' => 'Unauthorized'];
        }

        $required = ['site_id', 'preferred_date', 'preferred_time', 'number_of_visitors'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return ['_status' => 400, 'error' => "$field is required"];
            }
        }

        $stmt = $this->db->prepare(
            'INSERT INTO GuideRequests (visitor_id, site_id, guide_type_id, preferred_date, preferred_time, number_of_visitors, special_requirements, meeting_point, request_status)
             VALUES (:visitor_id, :site_id, :guide_type_id, :preferred_date, :preferred_time, :number_of_visitors, :special_requirements, :meeting_point, :request_status)'
        );

        $stmt->execute([
            'visitor_id' => $visitorId,
            'site_id' => (int) $input['site_id'],
            'guide_type_id' => $input['guide_type_id'] ?? null,
            'preferred_date' => $input['preferred_date'],
            'preferred_time' => $input['preferred_time'],
            'number_of_visitors' => (int) $input['number_of_visitors'],
            'special_requirements' => $input['special_requirements'] ?? null,
            'meeting_point' => $input['meeting_point'] ?? null,
            'request_status' => 'pending',
        ]);

        return [
            'message' => 'Request created',
            'request_id' => (int) $this->db->lastInsertId(),
            'request_status' => 'pending',
        ];
    }

    public function listForVisitor(int $visitorId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM GuideRequests WHERE visitor_id = :visitor_id ORDER BY created_at DESC');
        $stmt->execute(['visitor_id' => $visitorId]);
        return [
            'requests' => $stmt->fetchAll(),
            'visitor_id' => $visitorId,
        ];
    }

    public function listAll(array $context = []): array
    {
        $sql = 'SELECT * FROM GuideRequests ORDER BY created_at DESC';
        $params = [];

        // If guide, filter by assigned requests OR approved requests needing a guide
        if (isset($context['role']) && ($context['role'] === 'guide' || $context['role'] === 'site_agent')) {
            $guideId = (int)($context['sub'] ?? 0);
            $sql = 'SELECT * FROM GuideRequests 
                    WHERE assigned_guide_id = :guide_id 
                       OR (request_status = "approved" AND assigned_guide_id IS NULL)
                    ORDER BY created_at DESC';
            $params['guide_id'] = $guideId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return [
            'requests' => $stmt->fetchAll(),
        ];
    }

    public function approve(int $requestId): array
    {
        if (!$this->paymentService->hasConfirmedPayment($requestId)) {
            return [
                '_status' => 400,
                'error' => 'Visitor has not paid or payment not verified.',
            ];
        }

        $stmt = $this->db->prepare('UPDATE GuideRequests SET request_status = "approved" WHERE request_id = :id');
        $stmt->execute(['id' => $requestId]);

        // --- Create Visit Record ---
        try {
            $req = $this->db->prepare("SELECT * FROM GuideRequests WHERE request_id = :id");
            $req->execute(['id' => $requestId]);
            $request = $req->fetch();

            if ($request) {
                $stmt = $this->db->prepare(
                    "INSERT INTO Visits (request_id, actual_visit_date, actual_visit_time, status)
                     VALUES (:rid, :date, :time, 'upcoming')"
                );
                $stmt->execute([
                    'rid' => $requestId,
                    'date' => $request['preferred_date'],
                    'time' => $request['preferred_time']
                ]);
            }
        } catch (\Throwable $e) {
            // ignore
        }
        // ---------------------------

        return [
            'message' => 'Request approved',
            'request_id' => $requestId,
        ];
    }

    public function reject(int $requestId): array
    {
        $stmt = $this->db->prepare('UPDATE GuideRequests SET request_status = "rejected" WHERE request_id = :id');
        $stmt->execute(['id' => $requestId]);

        return [
            'message' => 'Request rejected',
            'request_id' => $requestId,
        ];
    }

    public function assignGuide(int $requestId, int $guideId): array
    {
        $stmt = $this->db->prepare('UPDATE GuideRequests SET assigned_guide_id = :guide_id WHERE request_id = :id');
        $stmt->execute([
            'guide_id' => $guideId,
            'id' => $requestId,
        ]);

        return [
            'message' => 'Guide assigned',
            'request_id' => $requestId,
            'assigned_guide_id' => $guideId,
        ];
    }

    public function updateStatus(int $requestId, string $status, array $context): array
    {
        $stmt = $this->db->prepare('UPDATE GuideRequests SET request_status = :status WHERE request_id = :id');
        $stmt->execute([
            'status' => $status,
            'id' => $requestId,
        ]);

        return [
            'message' => 'Request status updated',
            'request_id' => $requestId,
            'status' => $status,
            'updated_by' => $context['sub'] ?? null,
        ];
    }
}
