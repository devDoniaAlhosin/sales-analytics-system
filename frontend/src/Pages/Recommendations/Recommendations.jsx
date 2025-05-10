import React, { useState, useEffect } from 'react';
import weatherService from '../../services/api/weatherService';
import Loader from '../../Components/Loader/Loader';
import '../../Styles/pages/Recommendations.scss';

const Recommendations = () => {
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      setLoading(true);
      
      // Get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });

      // Get weather data
      const weatherData = await weatherService.getWeatherByLocation(latitude, longitude);
      setWeather(weatherData);

      // Get product recommendations based on temperature
      const temp = weatherData.main.temp;
      const productRecommendations = await weatherService.getProductRecommendations(temp);
      setRecommendations(productRecommendations);

    } catch (err) {
      console.error('Error:', err);
      setError('Unable to get location or weather data. Please enable location services and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen text="Getting weather-based recommendations..." />;
  if (error) return <div className="error">{error}</div>;
  if (!weather || !recommendations) return <div className="no-data">No recommendations available</div>;

  const temperature = weather.main.temp;
  const weatherDescription = weatherService.getWeatherDescription(temperature);

  return (
    <div className="recommendations-container">
      <div className="weather-info">
        <h2>Current Weather</h2>
        <div className="weather-details">
          <div className="temperature">
            <span className="temp-value">{Math.round(temperature)}°C</span>
            <span className="temp-description">{weatherDescription}</span>
          </div>
          <div className="location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{weather.name}</span>
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Recommended Products</h3>
        <div className="drinks-grid">
          {recommendations.products.map((product, index) => {
            const priceChange = ((product.adjustedPrice - product.originalPrice) / product.originalPrice * 100).toFixed(1);
            
            return (
              <div key={index} className="drink-card">
                <div className="drink-info">
                  <h4>{product.product_name}</h4>
                  <div className="price-info">
                    <span className="current-price">${product.adjustedPrice}</span>
                    {priceChange !== '0.0' && (
                      <span className={`price-change ${priceChange > 0 ? 'increase' : 'decrease'}`}>
                        {priceChange > 0 ? '+' : ''}{priceChange}%
                      </span>
                    )}
                  </div>
                  <div className="product-details">
                    <span className="product-id">ID: {product.product_id}</span>
                    <span className="original-price">Original: ${product.originalPrice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pricing-info">
        <h3>Dynamic Pricing</h3>
        <p>
          {temperature > 25 
            ? "Hot weather alert! Cold drinks are 10% more expensive due to high demand."
            : temperature < 15
            ? "Cold weather alert! Hot drinks are 10% off to keep you warm!"
            : "Regular pricing applies for all drinks."}
        </p>
      </div>
    </div>
  );
};

export default Recommendations; 