<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use DateTime;
use DateTimeZone;

class OrderController extends Controller
{
    /**
     * Get all orders
     */
    public function index(): JsonResponse
    {
        try {
            $orders = DB::select('SELECT * FROM orders ORDER BY created_at DESC');
            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific order by id or order_id
     */
    public function show(Request $request, $id = null): JsonResponse
    {
        try {
            // Check if order_id is provided in the request
            $orderId = $request->input('order_id', $id);
            
            if (!$orderId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order ID is required'
                ], 400);
            }

            $order = DB::select('SELECT * FROM orders WHERE id = ?', [$orderId]);
            
            if (empty($order)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $order[0]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new order
     */
    public function store(Request $request): JsonResponse
    {
        // Manual validation
        $errors = [];
        
        if (!$request->has('product_id')) {
            $errors['product_id'] = 'Product ID is required';
        } elseif (!is_numeric($request->product_id)) {
            $errors['product_id'] = 'Product ID must be a number';
        } else {
            // Check if product_id already exists
            $existingOrder = DB::select('SELECT id FROM orders WHERE product_id = ?', [$request->product_id]);
            if (!empty($existingOrder)) {
                $errors['product_id'] = 'Product ID must be unique';
            }
        }

        if (!$request->has('product_name')) {
            $errors['product_name'] = 'Product name is required';
        } elseif (!is_string($request->product_name) || trim($request->product_name) === '') {
            $errors['product_name'] = 'Product name must be a non-empty string';
        }

        if (!$request->has('quantity')) {
            $errors['quantity'] = 'Quantity is required';
        } elseif (!is_numeric($request->quantity) || $request->quantity <= 0) {
            $errors['quantity'] = 'Quantity must be a positive number';
        }

        if (!$request->has('price')) {
            $errors['price'] = 'Price is required';
        } elseif (!is_numeric($request->price) || $request->price <= 0) {
            $errors['price'] = 'Price must be a positive number';
        }

        if (!$request->has('date')) {
            $errors['date'] = 'Date is required';
        } else {
            try {
                $date = new DateTime($request->date);
                $date->setTimezone(new DateTimeZone('UTC'));
                $utcDate = $date->format('Y-m-d\TH:i:s\Z');
            } catch (\Exception $e) {
                $errors['date'] = 'Date must be a valid ISO 8601 format';
            }
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'errors' => $errors
            ], 422);
        }

        try {
            DB::insert('
                INSERT INTO orders (product_id, product_name, quantity, price, date)
                VALUES (?, ?, ?, ?, ?)
            ', [
                $request->product_id,
                $request->product_name,
                $request->quantity,
                $request->price,
                $utcDate
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'id' => DB::getPdo()->lastInsertId(),
                    'product_id' => $request->product_id,
                    'product_name' => $request->product_name,
                    'quantity' => $request->quantity,
                    'price' => $request->price,
                    'date' => $utcDate
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing order
     */
    public function update(Request $request, $id): JsonResponse
    {
        // Check if order exists
        $order = DB::select('SELECT * FROM orders WHERE id = ?', [$id]);
        if (empty($order)) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Manual validation
        $errors = [];
        
        if ($request->has('product_id')) {
            if (!is_numeric($request->product_id)) {
                $errors['product_id'] = 'Product ID must be a number';
            } else {
                // Check if product_id already exists in other orders
                $existingOrder = DB::select(
                    'SELECT id FROM orders WHERE product_id = ? AND id != ?',
                    [$request->product_id, $id]
                );
                if (!empty($existingOrder)) {
                    $errors['product_id'] = 'Product ID must be unique';
                }
            }
        }

        if ($request->has('product_name') && (!is_string($request->product_name) || trim($request->product_name) === '')) {
            $errors['product_name'] = 'Product name must be a non-empty string';
        }

        if ($request->has('quantity') && (!is_numeric($request->quantity) || $request->quantity <= 0)) {
            $errors['quantity'] = 'Quantity must be a positive number';
        }

        if ($request->has('price') && (!is_numeric($request->price) || $request->price <= 0)) {
            $errors['price'] = 'Price must be a positive number';
        }

        if ($request->has('date')) {
            try {
                $date = new DateTime($request->date);
                $date->setTimezone(new DateTimeZone('UTC'));
                $utcDate = $date->format('Y-m-d\TH:i:s\Z');
            } catch (\Exception $e) {
                $errors['date'] = 'Date must be a valid ISO 8601 format';
            }
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'errors' => $errors
            ], 422);
        }

        try {
            $updates = [];
            $params = [];

            if ($request->has('product_id')) {
                $updates[] = 'product_id = ?';
                $params[] = $request->product_id;
            }

            if ($request->has('product_name')) {
                $updates[] = 'product_name = ?';
                $params[] = $request->product_name;
            }

            if ($request->has('quantity')) {
                $updates[] = 'quantity = ?';
                $params[] = $request->quantity;
            }

            if ($request->has('price')) {
                $updates[] = 'price = ?';
                $params[] = $request->price;
            }

            if ($request->has('date')) {
                $updates[] = 'date = ?';
                $params[] = $utcDate;
            }

            if (empty($updates)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No fields to update'
                ], 400);
            }

            $params[] = $id;
            $sql = 'UPDATE orders SET ' . implode(', ', $updates) . ' WHERE id = ?';
            
            DB::update($sql, $params);

            // Fetch updated order
            $updatedOrder = DB::select('SELECT * FROM orders WHERE id = ?', [$id])[0];

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $updatedOrder
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an order
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Check if order exists
            $order = DB::select('SELECT * FROM orders WHERE id = ?', [$id]);
            if (empty($order)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            DB::delete('DELETE FROM orders WHERE id = ?', [$id]);

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 