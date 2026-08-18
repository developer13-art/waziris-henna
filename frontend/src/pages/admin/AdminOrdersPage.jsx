import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

const orderStatusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Paid': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-indigo-100 text-indigo-700',
  'Ready': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-cyan-100 text-cyan-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (statusFilter) params.status = statusFilter
      if (search) params.search = search

      const response = await api.get(endpoints.orders, { params })
      setOrders(response.data || [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const openOrderDetails = async (orderId) => {
    try {
      const response = await api.get(endpoints.orderDetail(orderId))
      setSelectedOrder(response.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.post(endpoints.orderStatus(orderId), { order_status: newStatus })
      toast.success('Order status updated successfully')
      fetchOrders()
      setSelectedOrder(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Orders | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Orders Management</h2>
        <p className="text-gray-500">Track and manage product orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or reference..."
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
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Delivery</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono">{order.order_reference}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">{order.items_count || 'N/A'}</td>
                      <td className="px-4 py-3 font-semibold text-sm">
                        ₦{parseFloat(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{order.delivery_method}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${orderStatusColors[order.order_status]}`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'Successful' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openOrderDetails(order.id)}
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

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
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
                <h3 className="font-playfair text-xl font-semibold">Order Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Reference</p>
                    <p className="font-mono font-semibold">{selectedOrder.order_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Method</p>
                    <p className="font-semibold">{selectedOrder.delivery_method}</p>
                  </div>
                  {selectedOrder.delivery_address && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-semibold">{selectedOrder.delivery_address}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h5 className="font-semibold mb-3">Order Items</h5>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × ₦{parseFloat(item.unit_price).toLocaleString()}
                          </p>
                        </div>
                        <span className="font-semibold text-sm">
                          ₦{parseFloat(item.subtotal).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₦{parseFloat(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">₦{parseFloat(selectedOrder.delivery_fee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#8B5E3C]">₦{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-semibold mb-3">Update Order Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Paid', 'Processing', 'Ready', 'Delivered', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                          selectedOrder.order_status === status
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

export default AdminOrdersPage