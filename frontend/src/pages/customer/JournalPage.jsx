import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

const categories = [
  { value: 'All', label: 'All Articles', icon: 'fa-book' },
  { value: 'Guides', label: 'Guides', icon: 'fa-compass' },
  { value: 'Tutorials', label: 'Tutorials', icon: 'fa-graduation-cap' },
  { value: 'Culture', label: 'Culture', icon: 'fa-landmark' },
  { value: 'Tips', label: 'Tips', icon: 'fa-lightbulb' },
  { value: 'Inspiration', label: 'Inspiration', icon: 'fa-sparkles' },
]

function JournalPage() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [activeCategory, search])

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const params = {}
      if (activeCategory !== 'All') params.category = activeCategory
      if (search) params.search = search

      const response = await api.get(endpoints.journal, { params })
      setArticles(response.data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      toast.error('Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Henna Journal | Guides, Tutorials & Culture | Waziri's Henna</title>
        <meta name="description" content="Learn about henna care, traditions, and techniques through our comprehensive journal." />
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">📚 Henna Journal</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Learn About Henna
          </h1>
          <p className="text-gray-600 mt-4 max-w-lg mx-auto">
            Explore guides, tutorials, and cultural insights about the art of henna
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-white border-y border-[#e8ddd4] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.value
                      ? 'bg-[#8B5E3C] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className={`fas ${cat.icon} mr-1`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loader />
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-book text-6xl text-gray-300 mb-6"></i>
              <h3 className="font-playfair text-2xl font-semibold text-gray-600 mb-2">
                No Articles Found
              </h3>
              <p className="text-gray-500">Check back soon for new content</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:shadow-xl transition-all duration-300"
                >
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
                      <h3 className="font-playfair text-lg font-semibold mb-2 hover:text-[#8B5E3C] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>
                          <i className="fas fa-eye mr-1"></i>
                          {article.views_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default JournalPage