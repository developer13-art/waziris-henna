import React from 'react'
import { Link } from 'react-router-dom'

function AdminBreadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Link to="/admin" className="hover:text-[#8B5E3C] transition-colors">
        <i className="fas fa-home mr-1"></i> Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-300">/</span>
          {item.link ? (
            <Link to={item.link} className="hover:text-[#8B5E3C] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default AdminBreadcrumb