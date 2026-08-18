import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white border-2 border-[#D4AF37] rounded-full flex items-center justify-center text-[#8B5E3C] shadow-lg hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] transition-all duration-200"
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop