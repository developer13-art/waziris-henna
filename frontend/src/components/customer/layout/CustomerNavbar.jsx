import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../../context/CartContext'
import { useFavorites } from '../../../context/FavoritesContext'
import { useAuth } from '../../../context/AuthContext'

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

function CustomerNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalItems } = useCart()
  const { designIds } = useFavorites()
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-playfair text-2xl font-bold text-[#8B5E3C]">
            Waziri<span className="text-[#D4AF37]">'s</span> Henna
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative ${
                    isActive ? 'text-[#8B5E3C]' : 'text-gray-600 hover:text-[#8B5E3C]'
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

          <div className="flex items-center space-x-4">
            <Link to="/favorites" className="relative p-2 text-gray-600 hover:text-[#D4AF37]" aria-label="Favorites">
              <i className="fas fa-heart text-lg"></i>
              {designIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {designIds.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#D4AF37]" aria-label="Cart">
              <i className="fas fa-shopping-cart text-lg"></i>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#8B5E3C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to="/booking" className="hidden md:inline-flex items-center px-6 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-all">
              Book Now
            </Link>

            {user ? (
              <div className="relative group">
                <button className="w-9 h-9 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-semibold">
                  {user.full_name?.charAt(0) || 'U'}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/admin/login')} className="text-gray-600 hover:text-[#8B5E3C] p-2" aria-label="Login">
                <i className="fas fa-user text-lg"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar