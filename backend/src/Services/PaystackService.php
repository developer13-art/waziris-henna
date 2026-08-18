<?php

namespace Services;

class PaystackService
{
    private string $secretKey;
    private string $baseUrl = 'https://api.paystack.co';

    public function __construct()
    {
        $this->secretKey = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';
    }

    public function initializeTransaction(array $data): array
    {
        $url = $this->baseUrl . '/transaction/initialize';

        $response = $this->makeRequest('POST', $url, $data);

        if (isset($response['status']) && $response['status'] === true) {
            return [
                'success' => true,
                'authorization_url' => $response['data']['authorization_url'],
                'reference' => $response['data']['reference'],
            ];
        }

        return [
            'success' => false,
            'message' => $response['message'] ?? 'Failed to initialize transaction',
        ];
    }

    public function verifyTransaction(string $reference): array
    {
        $url = $this->baseUrl . '/transaction/verify/' . urlencode($reference);

        $response = $this->makeRequest('GET', $url);

        if (isset($response['status']) && $response['status'] === true) {
            return [
                'success' => true,
                'data' => $response['data'],
            ];
        }

        return [
            'success' => false,
            'message' => $response['message'] ?? 'Failed to verify transaction',
        ];
    }

    public function listTransactions(array $filters = []): array
    {
        $url = $this->baseUrl . '/transaction?' . http_build_query($filters);

        $response = $this->makeRequest('GET', $url);

        return $response;
    }

    public function refundTransaction(string $reference): array
    {
        $url = $this->baseUrl . '/refund';

        $response = $this->makeRequest('POST', $url, ['transaction' => $reference]);

        if (isset($response['status']) && $response['status'] === true) {
            return [
                'success' => true,
                'data' => $response['data'],
            ];
        }

        return [
            'success' => false,
            'message' => $response['message'] ?? 'Failed to refund transaction',
        ];
    }

    private function makeRequest(string $method, string $url, array $data = []): array
    {
        $ch = curl_init();

        $headers = [
            'Authorization: Bearer ' . $this->secretKey,
            'Content-Type: application/json',
        ];

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT => 30,
        ]);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $error = curl_error($ch);

        curl_close($ch);

        if ($error) {
            return [
                'status' => false,
                'message' => 'Curl error: ' . $error,
            ];
        }

        return json_decode($response, true) ?? [];
    }
}