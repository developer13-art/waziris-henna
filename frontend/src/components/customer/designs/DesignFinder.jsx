import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { endpoints } from '../../../services/api'
import DesignCard from './DesignCard'
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

const complexityLevels = ['Simple', 'Medium', 'Intricate']

function DesignFinder() {
  const [step, setStep] = useState(1)
  const [occasion, setOccasion] = useState('')
  const [bodyArea, setBodyArea] = useState('')
  const [style, setStyle] = useState('')
  const [complexity, setComplexity] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleFindDesigns = async (selectedComplexity) => {
    setIsSearching(true)
    try {
      const params = {}
      if (occasion) params.occasion = occasion
      if (bodyArea) params.body_area = bodyArea
      if (style) params.style = style
      if (selectedComplexity) params.complexity = selectedComplexity

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#D4AF37] rounded-full"
            animate={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="font-playfair text-2xl font-semibold text-center mb-8">What is the occasion?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {occasions.map((item) => (
                <button key={item.value} onClick={() => { setOccasion(item.value); setStep(2) }}
                  className="p-6 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] transition-all text-center">
                  <i className={`fas ${item.icon} text-3xl text-[#D4AF37] mb-3`}></i>
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="font-playfair text-2xl font-semibold text-center mb-8">Where do you want the henna?</h2>
            <div className="grid grid-cols-3 gap-4">
              {bodyAreas.map((item) => (
                <button key={item.value} onClick={() => { setBodyArea(item.value); setStep(3) }}
                  className="p-8 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] transition-all text-center">
                  <i className={`fas ${item.icon} text-4xl text-[#8B5E3C] mb-3`}></i>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="font-playfair text-2xl font-semibold text-center mb-8">What style do you prefer?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styles.map((item) => (
                <button key={item.value} onClick={() => { setStyle(item.value); setStep(4) }}
                  className="p-6 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] transition-all text-center">
                  <i className={`fas ${item.icon} text-3xl text-[#8B5E3C] mb-3`}></i>
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="font-playfair text-2xl font-semibold text-center mb-8">How detailed do you want it?</h2>
            <div className="space-y-4">
              {complexityLevels.map((level) => (
                <button key={level} onClick={() => { setComplexity(level); handleFindDesigns(level) }}
                  className="w-full p-6 bg-white border-2 border-[#e8ddd4] rounded-2xl hover:border-[#D4AF37] transition-all text-left flex items-center justify-between">
                  <span className="font-semibold">{level}</span>
                  <i className="fas fa-chevron-right text-[#D4AF37]"></i>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-playfair text-2xl font-semibold text-center mb-8">
              {results.length > 0 ? '✨ Recommended Designs' : 'No Matching Designs'}
            </h2>
            {isSearching ? (
              <div className="text-center"><i className="fas fa-spinner fa-spin text-3xl text-[#D4AF37]"></i></div>
            ) : results.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.slice(0, 6).map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))}
              </div>
            ) : (
              <button onClick={() => setStep(1)} className="mx-auto block px-6 py-3 bg-[#D4AF37] text-white rounded-full">Try Again</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DesignFinder