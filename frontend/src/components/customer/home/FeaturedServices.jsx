import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function FeaturedServices({ services }) {
  const serviceIcons = {
    'Bridal Henna': 'fa-crown',
    'Simple Henna': 'fa-hand-sparkles',
    'Traditional Henna': 'fa-landmark',
    'Arabic Designs': 'fa-moon',
    "Children's Henna": 'fa-child',
    'Event/Group Henna': 'fa-users',
    'Custom Designs': 'fa-paint-brush',
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-tag">Our Services</span>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">What We Offer</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-7 rounded-2xl border border-[#e8ddd4] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${serviceIcons[service.name] || 'fa-star'} text-2xl text-[#D4AF37]`}></i>
              </div>
              <h3 className="font-playfair text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.short_description || service.description}</p>
              <p className="text-[#8B5E3C] font-semibold text-sm">
                From ₦{parseFloat(service.starting_price).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors">
            View All Services <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedServices