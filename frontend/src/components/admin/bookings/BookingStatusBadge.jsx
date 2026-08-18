import React from 'react'

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Confirmed': 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-purple-100 text-purple-700',
  'Cancelled': 'bg-red-100 text-red-700',
  'Rejected': 'bg-gray-100 text-gray-700',
}

function BookingStatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default BookingStatusBadge