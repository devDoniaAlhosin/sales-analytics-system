# Sales Analytics Dashboard Backend

A Laravel-based backend for a sales analytics dashboard that provides real-time sales insights and AI-powered recommendations using Google's Gemini AI.

## Features

- Real-time sales analytics
- AI-powered product recommendations
- Dynamic pricing suggestions
- Time-based promotion strategies
- RESTful API endpoints

## Prerequisites

- PHP 8.1 or higher
- Composer
- MySQL/SQLite
- Laravel 10.x
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/devDoniaAlhosin/sales-analytics-system.git
cd sales-analytics-dashboard/backend
```

2. Install dependencies:
```bash
composer install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env`:
```env
DB_CONNECTION=sqlite
GEMINI_API_KEY=AIzaSyD0cF-pn9oS3EeJAmYbwDgGw6A6aZDLvQQ


```

6. Run migrations:
```bash
php artisan migrate
```

7. Seed the database with sample data:
```bash
php artisan db:seed
```

## Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API key"
4. Create a new API key or use an existing one
5. Copy the API key and add it to your `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Running the Application

1. Start the Laravel development server:
```bash
php artisan serve
```

The server will start at `http://127.0.0.1:8000`

## API Endpoints

### 1. Get Sales Analytics
```http
GET /api/analytics
```
Returns real-time sales insights including:
- Total revenue
- Order count
- Product performance
- Hourly trends

### 2. Get AI Recommendations
```http
GET /api/recommendations
```
Returns AI-powered recommendations for:
- Product promotions
- Pricing strategies
- Timing-based promotions

Example response:
```json
{
    "success": true,
    "data": {
        "sales_data": {
            "overall_stats": {
                "total_orders": 150,
                "total_quantity": 300,
                "total_revenue": 1500.00
            },
            "product_performance": [
                {
                    "product_name": "Pumpkin Spice Latte-Hot",
                    "total_quantity": 75,
                    "total_revenue": 375.00
                }
            ],
            "hourly_trends": [
                {
                    "hour": "08",
                    "order_count": 25,
                    "revenue": 125.00
                }
            ]
        },
        "recommendations": {
            "promotions": [
                "Run a limited-time promotion on Pumpkin Spice Latte",
                "Create bundle deals with complementary items"
            ],
            "pricing": [
                "Implement dynamic pricing during peak hours",
                "Offer volume discounts for bulk purchases"
            ],
            "timing": [
                "Launch morning specials for hot drinks",
                "Start afternoon promotions for cold drinks"
            ]
        }
    }
}
```

### 3. Order Management
```http
GET /api/orders
POST /api/orders
GET /api/orders/{id}
PATCH /api/orders/{id}
DELETE /api/orders/{id}
```

## Testing

Run the test suite:
```bash
php artisan test
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
