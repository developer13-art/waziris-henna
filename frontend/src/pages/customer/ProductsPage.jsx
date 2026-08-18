import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  })
  const { addToCart } = useCart()

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 12, ...filters }
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })

      const response = await api.get(endpoints.products, { params })
      setProducts(response.data || [])
      setTotalPages(response.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
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
        <meta name="description" content="Shop premium quality henna products including powder, oils, stickers, and patterns." />
      </Helmet>

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Shop</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Premium Henna Products
          </h1>
          <p className="text-gray-600 mt-4 max-w-lg mx-auto">
            Quality products for beautiful, long-lasting results. All natural, carefully sourced.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-y border-[#e8ddd4] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPage(1) }}
                className="w-full px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
            <select
              value={filters.category}
              onChange={(e) => { setFilters(prev => ({ ...prev, category: e.target.value })); setPage(1) }}
              className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-6"></i>
              <h3 className="font-playfair text-2xl font-semibold text-gray-600 mb-2">No Products Found</h3>
              <p className="text-gray-500">Check back soon for new products</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const isOutOfStock = product.stock_quantity === 0
                const isLowStock = product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:shadow-xl transition-all duration-300"
                  >
                    <Link to={`/products/${product.slug}`} className="relative block">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {isOutOfStock && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                          Out of Stock
                        </span>
                      )}
                      {isLowStock && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                          Low Stock: {product.stock_quantity} left
                        </span>
                      )}
                      {product.sale_price && product.sale_price < product.price && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Sale
                        </span>
                      )}
                    </Link>
                    <div className="p-5">
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-playfair font-semibold text-lg mb-1 hover:text-[#8B5E3C] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.short_description || product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {product.sale_price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#8B5E3C] font-bold text-lg">
                                ₦{parseFloat(product.sale_price).toLocaleString()}
                              </span>
                              <span className="text-gray-400 text-sm line-through">
                                ₦{parseFloat(product.price).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#8B5E3C] font-bold text-lg">
                              ₦{parseFloat(product.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {!isOutOfStock && (
                          <span className="text-xs text-green-600 font-semibold">
                            In Stock: {product.stock_quantity}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                          isOutOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#8B5E3C] text-white hover:bg-[#6B4423] shadow-md hover:shadow-lg'
                        }`}
                      >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
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

export default ProductsPage