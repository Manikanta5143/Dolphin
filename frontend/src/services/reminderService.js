import api from './api';

const reminderService = {
  // Create reminder
  createReminder: async (reminderData) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },

  // Get user reminders
  getUserReminders: async (options = {}) => {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.status) params.append('status', options.status);
    if (options.eventId) params.append('eventId', options.eventId);

    const response = await api.get(`/reminders?${params.toString()}`);
    return response.data;
  },

  // Get reminder details
  getReminder: async (reminderId) => {
    const response = await api.get(`/reminders/${reminderId}`);
    return response.data;
  },

  // Update reminder
  updateReminder: async (reminderId, updateData) => {
    const response = await api.put(`/reminders/${reminderId}`, updateData);
    return response.data;
  },

  // Delete reminder
  deleteReminder: async (reminderId) => {
    const response = await api.delete(`/reminders/${reminderId}`);
    return response.data;
  },

  // Mark reminder as sent
  markReminderSent: async (reminderId, type = 'both') => {
    const response = await api.put(`/reminders/${reminderId}/mark-sent`, { type });
    return response.data;
  },

  // Track reminder interaction
  trackInteraction: async (reminderId, interactionData) => {
    const response = await api.post(`/reminders/${reminderId}/track`, interactionData);
    return response.data;
  },

  // Get active reminders (Admin only)
  getActiveReminders: async () => {
    const response = await api.get('/reminders/admin/active');
    return response.data;
  },

  // Get retryable reminders (Admin only)
  getRetryableReminders: async () => {
    const response = await api.get('/reminders/admin/retryable');
    return response.data;
  },

  // Cleanup expired reminders (Admin only)
  cleanupExpiredReminders: async () => {
    const response = await api.delete('/reminders/admin/cleanup');
    return response.data;
  },

  // Get reminder statistics (Admin only)
  getReminderStats: async (timeframe = '30d') => {
    const response = await api.get(`/reminders/admin/stats?timeframe=${timeframe}`);
    return response.data;
  }
};

export { reminderService };

