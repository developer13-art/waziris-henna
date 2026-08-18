import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../../context/CartContext'
import api, { endpoints } from '../../services/api'
import { toast } from 'react-toastify'

function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_method: 'Pickup',
    delivery_address: '',
    notes: '',
  })

  const deliveryFee = formData.delivery_method === 'Delivery' ? 1500 : 0
  const total = subtotal + deliveryFee

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        delivery_fee: deliveryFee,
      }

      const response = await api.post(endpoints.orders, orderData)

      if (response.success) {
        toast.success('Order placed successfully!')
        clearCart()
        navigate(`/payment/success/${response.data.order_reference}`)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Checkout</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Complete Your Order
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">Customer Information</h3>
                
                <div>
                  <label className="block font-semibold text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sm mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sm mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="+234 XXX XXX XXXX"
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <h3 className="font-playfair text-xl font-semibold mb-4 pt-4">Delivery Method</h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, delivery_method: 'Pickup' }))}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      formData.delivery_method === 'Pickup'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-[#e8ddd4] hover:border-[#D4AF37]'
                    }`}
                  >
                    <i className="fas fa-store text-2xl mb-2 text-[#8B5E3C]"></i>
                    <p className="font-semibold">Pickup</p>
                    <p className="text-sm text-gray-500">Free</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, delivery_method: 'Delivery' }))}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      formData.delivery_method === 'Delivery'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-[#e8ddd4] hover:border-[#D4AF37]'
                    }`}
                  >
                    <i className="fas fa-truck text-2xl mb-2 text-[#8B5E3C]"></i>
                    <p className="font-semibold">Delivery</p>
                    <p className="text-sm text-gray-500">₦1,500</p>
                  </button>
                </div>

                {formData.delivery_method === 'Delivery' && (
                  <div>
                    <label className="block font-semibold text-sm mb-2">Delivery Address *</label>
                    <textarea
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      required
                      rows="3"
                      placeholder="Enter your delivery address"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-sm mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions..."
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-md h-fit">
              <h3 className="font-playfair text-xl font-semibold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#8B5E3C]">₦{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#b8941f] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock mr-2"></i> Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage