import api from './api'

export const adminService = {
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  async getStats() {
    const response = await api.get('/admin/stats')
    return response.data
  },

  async updateUserRole(userId, role) {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  }
} 