import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const analyticsService = {
  async getAnalytics() {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  processChartData(data) {
    if (!data || !data.top_products) {
      return null;
    }

    const products = data.top_products;
    const labels = products.map(product => product.product_name);
    
    return {
      revenueData: {
        labels,
        datasets: [{
          data: products.map(product => product.total_revenue),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }],
      },
      quantityData: {
        labels,
        datasets: [{
          label: 'Quantity Sold',
          data: products.map(product => product.total_quantity),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      orderCountData: {
        labels,
        datasets: [{
          label: 'Order Count',
          data: products.map(product => product.order_count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      },
    };
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  },

  formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

export default analyticsService; 