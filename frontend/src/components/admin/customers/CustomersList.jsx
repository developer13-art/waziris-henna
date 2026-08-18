import React from 'react'

function CustomersList({ customers, onView }) {
  if (customers.length === 0) {
    return <div className="text-center py-10 text-gray-500">No customers found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bookings</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {customer.full_name?.charAt(0) || 'C'}
                  </div>
                  <span className="font-semibold text-sm">{customer.full_name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{customer.email}</td>
              <td className="px-4 py-3 text-sm">{customer.phone || 'N/A'}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {customer.total_bookings || 0}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {customer.total_orders || 0}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onView(customer.id)}
                  className="px-3 py-1.5 bg-[#8B5E3C] text-white text-xs font-semibold rounded-lg hover:bg-[#6B4423]"
                >
                  <i className="fas fa-eye mr-1"></i> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomersList