<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use DateTime;
use DateTimeZone;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['id' => 'H001', 'name' => 'Hot Chocolate-Hot', 'base_price' => 4.99],
            ['id' => 'H002', 'name' => 'Coffee-Hot', 'base_price' => 3.99],
            ['id' => 'H003', 'name' => 'Tea-Hot', 'base_price' => 2.99],
            ['id' => 'C001', 'name' => 'Iced Coffee-Cold', 'base_price' => 4.49],
            ['id' => 'C002', 'name' => 'Lemonade-Cold', 'base_price' => 3.49],
            ['id' => 'C003', 'name' => 'Smoothie-Cold', 'base_price' => 5.99],
            ['id' => 'S001', 'name' => 'Pumpkin Spice Latte', 'base_price' => 5.49],
            ['id' => 'S002', 'name' => 'Peppermint Mocha', 'base_price' => 5.99],
            ['id' => 'S003', 'name' => 'Summer Berry Tea', 'base_price' => 4.49],
        ];

        $now = new DateTime('now', new DateTimeZone('UTC'));
        
        for ($i = 0; $i < 100; $i++) {
            $orderTime = (clone $now)->modify('-' . rand(0, 1440) . ' minutes');
            $product = $products[array_rand($products)];
            $quantity = rand(1, 5);
            $price = $this->calculateDynamicPrice($product['base_price'], $orderTime);
            DB::insert('
                INSERT INTO orders (product_id, product_name, quantity, price, date, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ', [
                $product['id'],
                $product['name'],
                $quantity,
                $price,
                $orderTime->format('Y-m-d\TH:i:s\Z'),
                $orderTime->format('Y-m-d H:i:s')
            ]);
        }

        for ($i = 0; $i < 5; $i++) {
            $orderTime = (clone $now)->modify('-' . rand(0, 60) . ' seconds');
            $product = $products[array_rand($products)];
            $quantity = rand(1, 3);
            $price = $this->calculateDynamicPrice($product['base_price'], $orderTime);
            DB::insert('
                INSERT INTO orders (product_id, product_name, quantity, price, date, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ', [
                $product['id'],
                $product['name'],
                $quantity,
                $price,
                $orderTime->format('Y-m-d\TH:i:s\Z'),
                $orderTime->format('Y-m-d H:i:s')
            ]);
        }
    }

    private function calculateDynamicPrice(float $basePrice, DateTime $orderTime): float
    {
        $hour = (int)$orderTime->format('H');
        if (($hour >= 7 && $hour <= 9) || ($hour >= 17 && $hour <= 19)) {
            $basePrice *= 1.1;
        }
        if ($hour >= 22 || $hour <= 5) {
            $basePrice *= 0.95;
        }
        $variation = rand(-5, 5) / 100;
        $basePrice *= (1 + $variation);
        return round($basePrice, 2);
    }
} 