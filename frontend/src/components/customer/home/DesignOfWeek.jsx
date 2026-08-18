import React from 'react'
import { Link } from 'react-router-dom'

function DesignOfWeek({ design }) {
  if (!design) return null

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#8B5E3C] to-[#6B4423] rounded-[30px] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="inline-block px-4 py-1.5 bg-[#D4AF37] text-[#222] font-semibold text-sm rounded-full mb-4">
                ⭐ Design of the Week
              </span>
              <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">{design.title}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {design.description?.substring(0, 150)}...
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {design.style && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{design.style}</span>}
                {design.occasion && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{design.occasion}</span>}
                {design.complexity && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{design.complexity}</span>}
              </div>
              <div className="flex gap-4">
                <Link to={`/designs/${design.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#222] font-semibold rounded-full hover:bg-white transition-all">
                  View Design
                </Link>
                <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#8B5E3C] transition-all">
                  Book This Design
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src={design.image_url} alt={design.title} className="rounded-2xl shadow-2xl w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DesignOfWeek