import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white rounded-3xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-playfair text-xl font-semibold">{title}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal