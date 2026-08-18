import React from 'react'
import { Link } from 'react-router-dom'

function BookingSuccess({ reference }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fas fa-check-circle text-4xl text-green-500"></i>
      </div>
      <h3 className="font-playfair text-2xl font-bold mb-3">Booking Successful!</h3>
      <p className="text-gray-600 mb-6">We will contact you shortly to confirm your booking.</p>
      {reference && (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 inline-block">
          <p className="text-sm text-gray-500">Reference</p>
          <p className="font-mono font-bold">{reference}</p>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        <Link to="/" className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-semibold">Home</Link>
        <Link to="/designs" className="px-6 py-3 border-2 border-[#D4AF37] text-[#8B5E3C] rounded-full font-semibold">Browse Designs</Link>
      </div>
    </div>
  )
}

export default BookingSuccess