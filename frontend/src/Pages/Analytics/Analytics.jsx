import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import analyticsService from '../../services/api/analyticsService';
import Loader from '../../Components/Loader/Loader';
import '../../Styles/pages/Analytics.scss';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getAnalytics();
      
      // Check if response has the expected structure
      if (response && response.success && response.data) {
        setAnalyticsData(response.data);
        setChartData(analyticsService.processChartData(response.data));
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen text="Loading analytics data..." />;
  if (error) return <div className="error">{error}</div>;
  if (!analyticsData || !chartData) return <div className="no-data">No analytics data available</div>;

  // Total Revenue Circular Progress Data
  const totalRevenueData = {
    labels: ['Revenue', 'Remaining'],
    datasets: [{
      data: [analyticsData.total_revenue, 5000 - analyticsData.total_revenue], // Assuming 5000 as max
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(200, 200, 200, 0.2)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(200, 200, 200, 0.3)',
      ],
      borderWidth: 1,
      circumference: 180,
      rotation: 270,
    }],
  };

  const totalRevenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: '70%',
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="analytics-container">
      <h2>Sales Analytics Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card revenue-card">
          <div className="revenue-chart">
            <Doughnut data={totalRevenueData} options={totalRevenueOptions} />
            <div className="revenue-overlay">
              <h3>Total Revenue</h3>
              <p className="stat-value">{analyticsService.formatCurrency(analyticsData.total_revenue)}</p>
              <p className="revenue-target">Target: $5,000</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <h3>Last Minute Orders</h3>
          <p className="stat-value">{analyticsData.last_minute.order_count}</p>
          <p className="stat-subvalue">{analyticsService.formatCurrency(analyticsData.last_minute.revenue)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{analyticsData.top_products.length}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Revenue by Product</h3>
          <Doughnut data={chartData.revenueData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <h3>Quantity Sold by Product</h3>
          <Bar data={chartData.quantityData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <h3>Order Count by Product</h3>
          <Bar data={chartData.orderCountData} options={chartOptions} />
        </div>
      </div>

      <div className="last-updated">
        Last updated: {analyticsService.formatDate(analyticsData.timestamp)}
      </div>
    </div>
  );
};

export default Analytics; 