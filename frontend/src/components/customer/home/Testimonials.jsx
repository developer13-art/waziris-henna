import React from 'react'
import { motion } from 'framer-motion'

function Testimonials({ reviews }) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-tag">Testimonials</span>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-7 rounded-2xl border border-[#e8ddd4] hover:shadow-xl transition-all"
            >
              <div className="text-[#D4AF37] mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-[#8B5E3C] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                  {review.customer_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.customer_name}</p>
                  <p className="text-xs text-gray-500">{review.review_type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials