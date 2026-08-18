import React from 'react'
import { NavLink } from 'react-router-dom'
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

function AdminSidebar({ isOpen, onClose }) {
  const { logout } = useAuth()

  return (
    <aside className={`w-64 bg-[#222] text-white flex-shrink-0 fixed lg:static inset-y-0 left-0 z-50 overflow-y-auto transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
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
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#D4AF37] text-[#222]' : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar