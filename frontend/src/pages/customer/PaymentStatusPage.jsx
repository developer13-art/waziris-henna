import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'

function PaymentStatusPage() {
  const { status, reference } = useParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    verifyPayment()
  }, [reference])

  const verifyPayment = async () => {
    if (status === 'success' && reference) {
      try {
        await api.get(endpoints.verifyPayment(reference))
        setVerified(true)
      } catch (error) {
        console.error('Error verifying payment:', error)
      }
    }
    setIsVerifying(false)
  }

  if (isVerifying) return <Loader />

  const isSuccess = status === 'success' && verified

  return (
    <>
      <Helmet>
        <title>Payment {isSuccess ? 'Successful' : 'Failed'} | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className={`w-24 h-24 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <i className={`fas ${isSuccess ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} text-5xl`}></i>
          </div>
          <h1 className="font-playfair text-3xl font-bold mb-4">
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isSuccess
              ? 'Your payment has been verified. Thank you for your purchase!'
              : 'There was an issue processing your payment. Please try again.'}
          </p>
          {reference && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="font-mono font-bold">{reference}</p>
            </div>
          )}
          <div className="space-y-3">
            <Link to="/" className="block w-full py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f]">
              Back to Home
            </Link>
            {!isSuccess && (
              <Link to="/cart" className="block w-full py-3 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white">
                Try Again
              </Link>
            )}
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default PaymentStatusPage