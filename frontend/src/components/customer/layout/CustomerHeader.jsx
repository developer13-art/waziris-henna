import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { useFavorites } from '../../../context/FavoritesContext'
import { useAuth } from '../../../context/AuthContext'
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

function CustomerHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { designIds } = useFavorites()
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-playfair text-2xl font-bold text-[#8B5E3C]">
                Waziri<span className="text-[#D4AF37]">'s</span> Henna
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 relative ${
                      isActive
                        ? 'text-[#8B5E3C]'
                        : 'text-gray-600 hover:text-[#8B5E3C]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
                aria-label="Favorites"
              >
                <i className="fas fa-heart text-lg"></i>
                {designIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {designIds.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
                aria-label="Cart"
              >
                <i className="fas fa-shopping-cart text-lg"></i>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#8B5E3C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Book Now Button */}
              <Link
                to="/booking"
                className="hidden md:inline-flex items-center px-6 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Book Now
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-[#8B5E3C]">
                    <div className="w-9 h-9 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-semibold">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-gray-600 hover:text-[#8B5E3C] p-2"
                  aria-label="Login"
                >
                  <i className="fas fa-user text-lg"></i>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-[#8B5E3C]"
                aria-label="Open menu"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <span className="font-playfair text-xl font-bold text-[#8B5E3C]">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl text-gray-600 hover:text-[#8B5E3C]"
                >
                  &times;
                </button>
              </div>
              <nav className="p-6 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-[#FFF8F0] text-[#8B5E3C]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 text-center px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full"
                >
                  Book Now
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default CustomerHeader