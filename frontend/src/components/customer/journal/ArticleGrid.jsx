import React from 'react'
import ArticleCard from './ArticleCard'

function ArticleGrid({ articles, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#e8ddd4] border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-book text-6xl text-gray-300 mb-6"></i>
        <h3 className="font-playfair text-2xl font-semibold text-gray-600">No Articles Found</h3>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}

export default ArticleGrid