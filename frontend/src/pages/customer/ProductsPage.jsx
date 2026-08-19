import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { getImageUrl } from '../../utils/imageUrl'
import { toast } from 'react-toastify'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({ search: '', category: '' })
  const { addToCart } = useCart()

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 12 }
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category

      const response = await api.get(endpoints.products, { params })
      setProducts(Array.isArray(response.data) ? response.data : [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const categories = ['Henna Products', 'Oils', 'Patterns', 'Accessories']

  return (
    <>
      <Helmet>
        <title>Premium Henna Products | Waziri's Henna</title>
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
            Shop
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', fontWeight: '700', color: '#222', marginBottom: '10px' }}>
            Premium Henna Products
          </h1>
          <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
            Quality products for beautiful, long-lasting results
          </p>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px 20px', background: '#fff', borderBottom: '1px solid #e8ddd4' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPage(1) }}
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
              onChange={(e) => { setFilters(prev => ({ ...prev, category: e.target.value })); setPage(1) }}
              style={{ padding: '10px 16px', border: '2px solid #e8ddd4', borderRadius: '50px', fontSize: '13px', background: '#fff', fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fas fa-box-open" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
              <p style={{ color: '#666', fontSize: '18px' }}>No products found</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {products.map((product) => {
                const isOutOfStock = product.stock_quantity === 0

                return (
                  <div key={product.id} style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}>
                    <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {product.image_url ? (
                        <img
                          src={getImageUrl(product.image_url)}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '220px',
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
                          height: '220px',
                          background: '#f9fafb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="fas fa-image" style={{ fontSize: '40px', color: '#ddd' }}></i>
                        </div>
                      )}
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{product.name}</h3>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                          {product.short_description || product.description?.substring(0, 60)}
                        </p>
                        <p style={{ fontSize: '18px', color: '#8B5E3C', fontWeight: '700', marginBottom: '12px' }}>
                          ₦{parseFloat(product.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                    <div style={{ padding: '0 16px 16px' }}>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: isOutOfStock ? '#f3f4f6' : '#8B5E3C',
                          color: isOutOfStock ? '#999' : '#fff',
                          border: 'none',
                          borderRadius: '50px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                )
              })}
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

export default ProductsPage