import api from './api'

// Simple cache for API responses
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const getCacheKey = (endpoint, params) => {
  return `${endpoint}_${JSON.stringify(params)}`
}

const isCacheValid = (cacheEntry) => {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION
}

const getCachedData = (key) => {
  const cacheEntry = cache.get(key)
  if (cacheEntry && isCacheValid(cacheEntry)) {
    return cacheEntry.data
  }
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export const eventService = {
  async getEvents(params = {}) {
    const cacheKey = getCacheKey('/events', params)
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      console.log('Using cached events data')
      return cachedData
    }
    
    const response = await api.get('/events', { params })
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getEvent(id) {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  async createEvent(eventData) {
    const response = await api.post('/events', eventData)
    return response.data
  },

  async updateEvent(id, eventData) {
    const response = await api.put(`/events/${id}`, eventData)
    return response.data
  },

  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },

  async getBookmarks() {
    const response = await api.get('/users/bookmarks')
    return response.data
  },

  async addBookmark(eventId) {
    const response = await api.post(`/users/bookmarks/${eventId}`)
    return response.data
  },

  async removeBookmark(eventId) {
    const response = await api.delete(`/users/bookmarks/${eventId}`)
    return response.data
  },

  async checkBookmark(eventId) {
    const response = await api.get(`/users/bookmarks/${eventId}/check`)
    return response.data
  },

  async getTrendingEvents(params = {}) {
    const cacheKey = getCacheKey('/events/trending', params)
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      console.log('Using cached trending events data')
      return cachedData
    }
    
    const response = await api.get('/events/trending', { params })
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getUpcomingEvents(params = {}) {
    const cacheKey = getCacheKey('/events/upcoming', params)
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      console.log('Using cached upcoming events data')
      return cachedData
    }
    
    const response = await api.get('/events/upcoming', { params })
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getEventsByType(type, params = {}) {
    const cacheKey = getCacheKey(`/events/type/${type}`, params)
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      console.log(`Using cached ${type} events data`)
      return cachedData
    }
    
    const response = await api.get(`/events/type/${type}`, { params })
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async searchEvents(params = {}) {
    const response = await api.get('/events/search', { params })
    return response.data
  },

  async getEventStats() {
    const response = await api.get('/events/stats')
    return response.data
  }
} 