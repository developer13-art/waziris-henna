import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import { useFavorites } from '../../context/FavoritesContext'
import { getImageUrl } from '../../utils/imageUrl'
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
      const params = { page, per_page: 12 }
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.style) params.style = filters.style
      if (filters.occasion) params.occasion = filters.occasion
      if (filters.body_area) params.body_area = filters.body_area
      if (filters.complexity) params.complexity = filters.complexity

      const response = await api.get(endpoints.designs, { params })
      setDesigns(Array.isArray(response.data) ? response.data : [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching designs:', error)
      toast.error('Failed to load designs')
      setDesigns([])
    } finally {
      setIsLoading(false)
    }
  }, [page, filters])

  const fetchCategories = async () => {
    try {
      const response = await api.get(endpoints.categories)
      setCategories(Array.isArray(response.data) ? response.data : [])
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
    setFilters({ search: '', category: '', style: '', occasion: '', body_area: '', complexity: '' })
    setPage(1)
  }

  const styles = ['Traditional Hausa', 'Arabic', 'Floral', 'Minimalist', 'Geometric']
  const occasions = ['Wedding', 'Eid', 'Birthday', 'Casual', 'Naming Ceremony', 'Engagement']

  return (
    <>
      <Helmet>
        <title>Henna Designs Gallery | Waziri's Henna</title>
      </Helmet>

      <div style={{ fontFamily: 'Poppins, sans-serif', paddingTop: '80px' }}>
        {/* Page Header */}
        <div style={{
          padding: '60px 20px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF1E6 100%)'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 16px',
            background: 'rgba(212, 175, 55, 0.08)',
            color: '#D4AF37',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            borderRadius: '50px',
            marginBottom: '10px'
          }}>
            Portfolio
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', fontWeight: '700', color: '#222', marginBottom: '10px' }}>
            Our Beautiful Designs
          </h1>
          <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
            Browse our collection and find the perfect design for your occasion
          </p>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px 20px', background: '#fff', borderBottom: '1px solid #e8ddd4', position: 'sticky', top: '80px', zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search designs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '10px 16px',
                border: '2px solid #e8ddd4',
                borderRadius: '50px',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'Poppins, sans-serif'
              }}
            />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{ padding: '10px 16px', border: '2px solid #e8ddd4', borderRadius: '50px', fontSize: '13px', background: '#fff', fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <select
              value={filters.style}
              onChange={(e) => handleFilterChange('style', e.target.value)}
              style={{ padding: '10px 16px', border: '2px solid #e8ddd4', borderRadius: '50px', fontSize: '13px', background: '#fff', fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">All Styles</option>
              {styles.map(style => <option key={style} value={style}>{style}</option>)}
            </select>
            <select
              value={filters.occasion}
              onChange={(e) => handleFilterChange('occasion', e.target.value)}
              style={{ padding: '10px 16px', border: '2px solid #e8ddd4', borderRadius: '50px', fontSize: '13px', background: '#fff', fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">All Occasions</option>
              {occasions.map(occasion => <option key={occasion} value={occasion}>{occasion}</option>)}
            </select>
            {(filters.search || filters.category || filters.style || filters.occasion) && (
              <button onClick={clearFilters} style={{
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                color: '#8B5E3C',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif'
              }}>
                <i className="fas fa-times mr-1"></i> Clear
              </button>
            )}
          </div>
        </div>

        {/* Designs Grid */}
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
            </div>
          ) : designs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fas fa-images" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
              <p style={{ color: '#666', fontSize: '18px' }}>No designs found</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {designs.map((design) => (
                <div key={design.id} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  <Link to={`/designs/${design.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {design.image_url ? (
                      <img
                        src={getImageUrl(design.image_url)}
                        alt={design.title}
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '250px',
                        background: '#f9fafb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="fas fa-image" style={{ fontSize: '40px', color: '#ddd' }}></i>
                      </div>
                    )}
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{design.title}</h3>
                      <p style={{ fontSize: '13px', color: '#666' }}>
                        {design.style || 'Style'} • {design.occasion || 'Any Occasion'}
                      </p>
                    </div>
                  </Link>
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(design)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '36px',
                      height: '36px',
                      background: '#fff',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#fff',
                  border: '2px solid #e8ddd4',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span style={{ padding: '10px', fontWeight: '600', color: '#666' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#fff',
                  border: '2px solid #e8ddd4',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default DesignsPage