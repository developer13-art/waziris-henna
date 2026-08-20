import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../../context/CartContext'
import { getImageUrl } from '../../utils/imageUrl'

function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  const deliveryFee = subtotal >= 20000 ? 0 : 1500
  const total = subtotal + deliveryFee

  return (
    <>
      <Helmet>
        <title>Shopping Cart | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Cart</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 mt-4">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-6"></i>
              <h3 className="font-playfair text-2xl font-semibold text-gray-600 mb-2">
                Your Cart is Empty
              </h3>
              <p className="text-gray-500 mb-6">Browse our products and add items you love</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
              >
                <i className="fas fa-store"></i> Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.product_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-white rounded-2xl p-4 shadow-md flex gap-4 items-center"
                    >
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.name}
                        style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold mb-1">{item.name}</h3>
                        <p className="text-[#8B5E3C] font-bold">
                          ₦{parseFloat(item.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold mb-2">
                          ₦{parseFloat(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={clearCart}
                  className="text-red-500 font-semibold hover:text-red-700 transition-colors"
                >
                  <i className="fas fa-trash-alt mr-2"></i> Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-md h-fit">
                <h3 className="font-playfair text-xl font-semibold mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span className="font-semibold">₦{deliveryFee.toLocaleString()}</span>
                    )}
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-500">
                      Add ₦{(20000 - subtotal).toLocaleString()} more for free delivery
                    </p>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-[#8B5E3C]">₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#b8941f] transition-all duration-200 shadow-lg"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/products"
                  className="block text-center mt-4 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CartPage