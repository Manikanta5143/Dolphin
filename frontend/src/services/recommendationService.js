import api from './api';

const recommendationService = {
  /**
   * Get personalized recommendations for the current user
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Recommendations response
   */
  async getRecommendations(options = {}) {
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit);
    if (options.excludeBookmarked !== undefined) {
      params.append('excludeBookmarked', options.excludeBookmarked);
    }

    const response = await api.get(`/recommendations?${params.toString()}`);
    return response.data;
  },

  /**
   * Get explanation for why an event was recommended
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Explanation response
   */
  async getRecommendationExplanation(eventId) {
    const response = await api.get(`/recommendations/explain/${eventId}`);
    return response.data;
  },

  /**
   * Record user feedback on a recommendation
   * @param {string} eventId - Event ID
   * @param {string} feedback - 'interested' or 'not_interested'
   * @returns {Promise<Object>} Feedback response
   */
  async recordFeedback(eventId, feedback) {
    const response = await api.post('/recommendations/feedback', {
      eventId,
      feedback
    });
    return response.data;
  },

  /**
   * Mark an event as not interested
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Feedback response
   */
  async markNotInterested(eventId) {
    return this.recordFeedback(eventId, 'not_interested');
  },

  /**
   * Mark an event as interested
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Feedback response
   */
  async markInterested(eventId) {
    return this.recordFeedback(eventId, 'interested');
  }
};

export default recommendationService;
