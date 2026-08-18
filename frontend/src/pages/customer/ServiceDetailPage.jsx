import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function ServiceDetailPage() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchService()
  }, [slug])

  const fetchService = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`${endpoints.services}/${slug}`)
      setService(response.data)
    } catch (error) {
      console.error('Error fetching service:', error)
      toast.error('Failed to load service')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />
  if (!service) return <div className="text-center py-20">Service not found</div>

  return (
    <>
      <Helmet>
        <title>{service.name} | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="text-[#8B5E3C] font-semibold hover:text-[#D4AF37] mb-6 inline-block">
            <i className="fas fa-arrow-left mr-2"></i> Back to Services
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <h1 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">{service.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#8B5E3C] rounded-full text-sm font-semibold">
                From ₦{parseFloat(service.starting_price).toLocaleString()}
              </span>
              {service.duration_minutes && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  <i className="fas fa-clock mr-1"></i>{service.duration_minutes} mins
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>

            {service.suitable_occasions && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Suitable For:</h3>
                <p className="text-gray-600">{service.suitable_occasions}</p>
              </div>
            )}

            <Link
              to={`/booking?service=${service.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
            >
              <i className="fas fa-calendar-check"></i> Book This Service
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default ServiceDetailPage