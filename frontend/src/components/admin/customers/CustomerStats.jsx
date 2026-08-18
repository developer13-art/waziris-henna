import React from 'react'

function CustomerStats({ stats }) {
  if (!stats) return null

  const cards = [
    { label: 'Total Customers', value: stats.total_customers, icon: 'fa-users', color: 'bg-blue-500' },
    { label: 'New This Month', value: stats.new_customers || 0, icon: 'fa-user-plus', color: 'bg-green-500' },
    { label: 'Active Customers', value: stats.active_customers || 0, icon: 'fa-user-check', color: 'bg-purple-500' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
            <i className={`fas ${card.icon}`}></i>
          </div>
          <p className="text-2xl font-bold">{card.value}</p>
          <p className="text-sm text-gray-500">{card.label}</p>
        </div>
      ))}
    </div>
  )
}

export default CustomerStats