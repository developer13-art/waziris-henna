import React from 'react'

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Paid': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-indigo-100 text-indigo-700',
  'Ready': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-cyan-100 text-cyan-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

function OrderStatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default OrderStatusBadge