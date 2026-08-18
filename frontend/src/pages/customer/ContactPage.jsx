import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create WhatsApp message
      const message = `Hello Waziri's Henna!%0A%0A` +
        `Name: ${formData.name}%0A` +
        `Email: ${formData.email}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Subject: ${formData.subject}%0A%0A` +
        `Message: ${formData.message}`

      window.open(`https://wa.me/2347048823830?text=${message}`, '_blank')
      
      toast.success('Opening WhatsApp to send your message...')
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Waziri's Henna</title>
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Contact</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 mt-4">
            We'd love to hear from you. Contact us for bookings, orders, or any questions.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="font-playfair text-2xl font-semibold mb-6">Contact Information</h3>
              
              {[
                { icon: 'fa-map-marker-alt', label: 'Location', value: 'Kaduna, Nigeria' },
                { icon: 'fa-phone', label: 'Phone / WhatsApp', value: '+234 704 882 3830', href: 'tel:+2347048823830' },
                { icon: 'fa-envelope', label: 'Email', value: 'aishaabdullahiwaziri001@gmail.com', href: 'mailto:aishaabdullahiwaziri001@gmail.com' },
                { icon: 'fa-instagram', label: 'Instagram', value: '@ayeesharhwaxeeree001', href: 'https://instagram.com/ayeesharhwaxeeree001' },
                { icon: 'fa-clock', label: 'Business Hours', value: 'Mon - Sat: 9:00 AM - 7:00 PM' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#e8ddd4] hover:border-[#D4AF37] transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${item.icon} text-xl text-[#8B5E3C]`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-gray-600 hover:text-[#8B5E3C] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-600">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-lg p-8 space-y-5"
            >
              <h3 className="font-playfair text-2xl font-semibold">Send Us a Message</h3>
              
              <div>
                <label className="block font-semibold text-sm mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#b8941f] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                  </>
                ) : (
                  <>
                    <i className="fab fa-whatsapp mr-2"></i> Send via WhatsApp
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage