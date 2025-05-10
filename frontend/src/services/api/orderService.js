import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return Array.isArray(response.data) ? response.data : response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await axios.patch(`${API_URL}/orders/${orderId}`, orderData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      await axios.delete(`${API_URL}/orders/${orderId}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService; 