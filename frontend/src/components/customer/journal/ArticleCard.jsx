import React from 'react'
import { Link } from 'react-router-dom'

function ArticleCard({ article }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:shadow-xl transition-all duration-300">
      <Link to={`/journal/${article.slug}`}>
        <div className="relative">
          <img
            src={article.image_url || '/images/journal-placeholder.jpg'}
            alt={article.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-[#222] text-xs font-semibold rounded-full">
            {article.category}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-playfair text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
          {article.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{article.author}</span>
            <span><i className="fas fa-eye mr-1"></i>{article.views_count || 0}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ArticleCard