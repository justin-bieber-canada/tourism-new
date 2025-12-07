<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Env;
use GuzzleHttp\Client;
use PDO;

class PaymentService
{
    private Client $http;

    public function __construct(private PDO $db)
    {
        $this->http = new Client([
            'base_uri' => 'https://api.chapa.co/v1/',
            'timeout' => 10,
        ]);
    }

    public function initializeChapaPayment(int $requestId, float $amount, string $currency = 'ETB'): array
    {
        $txRef = 'TX-' . bin2hex(random_bytes(6));

        $payload = [
            'amount' => $amount,
            'currency' => $currency,
            'tx_ref' => $txRef,
            'callback_url' => Env::get('API_URL', '') . '/api/payments/chapa/verify/' . $txRef,
            'return_url' => Env::get('APP_URL', ''),
            'payment_method_id' => null,
        ];

        // Persist pending payment row
        $stmt = $this->db->prepare(
            'INSERT INTO Payments (request_id, payment_method_id, total_amount, reference_code, payment_status)
             VALUES (:request_id, :payment_method_id, :total_amount, :reference_code, :payment_status)'
        );
        $stmt->execute([
            'request_id' => $requestId,
            'payment_method_id' => $payload['payment_method_id'] ?? null,
            'total_amount' => $amount,
            'reference_code' => $txRef,
            'payment_status' => 'waiting',
        ]);

        $secret = Env::get('CHAPA_SECRET_KEY');
        if (!$secret) {
            return [
                '_status' => 202,
                'message' => 'CHAPA_SECRET_KEY not set. Returning a local tx_ref stub.',
                'tx_ref' => $txRef,
                'payload' => $payload,
            ];
        }

        // TODO: Uncomment to perform real network call once credentials are ready
        // $response = $this->http->post('transaction/initialize', [
        //     'headers' => [
        //         'Authorization' => 'Bearer ' . $secret,
        //     ],
        //     'form_params' => $payload,
        // ]);
        // $data = json_decode((string) $response->getBody(), true);

        return [
            'tx_ref' => $txRef,
            'checkout_url' => 'https://pay.chapa.co/checkout/' . $txRef,
            'message' => 'Chapa initialization stub',
            'payload' => $payload,
        ];
    }

    public function verifyChapaPayment(string $txRef): array
    {
        $secret = Env::get('CHAPA_SECRET_KEY');
        if (!$secret) {
            return [
                '_status' => 202,
                'message' => 'CHAPA_SECRET_KEY not set. Skipping remote verification.',
                'tx_ref' => $txRef,
            ];
        }

        // TODO: Uncomment to perform real network call once credentials are ready
        // $response = $this->http->get('transaction/verify/' . $txRef, [
        //     'headers' => [
        //         'Authorization' => 'Bearer ' . $secret,
        //     ],
        // ]);
        // $data = json_decode((string) $response->getBody(), true);

        // Mark payment as paid (or keep pending) locally. Here we set paid -> confirmed for simplicity.
        $stmt = $this->db->prepare(
            "UPDATE Payments SET payment_status = 'confirmed', paid_at = NOW() WHERE reference_code = :tx_ref"
        );
        $stmt->execute(['tx_ref' => $txRef]);

        return [
            'tx_ref' => $txRef,
            'status' => 'confirmed',
            'message' => 'Verification stub. Enable real Chapa verify to tighten.',
        ];
    }

    public function verifyPaymentById(int $paymentId, array $context): array
    {
        $confirmedBy = (int) ($context['sub'] ?? 0);

        $stmt = $this->db->prepare(
            "UPDATE Payments SET payment_status = 'confirmed', confirmed_by = :confirmed_by, confirmed_at = NOW() WHERE payment_id = :payment_id"
        );
        $stmt->execute([
            'confirmed_by' => $confirmedBy ?: null,
            'payment_id' => $paymentId,
        ]);

        return [
            'message' => 'Payment verified',
            'payment_id' => $paymentId,
            'confirmed_by' => $confirmedBy ?: null,
        ];
    }

    public function hasConfirmedPayment(int $requestId): bool
    {
        try {
            $stmt = $this->db->prepare(
                "SELECT payment_id FROM Payments WHERE request_id = :request_id AND payment_status = 'confirmed' LIMIT 1"
            );
            $stmt->execute(['request_id' => $requestId]);
            return (bool) $stmt->fetchColumn();
        } catch (\Throwable $e) {
            return false;
        }
    }

    public function listPayments(?int $requestId = null): array
    {
        if ($requestId === null) {
            return ['payments' => []];
        }

        try {
            $stmt = $this->db->prepare('SELECT * FROM Payments WHERE request_id = :request_id');
            $stmt->execute(['request_id' => $requestId]);
            return ['payments' => $stmt->fetchAll()];
        } catch (\Throwable $e) {
            return [
                '_status' => 500,
                'error' => 'Unable to load payments',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function attachProof(int $paymentId, string $fileUrl, ?float $amount = null): array
    {
        $stmt = $this->db->prepare(
            'INSERT INTO PaymentProofs (payment_id, file_url, amount_paid)
             VALUES (:payment_id, :file_url, :amount_paid)'
        );
        $stmt->execute([
            'payment_id' => $paymentId,
            'file_url' => $fileUrl,
            'amount_paid' => $amount,
        ]);

        return [
            'message' => 'Proof saved',
            'payment_id' => $paymentId,
            'file_url' => $fileUrl,
            'amount_paid' => $amount,
        ];
    }
}
