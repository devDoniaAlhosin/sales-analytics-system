import axios from 'axios';

const API_KEY = "ec25305ebc8508398083da2ab9773029";
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Log API key status (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('OpenWeather API Key Status:', API_KEY ? 'Loaded' : 'Missing');
}

const weatherService = {
  async getWeatherByLocation(latitude, longitude) {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric' // Use Celsius
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  async getProductRecommendations(temperature) {
    try {
      // Fetch all products from your ordeAPI
      const response = await axios.get('http://localhost:8000/api/orders');
      const allProducts = response.data.data || [];

      // Categorize products based on their names
      const categorizedProducts = {
        hot: allProducts.filter(product => 
          product.product_name.toLowerCase().includes('hot') || 
          product.product_name.toLowerCase().includes('coffee') ||
          product.product_name.toLowerCase().includes('tea')
        ),
        cold: allProducts.filter(product => 
          product.product_name.toLowerCase().includes('cold') || 
          product.product_name.toLowerCase().includes('iced') ||
          product.product_name.toLowerCase().includes('smoothie')
        ),
        neutral: allProducts.filter(product => 
          !product.product_name.toLowerCase().includes('hot') && 
          !product.product_name.toLowerCase().includes('cold') &&
          !product.product_name.toLowerCase().includes('coffee') &&
          !product.product_name.toLowerCase().includes('tea') &&
          !product.product_name.toLowerCase().includes('iced') &&
          !product.product_name.toLowerCase().includes('smoothie')
        )
      };

      // Sort products by price in descending order
      Object.keys(categorizedProducts).forEach(category => {
        categorizedProducts[category].sort((a, b) => b.price - a.price);
      });

      // Select top 4 products based on temperature
      let selectedProducts;
      let priceMultiplier;

      if (temperature > 25) {
        selectedProducts = categorizedProducts.cold.slice(0, 4);
        priceMultiplier = 1.1; // 10% increase for cold drinks on hot days
      } else if (temperature < 15) {
        selectedProducts = categorizedProducts.hot.slice(0, 4);
        priceMultiplier = 0.9; // 10% discount for hot drinks on cold days
      } else {
        selectedProducts = categorizedProducts.neutral.slice(0, 4);
        priceMultiplier = 1.0; // No price adjustment
      }

      // Apply price adjustments
      const adjustedProducts = selectedProducts.map(product => ({
        ...product,
        originalPrice: product.price,
        adjustedPrice: (product.price * priceMultiplier).toFixed(2)
      }));

      return {
        category: temperature > 25 ? 'cold' : temperature < 15 ? 'hot' : 'neutral',
        products: adjustedProducts,
        priceMultiplier
      };
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      throw error;
    }
  },

  calculateDynamicPrice(basePrice, temperature) {
    let multiplier = 1.0;
    
    if (temperature > 25) {
      multiplier = 1.1; // 10% increase for cold drinks
    } else if (temperature < 15) {
      multiplier = 0.9; // 10% discount for hot drinks
    }

    return (basePrice * multiplier).toFixed(2);
  },

  getWeatherDescription(temperature) {
    if (temperature > 25) {
      return 'Hot weather - Perfect for cold drinks!';
    } else if (temperature < 15) {
      return 'Cold weather - Time for something warm!';
    } else {
      return 'Moderate weather - Any drink will do!';
    }
  }
};

export default weatherService; 