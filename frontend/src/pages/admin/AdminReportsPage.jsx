import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState('overview')
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReport(activeReport)
  }, [activeReport])

  const fetchReport = async (reportType) => {
    setIsLoading(true)
    try {
      let response
      switch (reportType) {
        case 'overview':
          response = await api.get(endpoints.dashboardStats)
          break
        case 'bookings':
          response = await api.get(endpoints.bookingReport)
          break
        case 'sales':
          response = await api.get(endpoints.salesReport)
          break
        case 'products':
          response = await api.get(endpoints.productReport)
          break
        case 'customers':
          response = await api.get(endpoints.customerReport)
          break
        default:
          response = await api.get(endpoints.dashboardStats)
      }
      setReportData(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
      toast.error('Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'bookings', label: 'Bookings', icon: 'fa-calendar-check' },
    { id: 'sales', label: 'Sales', icon: 'fa-money-bill-wave' },
    { id: 'products', label: 'Products', icon: 'fa-box' },
    { id: 'customers', label: 'Customers', icon: 'fa-users' },
  ]

  return (
    <>
      <Helmet>
        <title>Reports | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reports & Analytics</h2>
        <p className="text-gray-500">View business performance and insights</p>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeReport === tab.id
                ? 'bg-[#8B5E3C] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className={`fas ${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <motion.div
          key={activeReport}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Report */}
          {activeReport === 'overview' && reportData && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-3xl font-bold">{reportData.total_bookings}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold">{reportData.total_orders}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-3xl font-bold">{reportData.total_customers}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-[#8B5E3C]">
                  ₦{parseFloat(reportData.total_revenue).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Products Sold</p>
                <p className="text-3xl font-bold">{reportData.total_products_sold}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold text-[#D4AF37]">
                  {reportData.average_rating?.toFixed(1)} ★
                </p>
              </div>
            </div>
          )}

          {/* Products Report */}
          {activeReport === 'products' && Array.isArray(reportData) && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Sold</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="px-4 py-3 font-semibold">{product.name}</td>
                        <td className="px-4 py-3">₦{parseFloat(product.price).toLocaleString()}</td>
                        <td className="px-4 py-3">{product.stock_quantity}</td>
                        <td className="px-4 py-3">{product.total_sold}</td>
                        <td className="px-4 py-3 font-semibold">₦{parseFloat(product.total_revenue).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Report */}
          {activeReport === 'customers' && Array.isArray(reportData) && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bookings</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((customer) => (
                      <tr key={customer.id} className="border-t">
                        <td className="px-4 py-3 font-semibold">{customer.full_name}</td>
                        <td className="px-4 py-3">{customer.email}</td>
                        <td className="px-4 py-3">{customer.total_bookings}</td>
                        <td className="px-4 py-3">{customer.total_orders}</td>
                        <td className="px-4 py-3 font-semibold">₦{parseFloat(customer.total_spent).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  )
}

export default AdminReportsPage