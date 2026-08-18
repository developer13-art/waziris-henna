import React from 'react'
import { Link } from 'react-router-dom'

function DesignFinderCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#8B5E3C] to-[#6B4423]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-4">
          Not Sure Which Design to Choose?
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Use our Design Finder to get personalized recommendations based on your preferences.
        </p>
        <Link
          to="/design-finder"
          className="inline-flex items-center gap-3 px-10 py-4 bg-[#D4AF37] text-[#222] font-bold rounded-full hover:bg-white transition-all duration-200 text-lg"
        >
          <i className="fas fa-magic"></i> Find Your Perfect Design
        </Link>
      </div>
    </section>
  )
}

export default DesignFinderCTA