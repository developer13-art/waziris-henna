import React from 'react'

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Successful': 'bg-green-100 text-green-700',
  'Failed': 'bg-red-100 text-red-700',
  'Cancelled': 'bg-gray-100 text-gray-700',
  'Refunded': 'bg-purple-100 text-purple-700',
}

function PaymentStatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default PaymentStatusBadge