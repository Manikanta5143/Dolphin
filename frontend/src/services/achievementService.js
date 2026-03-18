import api from './api';

const achievementService = {
  /**
   * Get all achievements
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Achievements response
   */
  async getAchievements(params = {}) {
    const response = await api.get('/achievements', { params });
    return response.data;
  },

  /**
   * Get user's achievements with progress
   * @returns {Promise<Object>} User achievements response
   */
  async getUserAchievements() {
    const response = await api.get('/achievements/user');
    return response.data;
  },

  /**
   * Get leaderboard
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Leaderboard response
   */
  async getLeaderboard(params = {}) {
    const response = await api.get('/achievements/leaderboard', { params });
    return response.data;
  },

  /**
   * Check for new achievements after user action
   * @param {string} action - Action performed
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Object>} Check achievements response
   */
  async checkAchievements(action, eventId = null) {
    const response = await api.post('/achievements/check', {
      action,
      eventId
    });
    return response.data;
  },

  /**
   * Get achievement statistics
   * @returns {Promise<Object>} Achievement stats response
   */
  async getAchievementStats() {
    const response = await api.get('/achievements/stats');
    return response.data;
  },

  /**
   * Award achievement to user (Admin only)
   * @param {string} userId - User ID
   * @param {string} achievementId - Achievement ID
   * @param {string} reason - Reason for awarding
   * @returns {Promise<Object>} Award response
   */
  async awardAchievement(userId, achievementId, reason = '') {
    const response = await api.post('/achievements/award', {
      userId,
      achievementId,
      reason
    });
    return response.data;
  },

  /**
   * Create new achievement (Admin only)
   * @param {Object} achievementData - Achievement data
   * @returns {Promise<Object>} Create response
   */
  async createAchievement(achievementData) {
    const response = await api.post('/achievements', achievementData);
    return response.data;
  },

  /**
   * Update achievement (Admin only)
   * @param {string} achievementId - Achievement ID
   * @param {Object} achievementData - Updated achievement data
   * @returns {Promise<Object>} Update response
   */
  async updateAchievement(achievementId, achievementData) {
    const response = await api.put(`/achievements/${achievementId}`, achievementData);
    return response.data;
  },

  /**
   * Delete achievement (Admin only)
   * @param {string} achievementId - Achievement ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteAchievement(achievementId) {
    const response = await api.delete(`/achievements/${achievementId}`);
    return response.data;
  }
};

export default achievementService;
