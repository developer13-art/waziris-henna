import React from 'react'
import { Link } from 'react-router-dom'

function QuickActions() {
  const actions = [
    { to: '/admin/bookings', label: 'View Bookings', icon: 'fa-calendar-check', color: 'bg-blue-500' },
    { to: '/admin/designs', label: 'Add Design', icon: 'fa-palette', color: 'bg-purple-500' },
    { to: '/admin/products', label: 'Add Product', icon: 'fa-box', color: 'bg-green-500' },
    { to: '/admin/journal', label: 'Write Article', icon: 'fa-book', color: 'bg-orange-500' },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link key={index} to={action.to}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
              <i className={`fas ${action.icon}`}></i>
            </div>
            <span className="text-sm font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickActions