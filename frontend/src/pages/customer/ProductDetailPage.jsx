import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'

function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`${endpoints.products}/${slug}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />
  if (!product) return <div className="text-center py-20">Product not found</div>

  const isOutOfStock = product.stock_quantity === 0

  return (
    <>
      <Helmet>
        <title>{product.name} | Waziri's Henna</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
      </Helmet>

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <img
                src={product.image_url}
                alt={product.name}
                className="rounded-3xl shadow-2xl border-4 border-white w-full h-[400px] object-cover"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <span className="section-tag">{product.category || 'Product'}</span>
                <h1 className="font-playfair text-4xl font-bold mt-3">{product.name}</h1>
              </div>

              {product.sale_price ? (
                <div className="flex items-center gap-3">
                  <span className="text-[#8B5E3C] font-bold text-3xl">
                    ₦{parseFloat(product.sale_price).toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xl line-through">
                    ₦{parseFloat(product.price).toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-[#8B5E3C] font-bold text-3xl">
                  ₦{parseFloat(product.price).toLocaleString()}
                </span>
              )}

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isOutOfStock ? 'bg-red-100 text-red-700' :
                  product.stock_quantity <= product.low_stock_threshold ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock_quantity}`}
                </span>
              </div>

              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <i className="fas fa-minus text-sm"></i>
                    </button>
                    <span className="font-semibold w-10 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <i className="fas fa-plus text-sm"></i>
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-4 bg-[#8B5E3C] text-white font-bold rounded-full hover:bg-[#6B4423] transition-colors"
                  >
                    <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                  </button>
                </div>
              )}

              <Link to="/products" className="inline-block text-[#8B5E3C] font-semibold hover:text-[#D4AF37]">
                <i className="fas fa-arrow-left mr-2"></i> Back to Products
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductDetailPage