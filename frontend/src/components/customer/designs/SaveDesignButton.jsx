import React from 'react'
import { useFavorites } from '../../../context/FavoritesContext'

function SaveDesignButton({ design, className = '' }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const saved = isFavorite(design.id)

  return (
    <button
      onClick={() => toggleFavorite(design)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
        saved
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-red-500 hover:text-red-500'
      } ${className}`}
      aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <i className={`${saved ? 'fas' : 'far'} fa-heart`}></i>
      {saved ? 'Saved' : 'Save Design'}
    </button>
  )
}

export default SaveDesignButton