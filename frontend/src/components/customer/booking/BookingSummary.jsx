import React from 'react'

function BookingSummary({ booking }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
      <h3 className="font-semibold mb-2">Booking Summary</h3>
      <div className="flex justify-between">
        <span className="text-gray-600">Service</span>
        <span className="font-semibold">{booking.service_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Date</span>
        <span className="font-semibold">{booking.event_date}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">People</span>
        <span className="font-semibold">{booking.number_of_people}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Total</span>
        <span className="font-bold text-[#8B5E3C]">₦{parseFloat(booking.total_amount).toLocaleString()}</span>
      </div>
    </div>
  )
}

export default BookingSummary