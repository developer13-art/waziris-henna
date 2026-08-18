import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '../../../context/FavoritesContext'

function FavoritesDrawer({ isOpen, onClose }) {
  const { designs, toggleFavorite } = useFavorites()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-white z-50 overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-playfair text-xl font-semibold">Saved Designs</h3>
              <button onClick={onClose} className="text-2xl text-gray-500">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {designs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No saved designs</p>
              ) : (
                designs.map((design) => (
                  <div key={design.id} className="flex items-center gap-3">
                    <img src={design.image_url} alt={design.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <Link to={`/designs/${design.slug}`} className="font-semibold text-sm hover:text-[#8B5E3C]">
                        {design.title}
                      </Link>
                    </div>
                    <button onClick={() => toggleFavorite(design)} className="text-red-500">
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FavoritesDrawer