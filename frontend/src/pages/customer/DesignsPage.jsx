import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { useFavorites } from '../../context/FavoritesContext'
import { toast } from 'react-toastify'

function DesignsPage() {
  const [designs, setDesigns] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    style: '',
    occasion: '',
    body_area: '',
    complexity: '',
  })
  const { toggleFavorite, isFavorite } = useFavorites()

  const fetchDesigns = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 12, ...filters }
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })

      const response = await api.get(endpoints.designs, { params })
      setDesigns(response.data || [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching designs:', error)
      toast.error('Failed to load designs')
    } finally {
      setIsLoading(false)
    }
  }, [page, filters])

  const fetchCategories = async () => {
    try {
      const response = await api.get(endpoints.categories)
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchDesigns()
  }, [fetchDesigns])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      style: '',
      occasion: '',
      body_area: '',
      complexity: '',
    })
    setPage(1)
  }

  const styles = ['Traditional Hausa', 'Arabic', 'Floral', 'Minimalist', 'Geometric']
  const occasions = ['Wedding', 'Eid', 'Birthday', 'Casual', 'Naming Ceremony', 'Engagement']
  const bodyAreas = ['Hands', 'Feet', 'Both']
  const complexityLevels = ['Simple', 'Medium', 'Intricate']

  return (
    <>
      <Helmet>
        <title>Henna Designs Gallery | Waziri's Henna</title>
        <meta name="description" content="Browse our beautiful collection of henna designs for weddings, Eid, and all occasions." />
      </Helmet>

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Portfolio</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Our Beautiful Designs
          </h1>
          <p className="text-gray-600 mt-4 max-w-lg mx-auto">
            Browse our collection and find the perfect design for your occasion
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-y border-[#e8ddd4] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search designs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Style Filter */}
            <select
              value={filters.style}
              onChange={(e) => handleFilterChange('style', e.target.value)}
              className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm bg-white"
            >
              <option value="">All Styles</option>
              {styles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>

            {/* Occasion Filter */}
            <select
              value={filters.occasion}
              onChange={(e) => handleFilterChange('occasion', e.target.value)}
              className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm bg-white"
            >
              <option value="">All Occasions</option>
              {occasions.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(filters.search || filters.category || filters.style || filters.occasion) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-[#8B5E3C] font-semibold hover:text-red-500 transition-colors text-sm"
              >
                <i className="fas fa-times mr-1"></i> Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loader />
          ) : designs.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-search text-6xl text-gray-300 mb-6"></i>
              <h3 className="font-playfair text-2xl font-semibold text-gray-600 mb-2">
                No Designs Found
              </h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/designs/${design.slug}`}>
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-playfair font-semibold">{design.title}</h3>
                      <p className="text-gray-300 text-sm">{design.style} • {design.occasion}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(design)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform z-10"
                    aria-label="Save design to favorites"
                  >
                    <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
                  </button>
                  {design.complexity && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-[#222] text-xs font-semibold rounded-full">
                      {design.complexity}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 bg-white border-2 border-[#e8ddd4] rounded-full flex items-center justify-center text-[#8B5E3C] hover:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="text-sm font-semibold text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 bg-white border-2 border-[#e8ddd4] rounded-full flex items-center justify-center text-[#8B5E3C] hover:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default DesignsPage