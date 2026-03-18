import api from './api';

const dashboardService = {
  /**
   * Get personalized dashboard data
   * @returns {Promise<Object>} Dashboard data response
   */
  async getDashboard() {
    const response = await api.get('/dashboard');
    return response.data;
  },

  /**
   * Get specific dashboard widgets
   * @param {Array} widgets - Array of widget names to fetch
   * @returns {Promise<Object>} Widgets data response
   */
  async getDashboardWidgets(widgets = []) {
    const params = new URLSearchParams();
    widgets.forEach(widget => params.append('widgets', widget));
    
    const response = await api.get(`/dashboard/widgets?${params.toString()}`);
    return response.data;
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User stats response
   */
  async getUserStats() {
    const response = await this.getDashboardWidgets(['stats']);
    return response.data.stats;
  },

  /**
   * Get user's bookmarked events
   * @returns {Promise<Object>} Bookmarked events response
   */
  async getBookmarkedEvents() {
    const response = await this.getDashboardWidgets(['bookmarks']);
    return response.data.bookmarks;
  },

  /**
   * Get personalized recommendations
   * @returns {Promise<Object>} Recommendations response
   */
  async getRecommendations() {
    const response = await this.getDashboardWidgets(['recommendations']);
    return response.data.recommendations;
  },

  /**
   * Get trending events
   * @returns {Promise<Object>} Trending events response
   */
  async getTrendingEvents() {
    const response = await this.getDashboardWidgets(['trending']);
    return response.data.trending;
  },

  /**
   * Get user's recent achievements
   * @returns {Promise<Object>} Achievements response
   */
  async getRecentAchievements() {
    const response = await this.getDashboardWidgets(['achievements']);
    return response.data.achievements;
  },

  /**
   * Get leaderboard data
   * @returns {Promise<Object>} Leaderboard response
   */
  async getLeaderboard() {
    const response = await this.getDashboardWidgets(['leaderboard']);
    return response.data.leaderboard;
  }
};

export default dashboardService;
