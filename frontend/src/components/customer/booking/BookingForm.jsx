import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function BookingForm() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [designs, setDesigns] = useState([])
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
    const fetchData = async () => {
      try {
        const [servicesRes, designsRes] = await Promise.all([
          api.get(endpoints.services),
          api.get(endpoints.designs, { params: { per_page: 50 } }),
        ])
        setServices(servicesRes.data || [])
        setDesigns(designsRes.data || [])
      } catch (error) {
        console.error('Error fetching booking data:', error)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await api.post(endpoints.bookings, formData)
      if (response.success) {
        toast.success('Booking created successfully!')
        navigate(`/booking/success/${response.data.booking_reference}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-semibold text-sm mb-2">Your Name *</label>
        <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required
          className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]" />
      </div>
      <div>
        <label className="block font-semibold text-sm mb-2">Phone Number *</label>
        <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required
          className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]" />
      </div>
      <div>
        <label className="block font-semibold text-sm mb-2">Email</label>
        <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]" />
      </div>
      <div>
        <label className="block font-semibold text-sm mb-2">Service *</label>
        <select name="service_id" value={formData.service_id} onChange={handleChange} required
          className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white">
          <option value="">Choose a service...</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>{service.name} - From ₦{parseFloat(service.starting_price).toLocaleString()}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-sm mb-2">Preferred Design (Optional)</label>
        <select name="design_id" value={formData.design_id} onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white">
          <option value="">No specific design</option>
          {designs.map(design => (
            <option key={design.id} value={design.id}>{design.title}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-2">Event Date *</label>
          <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} required min={today}
            className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]" />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-2">Event Type</label>
          <select name="event_type" value={formData.event_type} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white">
            <option value="">Select...</option>
            <option value="Wedding">Wedding</option>
            <option value="Eid">Eid</option>
            <option value="Birthday">Birthday</option>
            <option value="Naming Ceremony">Naming Ceremony</option>
            <option value="Engagement">Engagement</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block font-semibold text-sm mb-2">Number of People</label>
        <input type="number" name="number_of_people" value={formData.number_of_people} onChange={handleChange} min="1" max="50"
          className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]" />
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-4 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#b8941f] transition-all disabled:opacity-50">
        {isSubmitting ? 'Submitting...' : 'Submit Booking'}
      </button>
    </form>
  )
}

export default BookingForm