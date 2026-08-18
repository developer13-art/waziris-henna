import React from 'react'

function BookingDetails({ booking, onStatusChange }) {
  if (!booking) return null

  const statuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected']

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Booking Reference</p>
          <p className="font-mono font-semibold">{booking.booking_reference}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Customer Name</p>
          <p className="font-semibold">{booking.customer_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold">{booking.customer_phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{booking.customer_email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Service</p>
          <p className="font-semibold">{booking.service_name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Design</p>
          <p className="font-semibold">{booking.design_title || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Event Date</p>
          <p className="font-semibold">{booking.event_date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Event Time</p>
          <p className="font-semibold">{booking.event_time || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Number of People</p>
          <p className="font-semibold">{booking.number_of_people}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-semibold">₦{parseFloat(booking.total_amount).toLocaleString()}</p>
        </div>
      </div>

      {booking.additional_notes && (
        <div>
          <p className="text-sm text-gray-500">Additional Notes</p>
          <p className="text-sm">{booking.additional_notes}</p>
        </div>
      )}

      {onStatusChange && (
        <div className="border-t pt-4">
          <p className="font-semibold mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(booking.id, status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  booking.booking_status === status
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingDetails