import React from 'react'
import { Link } from 'react-router-dom'

function EmptyState({ icon = 'fa-inbox', title = 'Nothing Here', description = 'There is nothing to display yet.', linkTo, linkText }) {
  return (
    <div className="text-center py-20">
      <i className={`fas ${icon} text-6xl text-gray-300 mb-6`}></i>
      <h3 className="font-playfair text-2xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {linkTo && linkText && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
        >
          {linkText}
        </Link>
      )}
    </div>
  )
}

export default EmptyState