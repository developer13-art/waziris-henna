import React from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../common/Modal'
import { useFavorites } from '../../../context/FavoritesContext'

function DesignDetailModal({ design, isOpen, onClose }) {
  const { toggleFavorite, isFavorite } = useFavorites()

  if (!design) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={design.image_url} alt={design.title} className="rounded-2xl w-full h-72 object-cover" />
        <div className="space-y-4">
          <div>
            <h3 className="font-playfair text-2xl font-bold">{design.title}</h3>
            <p className="text-gray-500 text-sm">{design.style} • {design.occasion}</p>
          </div>
          <p className="text-gray-600">{design.description}</p>
          <div className="flex flex-wrap gap-2">
            {design.complexity && <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">{design.complexity}</span>}
            {design.body_area && <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">{design.body_area}</span>}
          </div>
          <div className="flex gap-3 pt-4">
            <Link to={`/designs/${design.slug}`} className="flex-1 py-3 bg-[#D4AF37] text-white text-center font-semibold rounded-full hover:bg-[#b8941f]">
              View Full Details
            </Link>
            <button onClick={() => toggleFavorite(design)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isFavorite(design.id) ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
              <i className={`${isFavorite(design.id) ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DesignDetailModal