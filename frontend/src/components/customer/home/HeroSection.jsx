import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF1E6] to-[#FFF8F0] overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B5E3C]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-5 py-2 bg-[#D4AF37]/10 text-[#D4AF37] font-semibold text-sm uppercase tracking-wider rounded-full mb-6">
            ✨ Welcome to Waziri's Henna
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#222] leading-tight mb-6">
            Elegant <span className="text-[#8B5E3C]">Henna</span> Designs For Every Occasion
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
            Transform your special moments with beautiful, creative, and long-lasting henna designs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-all">
              <i className="fab fa-whatsapp"></i> Book Appointment
            </Link>
            <Link to="/design-finder" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white transition-all">
              <i className="fas fa-magic"></i> Find Your Design
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
          <img src="/images/hero-henna.jpg" alt="Beautiful henna design" className="rounded-[40px] shadow-2xl border-4 border-white max-w-md mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection