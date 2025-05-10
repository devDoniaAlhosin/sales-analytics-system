// Gemini Chatbot Helper Functions

/**
 * Format recommendations into chat messages
 * @param {Object} recommendations - The recommendations data
 * @returns {Array} Array of formatted chat messages
 */
export const formatRecommendations = (recommendations) => {
  if (!recommendations) return [];

  const messages = [
    {
      type: 'bot',
      content: "Hello! I'm your AI assistant. Here are some recommendations based on your sales data:"
    }
  ];

  // Add promotions
  if (recommendations.promotions?.length > 0) {
    messages.push({
      type: 'bot',
      content: "📊 Promotions Recommendations:",
      isHeader: true
    });
    recommendations.promotions.forEach(promo => {
      messages.push({
        type: 'bot',
        content: `• ${promo}`
      });
    });
  }

  // Add pricing
  if (recommendations.pricing?.length > 0) {
    messages.push({
      type: 'bot',
      content: "💰 Pricing Recommendations:",
      isHeader: true
    });
    recommendations.pricing.forEach(price => {
      messages.push({
        type: 'bot',
        content: `• ${price}`
      });
    });
  }

  // Add timing
  if (recommendations.timing?.length > 0) {
    messages.push({
      type: 'bot',
      content: "⏰ Timing Recommendations:",
      isHeader: true
    });
    recommendations.timing.forEach(time => {
      messages.push({
        type: 'bot',
        content: `• ${time}`
      });
    });
  }

  return messages;
};

/**
 * Fetch recommendations from the API
 * @returns {Promise} Promise with recommendations data
 */
export const fetchRecommendations = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/recommendations');
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const data = await response.json();
    if (data.success) {
      return data.data.recommendations;
    }
    throw new Error('Invalid data format');
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Generate a response based on user input
 * @param {string} input - User's input message
 * @param {Object} recommendations - Current recommendations data
 * @returns {Object} Formatted response message
 */
export const generateResponse = (input, recommendations) => {
  const lowerInput = input.toLowerCase();

  // Check for specific keywords in the input
  if (lowerInput.includes('promotion') || lowerInput.includes('promo')) {
    return {
      type: 'bot',
      content: recommendations.promotions?.length > 0
        ? recommendations.promotions
        : "I don't have any promotion recommendations at the moment."
    };
  }

  if (lowerInput.includes('price') || lowerInput.includes('pricing')) {
    return {
      type: 'bot',
      content: recommendations.pricing?.length > 0
        ? recommendations.pricing
        : "I don't have any pricing recommendations at the moment."
    };
  }

  if (lowerInput.includes('time') || lowerInput.includes('timing')) {
    return {
      type: 'bot',
      content: recommendations.timing?.length > 0
        ? recommendations.timing
        : "I don't have any timing recommendations at the moment."
    };
  }

  // Default response for other inputs
  return {
    type: 'bot',
    content: "I can help you with promotions, pricing strategies, and timing-based recommendations. What would you like to know more about?"
  };
};

/**
 * Format error message for display
 * @param {Error} error - The error object
 * @returns {Object} Formatted error message
 */
export const formatErrorMessage = (error) => {
  return {
    type: 'bot',
    content: `Sorry, I encountered an error: ${error.message}. Please try again later.`,
    isError: true
  };
};

/**
 * Check if the response is an array and format it accordingly
 * @param {Object} response - The response object
 * @returns {Array} Array of formatted messages
 */
export const formatResponse = (response) => {
  if (Array.isArray(response.content)) {
    return response.content.map(item => ({
      type: 'bot',
      content: `• ${item}`
    }));
  }
  return [response];
}; 