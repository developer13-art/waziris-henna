import React from 'react'
import { Link } from 'react-router-dom'

function ContactCTA() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mb-4">
          Ready to Get Your Perfect Henna Design?
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Contact us today for bookings, orders, or any questions. We respond within minutes!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-all">
            <i className="fas fa-calendar-check"></i> Book Now
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white transition-all">
            <i className="fas fa-envelope"></i> Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ContactCTA