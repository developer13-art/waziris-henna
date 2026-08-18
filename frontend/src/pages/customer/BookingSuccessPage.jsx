import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

function BookingSuccessPage() {
  const { reference } = useParams()

  return (
    <>
      <Helmet>
        <title>Booking Successful | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check-circle text-5xl text-green-500"></i>
          </div>
          <h1 className="font-playfair text-3xl font-bold mb-4">Booking Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been received. We will contact you shortly to confirm your appointment.
          </p>
          {reference && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="font-mono font-bold text-lg">{reference}</p>
            </div>
          )}
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/designs"
              className="block w-full py-3 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors"
            >
              Browse More Designs
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default BookingSuccessPage