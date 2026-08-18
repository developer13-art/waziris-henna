import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { useFavorites } from '../../context/FavoritesContext'

function HomePage() {
  const [featuredDesigns, setFeaturedDesigns] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [services, setServices] = useState([])
  const [reviews, setReviews] = useState([])
  const [designOfWeek, setDesignOfWeek] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    setIsLoading(true)
    try {
      const [designsRes, productsRes, servicesRes, reviewsRes] = await Promise.all([
        api.get(endpoints.designs, { params: { featured: true, per_page: 6 } }),
        api.get(endpoints.products, { params: { featured: true, per_page: 4 } }),
        api.get(endpoints.services),
        api.get(endpoints.reviews, { params: { featured: true } }),
      ])

      setFeaturedDesigns(designsRes.data || [])
      setFeaturedProducts(productsRes.data || [])
      setServices(servicesRes.data || [])
      setReviews(reviewsRes.data || [])

      // Find design of the week
      const designOfWeek = designsRes.data?.find((d) => d.is_design_of_week)
      setDesignOfWeek(designOfWeek || designsRes.data?.[0] || null)
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />

  return (
    <>
      <Helmet>
        <title>Waziri's Henna | Elegant Henna Designs & Premium Products in Kaduna</title>
        <meta name="description" content="Professional henna artistry for weddings, Eid celebrations, and special occasions in Kaduna, Nigeria." />
      </Helmet>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF1E6] to-[#FFF8F0] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B5E3C]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 bg-[#D4AF37]/10 text-[#D4AF37] font-semibold text-sm uppercase tracking-wider rounded-full mb-6">
              ✨ Welcome to Waziri's Henna
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#222] leading-tight mb-6">
              Elegant <span className="text-[#8B5E3C]">Henna</span> Designs For Every Occasion
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
              Transform your special moments with beautiful, creative, and long-lasting 
              henna designs. From bridal masterpieces to everyday elegance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="fab fa-whatsapp"></i> Book Appointment
              </Link>
              <Link
                to="/design-finder"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-200"
              >
                <i className="fas fa-magic"></i> Find Your Design
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-[#D4AF37]"></i>
                <span className="text-sm text-gray-600">100% Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-[#D4AF37]"></i>
                <span className="text-sm text-gray-600">500+ Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-[#D4AF37]"></i>
                <span className="text-sm text-gray-600">5-Star Rated</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#8B5E3C]/20 rounded-[40px] blur-xl"></div>
              <img
                src="/images/hero-henna.jpg"
                alt="Beautiful henna design"
                className="relative rounded-[40px] shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] text-xl">
                  <i className="fas fa-award"></i>
                </div>
                <div>
                  <p className="font-semibold text-sm">Premium Quality</p>
                  <p className="text-xs text-gray-500">Trusted by 500+ clients</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="bg-white border-y border-[#e8ddd4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-heart', value: '500+', label: 'Happy Clients' },
              { icon: 'fa-store', value: '15+', label: 'Premium Products' },
              { icon: 'fa-leaf', value: '100%', label: 'Natural Henna' },
              { icon: 'fa-star', value: '5.0', label: 'Customer Rating' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <i className={`fas ${stat.icon} text-3xl text-[#D4AF37] mb-3`}></i>
                <p className="font-playfair text-3xl font-bold text-[#8B5E3C]">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DESIGN OF THE WEEK ==================== */}
      {designOfWeek && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#8B5E3C] to-[#6B4423] rounded-[30px] p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <span className="inline-block px-4 py-1.5 bg-[#D4AF37] text-[#222] font-semibold text-sm rounded-full mb-4">
                    ⭐ Design of the Week
                  </span>
                  <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">
                    {designOfWeek.title}
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {designOfWeek.description?.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {designOfWeek.style && (
                      <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{designOfWeek.style}</span>
                    )}
                    {designOfWeek.occasion && (
                      <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{designOfWeek.occasion}</span>
                    )}
                    {designOfWeek.complexity && (
                      <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{designOfWeek.complexity}</span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Link
                      to={`/designs/${designOfWeek.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#222] font-semibold rounded-full hover:bg-white transition-all duration-200"
                    >
                      View Design
                    </Link>
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#8B5E3C] transition-all duration-200"
                    >
                      Book This Design
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={designOfWeek.image_url}
                    alt={designOfWeek.title}
                    className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-tag">How It Works</span>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">
              Simple 3-Step Process
            </h2>
            <p className="text-gray-600 mt-3 max-w-lg mx-auto">
              Getting your perfect henna design is easy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: 'fa-search', title: 'Browse Our Work', desc: 'Explore our gallery of designs and find inspiration for your perfect look.' },
              { step: '2', icon: 'fa-whatsapp', title: 'Book Consultation', desc: 'Contact us via WhatsApp to discuss your design preferences and schedule.' },
              { step: '3', icon: 'fa-paint-brush', title: 'Get Your Design', desc: 'Relax while we create your beautiful, custom henna design with care.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="text-center p-8 bg-[#FFF8F0] rounded-3xl hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-5 font-playfair">
                  {item.step}
                </div>
                <i className={`fab ${item.icon} text-3xl text-[#D4AF37] mb-4`}></i>
                <h3 className="font-playfair text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED SERVICES ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-tag">Our Services</span>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">
              What We Offer
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-7 rounded-2xl border border-[#e8ddd4] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-crown text-2xl text-[#D4AF37]"></i>
                </div>
                <h3 className="font-playfair text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.short_description || service.description}</p>
                <p className="text-[#8B5E3C] font-semibold text-sm">
                  From ₦{parseFloat(service.starting_price).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED DESIGNS ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-14">
            <div>
              <span className="section-tag">Portfolio</span>
              <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">
                Featured Designs
              </h2>
            </div>
            <Link
              to="/designs"
              className="inline-flex items-center gap-2 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors"
            >
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={design.image_url}
                  alt={design.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="text-white">
                    <h3 className="font-playfair text-lg font-semibold mb-1">{design.title}</h3>
                    <p className="text-sm text-gray-300">{design.style} • {design.occasion}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(design)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform"
                  aria-label="Save design"
                >
                  <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DESIGN FINDER CTA ==================== */}
      <section className="py-20 bg-gradient-to-r from-[#8B5E3C] to-[#6B4423]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-4">
            Not Sure Which Design to Choose?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Use our Design Finder to get personalized recommendations based on your preferences.
          </p>
          <Link
            to="/design-finder"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#D4AF37] text-[#222] font-bold rounded-full hover:bg-white transition-all duration-200 text-lg"
          >
            <i className="fas fa-magic"></i> Find Your Perfect Design
          </Link>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-tag">Testimonials</span>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-7 rounded-2xl border border-[#e8ddd4] hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#D4AF37] mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#8B5E3C] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                    {review.customer_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.customer_name}</p>
                    <p className="text-xs text-gray-500">{review.review_type}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage