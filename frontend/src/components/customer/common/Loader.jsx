import React from 'react'
import { motion } from 'framer-motion'

function Loader() {
  return (
    <div className="fixed inset-0 bg-[#FFF8F0] z-[9999] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-[#e8ddd4] border-t-[#D4AF37] rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 font-playfair text-xl text-[#8B5E3C] font-semibold"
      >
        Waziri's Henna
      </motion.p>
    </div>
  )
}

export default Loader