# Sales Analytics Dashboard

A modern web application for sales analytics and AI-powered business insights, built with React and Laravel.

## Features

### 1. Dashboard Overview
- Real-time sales statistics
- Total orders, revenue, and quantity tracking
- Interactive data visualization
- Responsive design for all devices

### 2. Analytics Section
- Detailed sales analytics
- Trend analysis
- Performance metrics
- Custom date range selection
- Multiple chart types (Line, Bar, Pie)

### 3. Orders Management
- Order tracking and management
- Order history
- Status updates
- Filtering and sorting capabilities

### 4. AI-Powered Chatbot
- Real-time business recommendations
- Three categories of insights:
  - Promotions
  - Pricing strategies
  - Timing-based recommendations
- Interactive chat interface
- Automatic response generation

## Tech Stack

### Frontend
- React.js
- SCSS for styling
- FontAwesome for icons
- React Router for navigation
- Custom components and hooks

### Backend
- Laravel (PHP)
- RESTful API
- MySQL database
- AI integration for recommendations

## Project Structure

```
frontend/
├── src/
│   ├── Components/
│   │   ├── Chatbot/
│   │   ├── Loader/
│   │   └── OrderForm/
│   ├── Pages/
│   │   ├── Analytics/
│   │   ├── Dashboard/
│   │   ├── Home/
│   │   └── Orders/
│   ├── Styles/
│   │   ├── components/
│   │   └── pages/
│   └── Helpers/
│       └── geminiHelper.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PHP (v8.0 or higher)
- Composer
- MySQL
- Git

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/devDoniaAlhosin/sales-analytics-system.git
   cd sales-analytics-dashboard/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials.

4. Run migrations:
   ```bash
   php artisan migrate
   ```

5. Start the Laravel server:
   ```bash
   php artisan serve
   ```

## Key Components

### Chatbot Implementation
The AI-powered chatbot is implemented using a combination of React components and helper functions:

1. **Chatbot Component** (`src/Components/Chatbot/Chatbot.jsx`)
   - Handles chat interface
   - Manages message state
   - Processes user input
   - Displays recommendations

2. **Helper Functions** (`src/Helpers/geminiHelper.js`)
   - `formatRecommendations`: Formats data for display
   - `fetchRecommendations`: API integration
   - `generateResponse`: Response generation
   - `formatErrorMessage`: Error handling
   - `formatResponse`: Message formatting

### Styling
The project uses SCSS for styling with a modular approach:
- Component-specific styles
- Responsive design
- Modern animations
- Consistent color scheme
- Custom scrollbars

## API Endpoints

### Recommendations
- `GET /api/recommendations`
  - Returns AI-generated recommendations
  - Includes promotions, pricing, and timing insights

### Analytics
- `GET /api/analytics`
  - Returns sales analytics data
  - Includes charts and statistics

### Orders
- `GET /api/orders`
  - Returns order history
- `POST /api/orders`
  - Creates new orders

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FontAwesome for icons
- React community for excellent documentation
- Laravel team for the robust backend framework
