import React from 'react'
import OrderStatusBadge from './OrderStatusBadge'

function OrdersList({ orders, onView }) {
  if (orders.length === 0) {
    return <div className="text-center py-10 text-gray-500">No orders found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono">{order.order_reference}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-sm">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.customer_phone}</p>
              </td>
              <td className="px-4 py-3 font-semibold text-sm">₦{parseFloat(order.total_amount).toLocaleString()}</td>
              <td className="px-4 py-3"><OrderStatusBadge status={order.order_status} /></td>
              <td className="px-4 py-3">
                <button onClick={() => onView(order.id)} className="px-3 py-1.5 bg-[#8B5E3C] text-white text-xs rounded-lg">
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

export default OrdersList