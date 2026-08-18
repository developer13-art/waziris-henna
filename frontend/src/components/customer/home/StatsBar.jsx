import React from 'react'
import { motion } from 'framer-motion'

const stats = [
  { icon: 'fa-heart', value: '500+', label: 'Happy Clients' },
  { icon: 'fa-store', value: '15+', label: 'Premium Products' },
  { icon: 'fa-leaf', value: '100%', label: 'Natural Henna' },
  { icon: 'fa-star', value: '5.0', label: 'Customer Rating' },
]

function StatsBar() {
  return (
    <section className="bg-white border-y border-[#e8ddd4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <i className={`fas ${stat.icon} text-3xl text-[#D4AF37] mb-3`}></i>
              <p className="font-playfair text-3xl font-bold text-[#8B5E3C]">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar