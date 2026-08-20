import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { getImageUrl } from '../../utils/imageUrl'
import { toast } from 'react-toastify'

function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setIsLoading(true)
    setImageError(false)
    try {
      const response = await api.get(`${endpoints.products}/${slug}`)
      console.log('Product data:', response.data)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      setProduct(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'Poppins, sans-serif' }}>
        <i className="fas fa-box-open" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Product Not Found</h2>
        <Link to="/products" style={{ color: '#8B5E3C', fontWeight: '600' }}>← Back to Products</Link>
      </div>
    )
  }

  const productImageUrl = getImageUrl(product.image_url)
  console.log('Product image URL:', productImageUrl)

  const isOutOfStock = product.stock_quantity === 0

  return (
    <>
      <Helmet>
        <title>{product.name} | Waziri's Henna</title>
      </Helmet>

      <div style={{ fontFamily: 'Poppins, sans-serif', padding: '120px 20px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <Link to="/products" style={{ color: '#8B5E3C', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          <i className="fas fa-arrow-left mr-2"></i> Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '30px' }}>
          {/* Image Section */}
          <div>
            {product.image_url && !imageError ? (
              <img
                src={productImageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '4px solid #fff',
                  display: 'block'
                }}
                onError={(e) => {
                  console.error('Product image failed to load:', productImageUrl)
                  setImageError(true)
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                background: '#f9fafb',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <i className="fas fa-image" style={{ fontSize: '60px', color: '#ddd' }}></i>
                <p style={{ color: '#999' }}>No image available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#8B5E3C',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              {product.category || 'Product'}
            </span>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '28px', color: '#8B5E3C', fontWeight: '700', marginBottom: '16px' }}>
              ₦{parseFloat(product.price || 0).toLocaleString()}
            </p>

            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: isOutOfStock ? '#ef4444' : '#10b981',
              marginBottom: '20px'
            }}>
              {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock_quantity} units`}
            </p>

            {product.description && (
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '20px' }}>
                {product.description}
              </p>
            )}

            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: '36px', height: '36px', background: '#f3f4f6', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px' }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: '600', fontSize: '18px', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                    style={{ width: '36px', height: '36px', background: '#f3f4f6', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px' }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product, quantity)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: '#8B5E3C',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage