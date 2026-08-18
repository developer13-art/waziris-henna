import React from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../../context/FavoritesContext'

function DesignCard({ design }) {
  const { toggleFavorite, isFavorite } = useFavorites()

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <Link to={`/designs/${design.slug}`}>
        <img
          src={design.image_url}
          alt={design.title}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <h3 className="font-playfair font-semibold">{design.title}</h3>
            <p className="text-sm text-gray-300">{design.style} • {design.occasion}</p>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(design)}
        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform z-10"
        aria-label="Save design"
      >
        <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
      </button>
    </div>
  )
}

export default DesignCard