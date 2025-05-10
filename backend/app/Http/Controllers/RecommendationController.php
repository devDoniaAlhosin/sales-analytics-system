<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\Http;

class RecommendationController extends Controller
{
    private $aiApiKey;
    private $aiEndpoint;

    public function __construct()
    {
        $this->aiApiKey = env('GEMINI_API_KEY');
        $this->aiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    public function index(): JsonResponse
    {
        try {
            if (empty($this->aiApiKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gemini API key is not configured'
                ], 500);
            }

            // Get sales data for the last 24 hours
            $salesData = $this->getRecentSalesData();
            
            // Get recommendations from Gemini AI
            $recommendations = $this->getAIRecommendations($this->prepareAIPrompt($salesData));

            return response()->json([
                'success' => true,
                'data' => [
                    'sales_data' => $salesData,
                    'recommendations' => $recommendations
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get recommendations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getRecentSalesData(): array
    {
        $now = new DateTime('now', new DateTimeZone('UTC'));
        $oneDayAgo = (clone $now)->modify('-24 hours');

        // Get total revenue and order count
        $overallStats = DB::select('
            SELECT 
                COUNT(*) as total_orders,
                SUM(quantity) as total_quantity,
                SUM(price * quantity) as total_revenue
            FROM orders
            WHERE created_at >= ?
        ', [$oneDayAgo->format('Y-m-d H:i:s')])[0];

        // Get product performance
        $productStats = DB::select('
            SELECT 
                product_id,
                product_name,
                COUNT(*) as order_count,
                SUM(quantity) as total_quantity,
                SUM(price * quantity) as total_revenue,
                AVG(price) as average_price
            FROM orders
            WHERE created_at >= ?
            GROUP BY product_id, product_name
            ORDER BY total_revenue DESC
        ', [$oneDayAgo->format('Y-m-d H:i:s')]);

        // Get hourly trends
        $hourlyTrends = DB::select('
            SELECT 
                strftime("%H", created_at) as hour,
                COUNT(*) as order_count,
                SUM(price * quantity) as revenue
            FROM orders
            WHERE created_at >= ?
            GROUP BY hour
            ORDER BY hour
        ', [$oneDayAgo->format('Y-m-d H:i:s')]);

        return [
            'overall_stats' => [
                'total_orders' => (int) $overallStats->total_orders,
                'total_quantity' => (int) $overallStats->total_quantity,
                'total_revenue' => (float) $overallStats->total_revenue
            ],
            'product_performance' => $productStats,
            'hourly_trends' => $hourlyTrends,
            'time_period' => [
                'start' => $oneDayAgo->format('Y-m-d H:i:s'),
                'end' => $now->format('Y-m-d H:i:s')
            ]
        ];
    }

    private function prepareAIPrompt(array $salesData): string
    {
        $topProducts = array_slice($salesData['product_performance'], 0, 3);
        $topProductsText = collect($topProducts)->map(function($product) {
            return "{$product->product_name}: {$product->total_quantity} units sold, \${$product->total_revenue} revenue";
        })->join("\n");

        return "You are a sales analytics expert. Analyze this sales data and provide recommendations in JSON format.\n\n" .
               "Sales Data (Last 24 Hours):\n" .
               "Total Revenue: \${$salesData['overall_stats']['total_revenue']}\n" .
               "Total Orders: {$salesData['overall_stats']['total_orders']}\n" .
               "Total Quantity Sold: {$salesData['overall_stats']['total_quantity']}\n\n" .
               "Top 3 Products:\n{$topProductsText}\n\n" .
               "Provide recommendations in this exact JSON format:\n" .
               "{\n" .
               "  \"promotions\": [\"list of promotion recommendations\"],\n" .
               "  \"pricing\": [\"list of pricing strategies\"],\n" .
               "  \"timing\": [\"list of timing-based recommendations\"]\n" .
               "}";
    }

    private function getAIRecommendations(string $prompt): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->aiEndpoint . '?key=' . $this->aiApiKey, [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $prompt
                            ]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $content = $response->json()['candidates'][0]['content']['parts'][0]['text'];
                
                // Remove markdown code block formatting if present
                $content = preg_replace('/^```json\s*|\s*```$/m', '', $content);
                
                $decoded = json_decode($content, true);
                if ($decoded === null) {
                    return [
                        'error' => 'Failed to parse AI response',
                        'raw_response' => $content
                    ];
                }
                
                return $decoded;
            }

            return [
                'error' => 'AI service error',
                'status' => $response->status(),
                'message' => $response->body()
            ];

        } catch (\Exception $e) {
            return [
                'error' => 'Failed to get AI recommendations',
                'message' => $e->getMessage()
            ];
        }
    }
} 