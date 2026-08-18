import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (search) params.search = search

      const response = await api.get(endpoints.customers, { params })
      setCustomers(response.data || [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to load customers')
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const openCustomerDetails = async (customerId) => {
    try {
      const [customerRes, bookingsRes, ordersRes] = await Promise.all([
        api.get(endpoints.customerDetail(customerId)),
        api.get(endpoints.customerBookings(customerId)),
        api.get(endpoints.customerOrders(customerId)),
      ])
      setSelectedCustomer({
        ...customerRes.data,
        bookings: bookingsRes.data || [],
        orders: ordersRes.data || [],
      })
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching customer details:', error)
      toast.error('Failed to load customer details')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Customers | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Customers Management</h2>
        <p className="text-gray-500">View and manage your customer base</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {customer.full_name?.charAt(0) || 'C'}
                          </div>
                          <span className="font-semibold text-sm">{customer.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{customer.email}</td>
                      <td className="px-4 py-3 text-sm">{customer.phone || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {customer.total_bookings || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {customer.total_orders || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openCustomerDetails(customer.id)}
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

      {/* Customer Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCustomer && (
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
                <h3 className="font-playfair text-xl font-semibold">Customer Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {selectedCustomer.full_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{selectedCustomer.full_name}</h4>
                    <p className="text-gray-500">{selectedCustomer.email}</p>
                    <p className="text-gray-500">{selectedCustomer.phone || 'No phone'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{selectedCustomer.total_bookings || 0}</p>
                    <p className="text-sm text-gray-500">Bookings</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{selectedCustomer.total_orders || 0}</p>
                    <p className="text-sm text-gray-500">Orders</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">
                      ₦{parseFloat(selectedCustomer.total_booking_spend + selectedCustomer.total_order_spend).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                </div>

                {selectedCustomer.bookings?.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-3">Booking History</h5>
                    <div className="space-y-2">
                      {selectedCustomer.bookings.map(booking => (
                        <div key={booking.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <p className="text-sm font-mono">{booking.booking_reference}</p>
                            <p className="text-xs text-gray-500">{booking.service_name} • {booking.event_date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.booking_status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.booking_status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminCustomersPage