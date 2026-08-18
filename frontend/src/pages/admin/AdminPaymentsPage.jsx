import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

const paymentStatusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Successful': 'bg-green-100 text-green-700',
  'Failed': 'bg-red-100 text-red-700',
  'Cancelled': 'bg-gray-100 text-gray-700',
  'Refunded': 'bg-purple-100 text-purple-700',
}

function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchPayments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (statusFilter) params.status = statusFilter

      const response = await api.get(endpoints.payments, { params })
      setPayments(response.data || [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to load payments')
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const openPaymentDetails = async (paymentId) => {
    try {
      const response = await api.get(endpoints.paymentDetail(paymentId))
      setSelectedPayment(response.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching payment details:', error)
      toast.error('Failed to load payment details')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Payments | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Payments Management</h2>
        <p className="text-gray-500">Monitor all transactions and payments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono">{payment.payment_reference}</td>
                      <td className="px-4 py-3 font-semibold text-sm">
                        ₦{parseFloat(payment.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {payment.booking_reference ? 'Booking' : payment.order_reference ? 'Order' : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">{payment.payment_method}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[payment.payment_status]}`}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openPaymentDetails(payment.id)}
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

      {/* Payment Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && (
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
              className="bg-white rounded-3xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-playfair text-xl font-semibold">Payment Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reference</p>
                    <p className="font-mono font-semibold text-sm">{selectedPayment.payment_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-bold text-[#8B5E3C]">₦{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[selectedPayment.payment_status]}`}>
                      {selectedPayment.payment_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="font-semibold">{selectedPayment.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="font-semibold">{selectedPayment.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-sm">
                      {new Date(selectedPayment.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedPayment.paystack_reference && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Paystack Reference</p>
                      <p className="font-mono font-semibold text-sm">{selectedPayment.paystack_reference}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminPaymentsPage