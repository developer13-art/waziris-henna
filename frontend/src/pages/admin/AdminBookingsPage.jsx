import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Confirmed': 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-purple-100 text-purple-700',
  'Cancelled': 'bg-red-100 text-red-700',
  'Rejected': 'bg-gray-100 text-gray-700',
}

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchBookings = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (statusFilter) params.status = statusFilter
      if (search) params.search = search

      const response = await api.get(endpoints.bookings, { params })
      setBookings(response.data || [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(endpoints.bookingStatus(bookingId), { booking_status: newStatus })
      toast.success('Booking status updated successfully')
      fetchBookings()
      setSelectedBooking(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Failed to update booking status')
    }
  }

  const openBookingDetails = async (bookingId) => {
    try {
      const response = await api.get(endpoints.bookingDetail(bookingId))
      setSelectedBooking(response.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      toast.error('Failed to load booking details')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Bookings | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Bookings Management</h2>
        <p className="text-gray-500">View and manage all henna service bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name, reference, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 min-w-[200px] px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">People</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Booking Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono">{booking.booking_reference}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm">{booking.customer_name}</p>
                        <p className="text-xs text-gray-500">{booking.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">{booking.service_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{booking.event_date}</td>
                      <td className="px-4 py-3 text-sm">{booking.number_of_people}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[booking.booking_status]}`}>
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.payment_status === 'Successful' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openBookingDetails(booking.id)}
                          className="px-3 py-1.5 bg-[#8B5E3C] text-white text-xs font-semibold rounded-lg hover:bg-[#6B4423] transition-colors"
                        >
                          <i className="fas fa-eye mr-1"></i> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 bg-white border-2 border-[#e8ddd4] rounded-full flex items-center justify-center text-[#8B5E3C] hover:border-[#D4AF37] disabled:opacity-50 transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 bg-white border-2 border-[#e8ddd4] rounded-full flex items-center justify-center text-[#8B5E3C] hover:border-[#D4AF37] disabled:opacity-50 transition-colors"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Booking Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-playfair text-xl font-semibold">Booking Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking Reference</p>
                    <p className="font-mono font-semibold">{selectedBooking.booking_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-semibold">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedBooking.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{selectedBooking.customer_email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold">{selectedBooking.service_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Design</p>
                    <p className="font-semibold">{selectedBooking.design_title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-semibold">{selectedBooking.event_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Time</p>
                    <p className="font-semibold">{selectedBooking.event_time || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of People</p>
                    <p className="font-semibold">{selectedBooking.number_of_people}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-semibold">₦{parseFloat(selectedBooking.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                {selectedBooking.additional_notes && (
                  <div>
                    <p className="text-sm text-gray-500">Additional Notes</p>
                    <p className="text-sm">{selectedBooking.additional_notes}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="font-semibold mb-3">Update Booking Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedBooking.id, status)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                          selectedBooking.booking_status === status
                            ? 'bg-[#8B5E3C] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminBookingsPage;