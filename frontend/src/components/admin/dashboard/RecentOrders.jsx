import React from 'react'
import { Link } from 'react-router-dom'

function RecentOrders({ orders = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h3 className="font-semibold">Recent Orders</h3>
        <Link to="/admin/orders" className="text-sm text-[#8B5E3C]">View All</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Ref</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="3" className="px-4 py-6 text-center text-gray-500">No orders</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2 text-xs font-mono">{order.order_reference}</td>
                  <td className="px-4 py-2 text-sm">{order.customer_name}</td>
                  <td className="px-4 py-2 text-sm font-semibold">₦{parseFloat(order.total_amount).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentOrders