import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faShoppingCart, faLightbulb, faTag, faClock, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../Components/Loader/Loader';
import Chatbot from '../../Components/Chatbot/Chatbot';
import '../../Styles/pages/Home.scss';

const Home = () => {
  const [salesData, setSalesData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/recommendations');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.success) {
          setSalesData(data.data.sales_data);
          setRecommendations(data.data.recommendations);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader size="large" text="Loading dashboard data..." fullScreen />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <div className="dashboard-header">
        <h1>Sales Analytics Dashboard</h1>
        <p>Monitor your sales performance and get insights to grow your business</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
          <div className="stat-value">{salesData?.overall_stats.total_orders || 0}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
          <div className="stat-value">${salesData?.overall_stats.total_revenue?.toFixed(2) || '0.00'}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faLightbulb} className="stat-icon" />
          <div className="stat-value">{salesData?.overall_stats.total_quantity || 0}</div>
          <div className="stat-label">Total Quantity</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <Link to="/analytics" className="dashboard-section">
          <FontAwesomeIcon icon={faChartLine} className="section-icon" />
          <h3 className="section-title">Analytics</h3>
          <p className="section-description">View detailed sales analytics and trends</p>
        </Link>
        <Link to="/orders" className="dashboard-section">
          <FontAwesomeIcon icon={faShoppingCart} className="section-icon" />
          <h3 className="section-title">Orders</h3>
          <p className="section-description">Manage and track your orders</p>
        </Link>
        <Link to="/recommendations" className="dashboard-section">
          <FontAwesomeIcon icon={faLightbulb} className="section-icon" />
          <h3 className="section-title">Recommendations</h3>
          <p className="section-description">Get AI-powered business insights</p>
        </Link>
      </div>

      <Chatbot />
    </div>
  );
};

export default Home; 