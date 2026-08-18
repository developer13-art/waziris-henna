import api, { endpoints } from './api'

export const authService = {
  async login(email, password) {
    return await api.post(endpoints.login, { email, password })
  },

  async register(userData) {
    return await api.post(endpoints.register, userData)
  },

  async logout() {
    return await api.post(endpoints.logout)
  },

  async getProfile(userId) {
    return await api.get(`${endpoints.login}/profile?user_id=${userId}`)
  },

  isAuthenticated() {
    return !!localStorage.getItem('waziris_token')
  },

  getUser() {
    const user = localStorage.getItem('waziris_user')
    return user ? JSON.parse(user) : null
  },

  isAdmin() {
    const user = this.getUser()
    return user?.role === 'admin'
  },
}