import api from './api'

export const getRecommendations = async () => {
  const res = await api.get('/users/assistant/recommendations')
  return res.data
}

export const updateUserProfile = async (userId, { interests, skills, projects }) => {
  const res = await api.post(`/users/${userId}/interests`, { interests, skills, projects })
  return res.data.data
} 