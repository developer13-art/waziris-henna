import React from 'react'
import { useAuth } from '../../../context/AuthContext'

function AdminHeader({ onToggleSidebar }) {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-gray-600 hover:text-[#8B5E3C] lg:hidden">
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
  )
}

export default AdminHeader