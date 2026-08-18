import React from 'react'
import { motion } from 'framer-motion'

function StatsCards({ stats }) {
  if (!stats) return null

  const cards = [
    { label: 'Total Bookings', value: stats.total_bookings, icon: 'fa-calendar-check', color: 'bg-blue-500' },
    { label: 'Pending Bookings', value: stats.pending_bookings, icon: 'fa-clock', color: 'bg-yellow-500' },
    { label: 'Total Orders', value: stats.total_orders, icon: 'fa-shopping-cart', color: 'bg-green-500' },
    { label: 'Total Revenue', value: `₦${parseFloat(stats.total_revenue).toLocaleString()}`, icon: 'fa-money-bill', color: 'bg-purple-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm">
          <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
            <i className={`fas ${card.icon}`}></i>
          </div>
          <p className="text-2xl font-bold">{card.value}</p>
          <p className="text-sm text-gray-500">{card.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCards