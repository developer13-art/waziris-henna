import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function ServicesPage() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.services)
      setServices(response.data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Failed to load services')
    } finally {
      setIsLoading(false)
    }
  }

  const serviceIcons = {
    'Bridal Henna': 'fa-crown',
    'Simple Henna': 'fa-hand-sparkles',
    'Traditional Henna': 'fa-landmark',
    'Arabic Designs': 'fa-moon',
    "Children's Henna": 'fa-child',
    'Event/Group Henna': 'fa-users',
    'Custom Designs': 'fa-paint-brush',
  }

  return (
    <>
      <Helmet>
        <title>Our Services | Waziri's Henna</title>
        <meta name="description" content="Explore our henna services including bridal, traditional, Arabic, and custom designs." />
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Our Services</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            What We Offer
          </h1>
          <p className="text-gray-600 mt-4 max-w-lg mx-auto">
            Comprehensive henna services tailored to your needs and style
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-7 rounded-2xl border border-[#e8ddd4] hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${serviceIcons[service.name] || 'fa-star'} text-2xl text-[#D4AF37]`}></i>
                  </div>
                  <h3 className="font-playfair text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  {service.duration_minutes && (
                    <p className="text-xs text-gray-500 mb-2">
                      <i className="fas fa-clock mr-1"></i> {service.duration_minutes} minutes
                    </p>
                  )}
                  <p className="text-[#8B5E3C] font-semibold">
                    From ₦{parseFloat(service.starting_price).toLocaleString()}
                  </p>
                  <Link
                    to="/booking"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors text-sm"
                  >
                    Book This Service
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default ServicesPage