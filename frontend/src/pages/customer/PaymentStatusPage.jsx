import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import { toast } from 'react-toastify'

function PaymentStatusPage() {
  const { status, reference } = useParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (status === 'success' && reference) {
      verifyPayment(reference)
    } else {
      setIsVerifying(false)
    }
  }, [status, reference])

  const verifyPayment = async (ref) => {
    try {
      const response = await api.get(endpoints.verifyPayment(ref))
      
      if (response.success && response.data?.status === 'Successful') {
        setIsVerified(true)
        toast.success('Payment verified successfully!')
      } else {
        toast.error('Payment verification failed')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      toast.error('Failed to verify payment')
    } finally {
      setIsVerifying(false)
    }
  }

  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e8ddd4',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#8B5E3C', fontSize: '18px' }}>Verifying payment...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  const isSuccess = status === 'success' && isVerified

  return (
    <>
      <Helmet>
        <title>Payment {isSuccess ? 'Successful' : 'Failed'} | Waziri's Henna</title>
      </Helmet>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Poppins, sans-serif',
        background: '#FFF8F0'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          background: '#fff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isSuccess ? '#d1fae5' : '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-times-circle'} ${isSuccess ? 'text-green-500' : 'text-red-500'}`} style={{ fontSize: '40px', color: isSuccess ? '#10b981' : '#ef4444' }}></i>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>

          <p style={{ color: '#666', marginBottom: '20px' }}>
            {isSuccess
              ? 'Your payment has been verified. Thank you for your order!'
              : 'There was an issue processing your payment. Please try again.'}
          </p>

          {reference && (
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#666' }}>Reference</p>
              <p style={{ fontFamily: 'monospace', fontWeight: '600' }}>{reference}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" style={{
              padding: '14px',
              background: '#D4AF37',
              color: '#fff',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Back to Home
            </Link>
            {!isSuccess && (
              <Link to="/cart" style={{
                padding: '14px',
                border: '2px solid #D4AF37',
                color: '#8B5E3C',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Try Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentStatusPage