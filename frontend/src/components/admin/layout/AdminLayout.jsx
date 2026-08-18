import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-chart-pie', end: true },
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

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 bg-[#222] text-white flex-shrink-0 fixed lg:static inset-y-0 left-0 z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="font-playfair text-xl font-bold">
                Waziri<span className="text-[#D4AF37]">'s</span> Admin
              </h2>
            </div>
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#222]'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className={`fas ${link.icon} w-5`}></i>
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
              >
                <i className="fas fa-sign-out-alt w-5"></i>
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-[#8B5E3C] transition-colors"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="font-semibold text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, <span className="font-semibold text-[#8B5E3C]">{user?.full_name}</span>
            </span>
            <div className="w-10 h-10 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-bold">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout