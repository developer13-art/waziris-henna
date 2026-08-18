import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, bookingsRes, ordersRes] = await Promise.all([
        api.get(endpoints.dashboardStats),
        api.get(endpoints.recentBookings),
        api.get(endpoints.recentOrders),
      ])
      setStats(statsRes.data)
      setRecentBookings(bookingsRes.data || [])
      setRecentOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) return <Loader />

  const statCards = [
    { label: 'Total Bookings', value: stats.total_bookings, icon: 'fa-calendar-check', color: 'bg-blue-500' },
    { label: 'Pending Bookings', value: stats.pending_bookings, icon: 'fa-clock', color: 'bg-yellow-500' },
    { label: 'Total Orders', value: stats.total_orders, icon: 'fa-shopping-cart', color: 'bg-green-500' },
    { label: 'Total Revenue', value: `₦${parseFloat(stats.total_revenue).toLocaleString()}`, icon: 'fa-money-bill-wave', color: 'bg-purple-500' },
    { label: 'Total Customers', value: stats.total_customers, icon: 'fa-users', color: 'bg-pink-500' },
    { label: 'Low Stock Products', value: stats.low_stock_products, icon: 'fa-exclamation-triangle', color: 'bg-red-500' },
    { label: 'Pending Reviews', value: stats.pending_reviews, icon: 'fa-star', color: 'bg-orange-500' },
    { label: 'Total Designs', value: stats.total_designs, icon: 'fa-palette', color: 'bg-indigo-500' },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Waziri's Henna</title>
      </Helmet>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings & Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-sm text-[#8B5E3C] hover:text-[#D4AF37] transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">No bookings yet</td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">{booking.booking_reference}</td>
                      <td className="px-4 py-3 text-sm">{booking.customer_name}</td>
                      <td className="px-4 py-3 text-sm">{booking.event_date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.booking_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.booking_status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          booking.booking_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.booking_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-[#8B5E3C] hover:text-[#D4AF37] transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">{order.order_reference}</td>
                      <td className="px-4 py-3 text-sm">{order.customer_name}</td>
                      <td className="px-4 py-3 text-sm">₦{parseFloat(order.total_amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.order_status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.order_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage