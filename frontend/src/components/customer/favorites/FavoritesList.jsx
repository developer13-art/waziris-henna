import React from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../../context/FavoritesContext'

function FavoritesList() {
  const { designs, toggleFavorite } = useFavorites()

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-heart text-5xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">No saved designs yet</p>
        <Link to="/designs" className="text-[#8B5E3C] font-semibold">Browse Designs</Link>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <div key={design.id} className="relative rounded-2xl overflow-hidden shadow-md">
          <Link to={`/designs/${design.slug}`}>
            <img src={design.image_url} alt={design.title} className="w-full h-64 object-cover" />
          </Link>
          <button onClick={() => toggleFavorite(design)}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500">
            <i className="fas fa-heart"></i>
          </button>
        </div>
      ))}
    </div>
  )
}

export default FavoritesList