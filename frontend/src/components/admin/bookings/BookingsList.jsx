import React from 'react'
import BookingStatusBadge from './BookingStatusBadge'

function BookingsList({ bookings, onView }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No bookings found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono">{booking.booking_reference}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-sm">{booking.customer_name}</p>
                <p className="text-xs text-gray-500">{booking.customer_phone}</p>
              </td>
              <td className="px-4 py-3 text-sm">{booking.service_name || 'N/A'}</td>
              <td className="px-4 py-3 text-sm">{booking.event_date}</td>
              <td className="px-4 py-3">
                <BookingStatusBadge status={booking.booking_status} />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onView(booking.id)}
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

export default BookingsList