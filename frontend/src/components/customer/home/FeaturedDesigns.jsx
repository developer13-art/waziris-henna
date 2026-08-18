import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../../../context/FavoritesContext'

function FeaturedDesigns({ designs }) {
  const { toggleFavorite, isFavorite } = useFavorites()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="section-tag">Portfolio</span>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">Featured Designs</h2>
          </div>
          <Link to="/designs" className="inline-flex items-center gap-2 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <Link to={`/designs/${design.slug}`}>
                <img src={design.image_url} alt={design.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <button
                onClick={() => toggleFavorite(design)}
                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform"
              >
                <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDesigns