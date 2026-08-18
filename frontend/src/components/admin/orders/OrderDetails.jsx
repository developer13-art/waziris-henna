import React from 'react'

function OrderDetails({ order, onStatusChange }) {
  if (!order) return null

  const statuses = ['Pending', 'Paid', 'Processing', 'Ready', 'Delivered', 'Completed', 'Cancelled']

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Order Reference</p>
          <p className="font-mono font-semibold">{order.order_reference}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-semibold">{order.customer_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Delivery Method</p>
          <p className="font-semibold">{order.delivery_method}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-bold text-[#8B5E3C]">₦{parseFloat(order.total_amount).toLocaleString()}</p>
        </div>
      </div>

      {order.items?.length > 0 && (
        <div>
          <h5 className="font-semibold mb-3">Order Items</h5>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.product_name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} × ₦{parseFloat(item.unit_price).toLocaleString()}</p>
                </div>
                <span className="font-semibold text-sm">₦{parseFloat(item.subtotal).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {onStatusChange && (
        <div className="border-t pt-4">
          <p className="font-semibold mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button key={status} onClick={() => onStatusChange(order.id, status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  order.order_status === status ? 'bg-[#8B5E3C] text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails