import api from './api';

const rsvpService = {
  // Create or update RSVP
  createRSVP: async (rsvpData) => {
    const response = await api.post('/rsvp', rsvpData);
    return response.data;
  },

  // Get user RSVPs
  getUserRSVPs: async (options = {}) => {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.status) params.append('status', options.status);
    if (options.upcoming) params.append('upcoming', options.upcoming);

    const response = await api.get(`/rsvp?${params.toString()}`);
    return response.data;
  },

  // Get RSVP details
  getRSVP: async (rsvpId) => {
    const response = await api.get(`/rsvp/${rsvpId}`);
    return response.data;
  },

  // Update RSVP
  updateRSVP: async (rsvpId, updateData) => {
    const response = await api.put(`/rsvp/${rsvpId}`, updateData);
    return response.data;
  },

  // Delete RSVP
  deleteRSVP: async (rsvpId) => {
    const response = await api.delete(`/rsvp/${rsvpId}`);
    return response.data;
  },

  // Check in to event
  checkIn: async (rsvpId) => {
    const response = await api.post(`/rsvp/${rsvpId}/checkin`);
    return response.data;
  },

  // Check out of event
  checkOut: async (rsvpId) => {
    const response = await api.post(`/rsvp/${rsvpId}/checkout`);
    return response.data;
  },

  // Submit feedback
  submitFeedback: async (rsvpId, feedbackData) => {
    const response = await api.post(`/rsvp/${rsvpId}/feedback`, feedbackData);
    return response.data;
  },

  // Get user's RSVP for specific event
  getUserRSVP: async (eventId) => {
    try {
      const response = await api.get(`/rsvp/event/${eventId}`);
      return response.data;
    } catch (error) {
      // Return null if no RSVP found
      return { success: false, data: null };
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 10) => {
    const response = await api.get(`/rsvp/upcoming?limit=${limit}`);
    return response.data;
  },

  // Get event RSVPs (Admin only)
  getEventRSVPs: async (eventId, options = {}) => {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.status) params.append('status', options.status);
    if (options.includeFeedback) params.append('includeFeedback', options.includeFeedback);

    const response = await api.get(`/rsvp/admin/event/${eventId}?${params.toString()}`);
    return response.data;
  },

  // Get RSVP statistics (Admin only)
  getRSVPStats: async (eventId = null) => {
    const params = eventId ? `?eventId=${eventId}` : '';
    const response = await api.get(`/rsvp/admin/stats${params}`);
    return response.data;
  }
};

export { rsvpService };

