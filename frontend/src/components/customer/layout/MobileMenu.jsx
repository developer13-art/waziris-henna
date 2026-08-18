import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/design-finder', label: 'Design Finder' },
  { to: '/designs', label: 'Designs' },
  { to: '/products', label: 'Products' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <span className="font-playfair text-xl font-bold text-[#8B5E3C]">Menu</span>
              <button onClick={onClose} className="text-2xl text-gray-600 hover:text-[#8B5E3C]">&times;</button>
            </div>
            <nav className="p-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#FFF8F0] text-[#8B5E3C]' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/booking"
                onClick={onClose}
                className="block mt-4 text-center px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full"
              >
                Book Now
              </NavLink>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu