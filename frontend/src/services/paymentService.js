import api, { endpoints } from './api'

export const paymentService = {
  async initializePayment(paymentId, paymentData) {
    return await api.post(endpoints.initializePayment(paymentId), paymentData)
  },

  async verifyPayment(reference) {
    return await api.get(endpoints.verifyPayment(reference))
  },

  async getAllPayments(params = {}) {
    return await api.get(endpoints.payments, { params })
  },

  async getPayment(paymentId) {
    return await api.get(endpoints.paymentDetail(paymentId))
  },

  async createPayment(paymentData) {
    return await api.post(endpoints.payments, paymentData)
  },
}