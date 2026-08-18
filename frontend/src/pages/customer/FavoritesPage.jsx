import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useFavorites } from '../../context/FavoritesContext'

function FavoritesPage() {
  const { designs, toggleFavorite, clearFavorites } = useFavorites()

  return (
    <>
      <Helmet>
        <title>Saved Designs | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">❤️ Favorites</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            My Saved Designs
          </h1>
          <p className="text-gray-600 mt-4">
            {designs.length} design{designs.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {designs.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-heart text-6xl text-gray-300 mb-6"></i>
              <h3 className="font-playfair text-2xl font-semibold text-gray-600 mb-2">
                No Saved Designs Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Browse our gallery and save designs you love
              </p>
              <Link
                to="/designs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
              >
                <i className="fas fa-images"></i> Browse Designs
              </Link>
            </div>
          ) : (
            <>
              {designs.length > 0 && (
                <div className="flex justify-end mb-6">
                  <button
                    onClick={clearFavorites}
                    className="text-red-500 font-semibold hover:text-red-700 transition-colors"
                  >
                    <i className="fas fa-trash-alt mr-2"></i> Clear All Favorites
                  </button>
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {designs.map((design) => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={`/designs/${design.slug}`}>
                        <img
                          src={design.image_url}
                          alt={design.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div className="text-white">
                            <h3 className="font-playfair font-semibold">{design.title}</h3>
                            <p className="text-sm text-gray-300">{design.style}</p>
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => toggleFavorite(design)}
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform z-10"
                        aria-label="Remove from favorites"
                      >
                        <i className="fas fa-heart text-red-500"></i>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default FavoritesPage