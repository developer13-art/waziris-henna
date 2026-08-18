import React from 'react'
import { motion } from 'framer-motion'

function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/2347048823830?text=Hello%20Waziri's%20Henna!%20I'd%20like%20to%20book%20an%20appointment."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#333] text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform duration-200">
        <i className="fab fa-whatsapp"></i>
      </div>
    </motion.a>
  )
}

export default WhatsAppFloat