import React from 'react'
import { Link } from 'react-router-dom'

function RecentBookings({ bookings = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h3 className="font-semibold">Recent Bookings</h3>
        <Link to="/admin/bookings" className="text-sm text-[#8B5E3C]">View All</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Ref</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="3" className="px-4 py-6 text-center text-gray-500">No bookings</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="px-4 py-2 text-xs font-mono">{booking.booking_reference}</td>
                  <td className="px-4 py-2 text-sm">{booking.customer_name}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">{booking.booking_status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentBookings