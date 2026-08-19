import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function BookingPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [designs, setDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    service_id: '',
    design_id: '',
    event_type: '',
    event_date: '',
    event_time: '',
    number_of_people: 1,
    additional_notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [servicesRes, designsRes] = await Promise.all([
        api.get(endpoints.services),
        api.get(endpoints.designs, { params: { per_page: 50 } }),
      ])
      setServices(servicesRes.data || [])
      setDesigns(designsRes.data || [])
    } catch (error) {
      console.error('Error fetching booking data:', error)
      toast.error('Failed to load booking options')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Clean up the form data - convert empty strings to null
      const bookingData = {
        ...formData,
        service_id: formData.service_id ? parseInt(formData.service_id) : null,
        design_id: formData.design_id ? parseInt(formData.design_id) : null,
        number_of_people: parseInt(formData.number_of_people) || 1,
        total_amount: 0,
      }

      // Remove empty fields
      Object.keys(bookingData).forEach(key => {
        if (bookingData[key] === '' || bookingData[key] === null || bookingData[key] === undefined) {
          if (key !== 'service_id' && key !== 'design_id' && key !== 'customer_email' && key !== 'event_time' && key !== 'additional_notes') {
            delete bookingData[key]
          }
        }
      })

      const response = await api.post(endpoints.bookings, bookingData)

      if (response.success) {
        toast.success('Booking created successfully!')
        navigate(`/booking/success/${response.data.booking_reference}`)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }
  if (isLoading) return <Loader />

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Helmet>
        <title>Book Henna Appointment | Waziri's Henna</title>
        <meta name="description" content="Book your henna appointment with Waziri's Henna in Kaduna." />
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Book Now</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Book Your Henna Appointment
          </h1>
          <p className="text-gray-600 mt-4">
            Fill in your details and we'll confirm your booking shortly
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
            {/* Customer Name */}
            <div>
              <label htmlFor="customer_name" className="block font-semibold text-sm mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="customer_email" className="block font-semibold text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="customer_phone" className="block font-semibold text-sm mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                placeholder="+234 XXX XXX XXXX"
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service_id" className="block font-semibold text-sm mb-2">
                Select Service *
              </label>
              <select
                id="service_id"
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors bg-white"
              >
                <option value="">Choose a service...</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - From ₦{parseFloat(service.starting_price).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Design */}
            <div>
              <label htmlFor="design_id" className="block font-semibold text-sm mb-2">
                Preferred Design (Optional)
              </label>
              <select
                id="design_id"
                name="design_id"
                value={formData.design_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors bg-white"
              >
                <option value="">No specific design</option>
                {designs.map(design => (
                  <option key={design.id} value={design.id}>
                    {design.title} - {design.style}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type */}
            <div>
              <label htmlFor="event_type" className="block font-semibold text-sm mb-2">
                Event Type
              </label>
              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors bg-white"
              >
                <option value="">Select event type...</option>
                <option value="Wedding">Wedding</option>
                <option value="Eid">Eid</option>
                <option value="Birthday">Birthday</option>
                <option value="Naming Ceremony">Naming Ceremony</option>
                <option value="Engagement">Engagement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_date" className="block font-semibold text-sm mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="event_time" className="block font-semibold text-sm mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  id="event_time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Number of People */}
            <div>
              <label htmlFor="number_of_people" className="block font-semibold text-sm mb-2">
                Number of People
              </label>
              <input
                type="number"
                id="number_of_people"
                name="number_of_people"
                value={formData.number_of_people}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="additional_notes" className="block font-semibold text-sm mb-2">
                Additional Notes
              </label>
              <textarea
                id="additional_notes"
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests or information..."
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#b8941f] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-2"></i> Submit Booking Request
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default BookingPage