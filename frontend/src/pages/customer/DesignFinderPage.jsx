import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { useFavorites } from '../../context/FavoritesContext'
import { toast } from 'react-toastify'

const occasions = [
  { value: 'Wedding', icon: 'fa-ring', label: 'Wedding' },
  { value: 'Eid', icon: 'fa-moon', label: 'Eid' },
  { value: 'Birthday', icon: 'fa-cake', label: 'Birthday' },
  { value: 'Casual', icon: 'fa-smile', label: 'Casual' },
  { value: 'Naming Ceremony', icon: 'fa-baby', label: 'Naming Ceremony' },
  { value: 'Engagement', icon: 'fa-heart', label: 'Engagement' },
]

const bodyAreas = [
  { value: 'Hands', icon: 'fa-hand', label: 'Hands' },
  { value: 'Feet', icon: 'fa-shoe-prints', label: 'Feet' },
  { value: 'Both', icon: 'fa-hands', label: 'Both' },
]

const styles = [
  { value: 'Traditional Hausa', icon: 'fa-landmark', label: 'Traditional Hausa' },
  { value: 'Arabic', icon: 'fa-moon', label: 'Arabic' },
  { value: 'Floral', icon: 'fa-flower', label: 'Floral' },
  { value: 'Minimalist', icon: 'fa-minus', label: 'Minimalist' },
  { value: 'Geometric', icon: 'fa-shapes', label: 'Geometric' },
]

const complexityLevels = [
  { value: 'Simple', label: 'Simple', desc: 'Clean, elegant patterns' },
  { value: 'Medium', label: 'Medium', desc: 'Balanced detail' },
  { value: 'Intricate', label: 'Intricate', desc: 'Highly detailed' },
]

function DesignFinderPage() {
  const [step, setStep] = useState(1)
  const [occasion, setOccasion] = useState('')
  const [bodyArea, setBodyArea] = useState('')
  const [style, setStyle] = useState('')
  const [complexity, setComplexity] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleFindDesigns = async () => {
    setIsSearching(true)
    try {
      const params = {}
      if (occasion) params.occasion = occasion
      if (bodyArea) params.body_area = bodyArea
      if (style) params.style = style
      if (complexity) params.complexity = complexity

      const response = await api.get(endpoints.designs, { params })
      setResults(response.data || [])
      setStep(5)
    } catch (error) {
      console.error('Error finding designs:', error)
      toast.error('Failed to find designs')
    } finally {
      setIsSearching(false)
    }
  }

  const resetFinder = () => {
    setStep(1)
    setOccasion('')
    setBodyArea('')
    setStyle('')
    setComplexity('')
    setResults([])
  }

  return (
    <>
      <Helmet>
        <title>Design Finder | Waziri's Henna</title>
        <meta name="description" content="Find your perfect henna design based on your preferences." />
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">✨ Design Finder</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            Find Your Perfect Henna Design
          </h1>
          <p className="text-gray-600 mt-4">
            Answer a few questions and we'll recommend designs tailored to your preferences
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              {['Occasion', 'Body Area', 'Style', 'Complexity', 'Results'].map((label, index) => (
                <span
                  key={index}
                  className={`text-xs font-semibold ${
                    step >= index + 1 ? 'text-[#8B5E3C]' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#D4AF37] rounded-full"
                animate={{ width: `${(step / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Occasion */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="font-playfair text-2xl font-semibold text-center mb-8">
                  What is the occasion?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {occasions.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => { setOccasion(item.value); setStep(2) }}
                      className="p-6 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] hover:shadow-lg transition-all duration-200 text-center"
                    >
                      <i className={`fas ${item.icon} text-3xl text-[#D4AF37] mb-3`}></i>
                      <span className="font-semibold text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Body Area */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="font-playfair text-2xl font-semibold text-center mb-8">
                  Where do you want the henna?
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {bodyAreas.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => { setBodyArea(item.value); setStep(3) }}
                      className="p-8 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] hover:shadow-lg transition-all duration-200 text-center"
                    >
                      <i className={`fas ${item.icon} text-4xl text-[#8B5E3C] mb-3`}></i>
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-6 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back
                </button>
              </motion.div>
            )}

            {/* Step 3: Style */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="font-playfair text-2xl font-semibold text-center mb-8">
                  What style do you prefer?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {styles.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => { setStyle(item.value); setStep(4) }}
                      className="p-6 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] hover:shadow-lg transition-all duration-200 text-center"
                    >
                      <i className={`fas ${item.icon} text-3xl text-[#8B5E3C] mb-3`}></i>
                      <span className="font-semibold text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back
                </button>
              </motion.div>
            )}

            {/* Step 4: Complexity */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="font-playfair text-2xl font-semibold text-center mb-8">
                  How detailed do you want the design?
                </h2>
                <div className="space-y-4">
                  {complexityLevels.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => { setComplexity(item.value); handleFindDesigns() }}
                      className="w-full p-6 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] hover:shadow-lg transition-all duration-200 text-left flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                      </div>
                      <i className="fas fa-chevron-right text-[#D4AF37]"></i>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="mt-6 text-[#8B5E3C] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back
                </button>
              </motion.div>
            )}

            {/* Step 5: Results */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-playfair text-2xl font-semibold text-center mb-8">
                  {results.length > 0 ? '✨ Recommended Designs' : 'No Matching Designs'}
                </h2>

                {isSearching ? (
                  <Loader />
                ) : results.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-search text-6xl text-gray-300 mb-6"></i>
                    <p className="text-gray-600 mb-6">No designs match your preferences.</p>
                    <button
                      onClick={resetFinder}
                      className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.slice(0, 6).map((design) => (
                      <div
                        key={design.id}
                        className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <Link to={`/designs/${design.slug}`}>
                          <img
                            src={design.image_url}
                            alt={design.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <button
                          onClick={() => toggleFavorite(design)}
                          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform"
                        >
                          <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
                        </button>
                        <div className="p-4 bg-white">
                          <h3 className="font-playfair font-semibold">{design.title}</h3>
                          <p className="text-sm text-gray-500">{design.style} • {design.complexity}</p>
                          <Link
                            to={`/designs/${design.slug}`}
                            className="mt-3 inline-flex items-center gap-2 text-[#8B5E3C] font-semibold text-sm hover:text-[#D4AF37] transition-colors"
                          >
                            View Details <i className="fas fa-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center mt-8">
                  <button
                    onClick={resetFinder}
                    className="px-6 py-3 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}

export default DesignFinderPage