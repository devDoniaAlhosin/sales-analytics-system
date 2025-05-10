<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use DateTime;
use DateTimeZone;

class AnalyticsController extends Controller
{
    /**
     * Get real-time sales analytics
     */
    public function index(): JsonResponse
    {
        try {
            // Get current time in UTC
            $now = new DateTime('now', new DateTimeZone('UTC'));
            $oneMinuteAgo = (clone $now)->modify('-1 minute');

            // Format dates for SQL
            $nowStr = $now->format('Y-m-d H:i:s');
            $oneMinuteAgoStr = $oneMinuteAgo->format('Y-m-d H:i:s');

            // 1. Calculate total revenue
            $totalRevenue = DB::select('
                SELECT COALESCE(SUM(price * quantity), 0) as total_revenue 
                FROM orders
            ')[0]->total_revenue;

            // 2. Get top products by sales
            $topProducts = DB::select('
                SELECT 
                    product_id,
                    product_name,
                    SUM(quantity) as total_quantity,
                    SUM(price * quantity) as total_revenue,
                    COUNT(*) as order_count
                FROM orders
                GROUP BY product_id, product_name
                ORDER BY total_revenue DESC
                LIMIT 5
            ');

            // 3. Calculate revenue changes in the last minute
            $revenueLastMinute = DB::select('
                SELECT COALESCE(SUM(price * quantity), 0) as revenue
                FROM orders
                WHERE created_at BETWEEN ? AND ?
            ', [$oneMinuteAgoStr, $nowStr])[0]->revenue;

            // 4. Count orders in the last minute
            $ordersLastMinute = DB::select('
                SELECT COUNT(*) as order_count
                FROM orders
                WHERE created_at BETWEEN ? AND ?
            ', [$oneMinuteAgoStr, $nowStr])[0]->order_count;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_revenue' => (float) $totalRevenue,
                    'top_products' => $topProducts,
                    'last_minute' => [
                        'revenue' => (float) $revenueLastMinute,
                        'order_count' => (int) $ordersLastMinute
                    ],
                    'timestamp' => $nowStr
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 