import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../../context/CartContext'
import api, { endpoints } from '../../services/api'
import { toast } from 'react-toastify'
import { getImageUrl } from '../../utils/imageUrl'

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
      // Step 1: Create the order
      const orderData = {
        ...formData,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        delivery_fee: deliveryFee,
      }

      console.log('Creating order...', orderData)

      const orderResponse = await api.post(endpoints.orders, orderData)

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order')
      }

      const orderId = orderResponse.data.id
      const orderReference = orderResponse.data.order_reference

      console.log('Order created:', { orderId, orderReference })

      // Step 2: Initialize Paystack payment
      const paymentData = {
        payment_type: 'order',
        email: formData.customer_email,
        amount: total,
        callback_url: `${window.location.origin}/payment/success/${orderReference}`,
      }

      console.log('Initializing payment...', paymentData)

      const paymentResponse = await api.post(endpoints.initializePayment(orderId), paymentData)

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Failed to initialize payment')
      }

      const authorizationUrl = paymentResponse.data.authorization_url

      console.log('Payment initialized:', authorizationUrl)

      // Step 3: Redirect to Paystack payment page
      toast.success('Redirecting to payment...')
      
      // Clear cart before redirect
      clearCart()
      
      // Redirect to Paystack
      window.location.href = authorizationUrl

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to process checkout')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Waziri's Henna</title>
      </Helmet>

      <section style={{ padding: '120px 20px 60px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>
          Complete Your Order
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '20px' }}>Customer Information</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Full Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e8ddd4',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Email Address *</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e8ddd4',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Phone Number *</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                placeholder="+234 XXX XXX XXXX"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e8ddd4',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '20px', marginTop: '30px' }}>Delivery Method</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, delivery_method: 'Pickup' }))}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: formData.delivery_method === 'Pickup' ? '2px solid #D4AF37' : '2px solid #e8ddd4',
                  background: formData.delivery_method === 'Pickup' ? 'rgba(212, 175, 55, 0.05)' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <i className="fas fa-store" style={{ fontSize: '24px', color: '#8B5E3C', marginBottom: '8px', display: 'block' }}></i>
                <span style={{ fontWeight: '600', display: 'block' }}>Pickup</span>
                <span style={{ fontSize: '12px', color: '#666' }}>Free</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, delivery_method: 'Delivery' }))}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: formData.delivery_method === 'Delivery' ? '2px solid #D4AF37' : '2px solid #e8ddd4',
                  background: formData.delivery_method === 'Delivery' ? 'rgba(212, 175, 55, 0.05)' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <i className="fas fa-truck" style={{ fontSize: '24px', color: '#8B5E3C', marginBottom: '8px', display: 'block' }}></i>
                <span style={{ fontWeight: '600', display: 'block' }}>Delivery</span>
                <span style={{ fontSize: '12px', color: '#666' }}>₦1,500</span>
              </button>
            </div>

            {formData.delivery_method === 'Delivery' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Delivery Address *</label>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter your delivery address"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e8ddd4',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>
            )}
          </form>

          {/* Order Summary */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '20px' }}>Order Summary</h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {items.map((item) => (
                <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0e8dd' }}>
                  <img
                    src={getImageUrl(item.image_url)}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 0', borderTop: '2px solid #e8ddd4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>₦{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Delivery Fee</span>
                <span style={{ fontWeight: '600' }}>
                  {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e8ddd4' }}>
                <span style={{ fontWeight: '700' }}>Total</span>
                <span style={{ fontWeight: '700', color: '#8B5E3C', fontSize: '18px' }}>
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isProcessing || items.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                background: '#D4AF37',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '20px',
                opacity: isProcessing ? 0.7 : 1,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
                  Pay with Paystack
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage