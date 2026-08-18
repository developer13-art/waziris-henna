import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [recentBookings, setRecentBookings] = useState([])  // Initialize as empty array
  const [recentOrders, setRecentOrders] = useState([])      // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch each endpoint separately to handle errors better
      const statsRes = await api.get(endpoints.dashboardStats)
      const bookingsRes = await api.get(endpoints.recentBookings)
      const ordersRes = await api.get(endpoints.recentOrders)

      // Handle stats
      if (statsRes && statsRes.data) {
        setStats(statsRes.data)
      } else {
        setStats({})
      }

      // Handle recent bookings - ensure it's an array
      const bookingsData = bookingsRes?.data || bookingsRes || []
      setRecentBookings(Array.isArray(bookingsData) ? bookingsData : [])

      // Handle recent orders - ensure it's an array
      const ordersData = ordersRes?.data || ordersRes || []
      setRecentOrders(Array.isArray(ordersData) ? ordersData : [])

    } catch (error) {
      console.error('Error fetching dashboard:', error)
      // Set defaults on error
      setStats({})
      setRecentBookings([])
      setRecentOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const sidebarLinks = [
    { to: '/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
    { to: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check' },
    { to: '/admin/customers', label: 'Customers', icon: 'fa-users' },
    { to: '/admin/designs', label: 'Designs', icon: 'fa-palette' },
    { to: '/admin/services', label: 'Services', icon: 'fa-crown' },
    { to: '/admin/products', label: 'Products', icon: 'fa-box' },
    { to: '/admin/orders', label: 'Orders', icon: 'fa-shopping-cart' },
    { to: '/admin/payments', label: 'Payments', icon: 'fa-credit-card' },
    { to: '/admin/reviews', label: 'Reviews', icon: 'fa-star' },
    { to: '/admin/journal', label: 'Journal', icon: 'fa-book' },
    { to: '/admin/reports', label: 'Reports', icon: 'fa-chart-bar' },
    { to: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
  ]

  // Safe stat cards
  const statCards = [
    { label: 'Total Bookings', value: stats?.total_bookings || 0, icon: 'fa-calendar-check', color: '#3b82f6' },
    { label: 'Pending Bookings', value: stats?.pending_bookings || 0, icon: 'fa-clock', color: '#f59e0b' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: 'fa-shopping-cart', color: '#10b981' },
    { label: 'Total Revenue', value: `₦${parseFloat(stats?.total_revenue || 0).toLocaleString()}`, icon: 'fa-money-bill', color: '#8b5cf6' },
    { label: 'Total Customers', value: stats?.total_customers || 0, icon: 'fa-users', color: '#ec4899' },
    { label: 'Total Designs', value: stats?.total_designs || 0, icon: 'fa-palette', color: '#6366f1' },
    { label: 'Low Stock', value: stats?.low_stock_products || 0, icon: 'fa-exclamation-triangle', color: '#ef4444' },
    { label: 'Pending Reviews', value: stats?.pending_reviews || 0, icon: 'fa-star', color: '#f97316' },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Waziri's Henna</title>
      </Helmet>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, sans-serif' }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? '250px' : '0',
          background: '#222',
          color: '#fff',
          minHeight: '100vh',
          transition: 'width 0.3s',
          overflow: 'hidden',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff' }}>
              Waziri<span style={{ color: '#D4AF37' }}>'s</span> Admin
            </h2>
          </div>
          <nav style={{ padding: '16px' }}>
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#ccc',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                <i className={`fas ${link.icon}`} style={{ width: '20px' }}></i>
                {link.label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: '#ccc',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
          {/* Top Bar */}
          <header style={{
            background: '#fff',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}
              >
                <i className="fas fa-bars"></i>
              </button>
              <h1 style={{ fontSize: '18px', fontWeight: '600' }}>Dashboard</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Welcome, <strong style={{ color: '#8B5E3C' }}>{user?.full_name || 'Admin'}</strong>
              </span>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#8B5E3C',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
          </header>

          {/* Content */}
          <main style={{ padding: '24px' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ color: '#8B5E3C', fontSize: '18px' }}>Loading dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {statCards.map((stat, index) => (
                    <div key={index} style={{
                      background: '#fff',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: stat.color,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '20px',
                        marginBottom: '12px'
                      }}>
                        <i className={`fas ${stat.icon}`}></i>
                      </div>
                      <p style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</p>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings & Orders */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Recent Bookings */}
                  <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{ fontWeight: '600' }}>Recent Bookings</h3>
                      <Link to="/admin/bookings" style={{ fontSize: '14px', color: '#8B5E3C', textDecoration: 'none' }}>
                        View All
                      </Link>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Reference</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Customer</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.length === 0 ? (
                            <tr>
                              <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                                No bookings yet
                              </td>
                            </tr>
                          ) : (
                            recentBookings.map((booking) => (
                              <tr key={booking.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace' }}>
                                  {booking.booking_reference}
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{booking.customer_name}</td>
                                <td style={{ padding: '12px 16px' }}>
                                  <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '50px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: booking.booking_status === 'Pending' ? '#fef3c7' : '#d1fae5',
                                    color: booking.booking_status === 'Pending' ? '#92400e' : '#065f46'
                                  }}>
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
                  <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{ fontWeight: '600' }}>Recent Orders</h3>
                      <Link to="/admin/orders" style={{ fontSize: '14px', color: '#8B5E3C', textDecoration: 'none' }}>
                        View All
                      </Link>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Reference</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Customer</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.length === 0 ? (
                            <tr>
                              <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                                No orders yet
                              </td>
                            </tr>
                          ) : (
                            recentOrders.map((order) => (
                              <tr key={order.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace' }}>
                                  {order.order_reference}
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{order.customer_name}</td>
                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600' }}>
                                  ₦{parseFloat(order.total_amount || 0).toLocaleString()}
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
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage