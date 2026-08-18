import React from 'react'

function CustomerDetails({ customer, bookings = [], orders = [] }) {
  if (!customer) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {customer.full_name?.charAt(0) || 'C'}
        </div>
        <div>
          <h4 className="font-semibold text-lg">{customer.full_name}</h4>
          <p className="text-gray-500">{customer.email}</p>
          <p className="text-gray-500">{customer.phone || 'No phone'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-sm text-gray-500">Bookings</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{customer.total_orders || 0}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>

      {bookings.length > 0 && (
        <div>
          <h5 className="font-semibold mb-3">Booking History</h5>
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-mono">{booking.booking_reference}</p>
                  <p className="text-xs text-gray-500">{booking.service_name} • {booking.event_date}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">{booking.booking_status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDetails