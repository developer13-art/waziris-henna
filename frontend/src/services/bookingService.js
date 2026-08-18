import api, { endpoints } from './api'

export const bookingService = {
  async createBooking(bookingData) {
    return await api.post(endpoints.bookings, bookingData)
  },

  async getBooking(bookingId) {
    return await api.get(endpoints.bookingDetail(bookingId))
  },

  async getBookingStatus(bookingId) {
    return await api.get(endpoints.bookingStatus(bookingId))
  },

  async updateBookingStatus(bookingId, status) {
    return await api.put(endpoints.bookingStatus(bookingId), { booking_status: status })
  },

  async getAllBookings(params = {}) {
    return await api.get(endpoints.bookings, { params })
  },

  async cancelBooking(bookingId) {
    return await api.delete(endpoints.bookingDetail(bookingId))
  },
}