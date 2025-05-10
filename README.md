# Sales Analytics Dashboard

A full-stack web application for real-time sales analytics and AI-powered business insights. Built with React (frontend) and Laravel (backend), it provides interactive dashboards, order management, and AI-driven recommendations using Google Gemini AI.

---

## Features
- Real-time sales analytics dashboard
- AI-powered product recommendations and pricing strategies
- Order management (CRUD)
- Interactive charts and data visualization
- Responsive, modern UI
- RESTful API

---

## Tech Stack
- **Frontend:** React, Vite, SCSS, Chart.js, FontAwesome, React Router
- **Backend:** Laravel 12.x (PHP 8.1+), MySQL/SQLite, Google Gemini API, RESTful API

---

## Directory Structure
```
sales-analytics-dashboard/
├── backend/   # Laravel backend (API, business logic, database)
├── frontend/  # React frontend (UI, charts, chatbot)
```

---

## Prerequisites
- Node.js (v14 or higher)
- PHP (v8.1 or higher)
- Composer
- MySQL or SQLite
- Git
- Google Gemini API key (for AI features)

---

## Cloning the Repository
```bash
git clone https://github.com/devDoniaAlhosin/sales-analytics-system.git
cd sales-analytics-dashboard
```

---

## Backend Setup (Laravel)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Install Node dependencies (for asset compilation):
   ```bash
   npm install
   ```
4. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   # Edit .env to set DB credentials and your Gemini API key
   ```
   Example `.env` entries:
   ```env
   DB_CONNECTION=sqlite
   GEMINI_API_KEY=your_gemini_api_key_here in env.example
   ```
5. Generate application key:
   ```bash
   php artisan key:generate
   ```
6. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
7. Build frontend assets (if needed):
   ```bash
   npm run build
   ```
8. Start the Laravel server:
   ```bash
   php artisan serve
   # Default: http://127.0.0.1:8000
   ```

---

## Frontend Setup (React)
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   # Default: http://localhost:5173
   #hosted :https://sales-analytics-system-9e54nhx51-devdoniaalhosins-projects.vercel.app/
   ```

---

## API Overview
- **GET /api/analytics** — Real-time sales insights (revenue, orders, product performance, trends)
- **GET /api/recommendations** — AI-powered recommendations (promotions, pricing, timing)
- **GET/POST/PATCH/DELETE /api/orders** — Order management endpoints

The frontend is pre-configured to call these endpoints from the backend server.

---

## Getting a Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create/copy your API key
3. Add it to your backend `.env` as `GEMINI_API_KEY`

---

## Development Tips
- The backend and frontend run independently. Make sure both are running for full functionality.
- Update API URLs in the frontend if you change backend ports or use a remote server.
- For production, build both frontend and backend assets and deploy as needed.


---

## License
This project is licensed under the MIT License. See the LICENSE file for details. 