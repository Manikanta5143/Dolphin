import api from './api';

const notificationService = {
  // Get user notifications
  getNotifications: async (options = {}) => {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.unreadOnly) params.append('unreadOnly', options.unreadOnly);
    if (options.type) params.append('type', options.type);
    if (options.category) params.append('category', options.category);
    if (options.priority) params.append('priority', options.priority);
    
    const response = await api.get(`/notifications?${params.toString()}`);
    if (Array.isArray(response.data)) {
    return { success: true, data: response.data };
  }
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Create notification (Admin only)
  createNotification: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  },

  // Get notification preferences
  getPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  // Track notification interaction
  trackInteraction: async (notificationId, interactionData) => {
    const response = await api.post(`/notifications/${notificationId}/track`, interactionData);
    return response.data;
  },

  // Cleanup expired notifications (Admin only)
  cleanupExpiredNotifications: async () => {
    const response = await api.delete('/notifications/cleanup');
    return response.data;
  },

  // Get notification statistics (Admin only)
  getNotificationStats: async (timeframe = '30d') => {
    const response = await api.get(`/notifications/stats?timeframe=${timeframe}`);
    return response.data;
  }
};

export { notificationService };

