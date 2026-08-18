import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { useFavorites } from '../../../context/FavoritesContext'
import { useAuth } from '../../../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/design-finder', label: 'Design Finder' },
  { to: '/designs', label: 'Designs' },
  { to: '/products', label: 'Products' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

function CustomerLayout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [backToTop, setBackToTop] = useState(false)
  const { totalItems } = useCart()
  const { designIds } = useFavorites()
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Poppins, sans-serif' }}>
      {/* ==================== HEADER ==================== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled ? 'rgba(255, 248, 240, 0.97)' : 'rgba(255, 248, 240, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: isScrolled ? '12px 0' : '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '26px',
              fontWeight: '700',
              color: '#8B5E3C',
              letterSpacing: '-0.5px'
            }}>
              Waziri<span style={{ color: '#D4AF37' }}>'s</span> Henna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive ? '#8B5E3C' : '#444',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                  borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                  transition: 'all 0.2s'
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Favorites */}
            <Link to="/favorites" style={{ position: 'relative', color: '#666', textDecoration: 'none', fontSize: '18px' }}>
              <i className="far fa-heart"></i>
              {designIds.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#D4AF37',
                  color: '#fff',
                  fontSize: '10px',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600'
                }}>
                  {designIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', color: '#666', textDecoration: 'none', fontSize: '18px' }}>
              <i className="fas fa-shopping-cart"></i>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#8B5E3C',
                  color: '#fff',
                  fontSize: '10px',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Book Now Button */}
            <Link to="/booking" style={{
              display: 'none',
              padding: '12px 24px',
              background: '#D4AF37',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              borderRadius: '50px',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }} className="book-btn">
              Book Now
            </Link>

            {/* User/Admin */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button style={{
                  width: '36px',
                  height: '36px',
                  background: '#8B5E3C',
                  color: '#fff',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {user.full_name?.charAt(0) || 'U'}
                </button>
                {isAdmin && (
                  <Link to="/admin" style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    background: '#fff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    color: '#333'
                  }}>
                    Admin Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px'
                }}
              >
                <i className="far fa-user"></i>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                fontSize: '22px',
                display: 'block'
              }}
              className="mobile-menu-btn"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE MENU ==================== */}
      {mobileMenuOpen && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2000
          }} onClick={() => setMobileMenuOpen(false)} />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '300px',
            background: '#fff',
            zIndex: 2001,
            padding: '80px 30px',
            overflowY: 'auto',
            transition: 'right 0.3s'
          }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '25px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              &times;
            </button>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '14px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: isActive ? '#8B5E3C' : '#444',
                  textDecoration: 'none',
                  borderBottom: '1px solid #f0e8dd'
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/booking" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              marginTop: '20px',
              padding: '14px',
              background: '#D4AF37',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Book Now
            </Link>
          </div>
        </>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main style={{ flex: 1, marginTop: '80px' }}>
        <Outlet />
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer style={{
        background: '#222',
        color: '#ddd',
        padding: '60px 20px 25px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px'
        }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '22px', marginBottom: '15px' }}>
              Waziri<span style={{ color: '#D4AF37' }}>'s</span> Henna
            </h3>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', lineHeight: '1.7' }}>
              Elegant henna designs and premium henna products for weddings, Eid celebrations, birthdays and every special occasion.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="https://wa.me/2347048823830" target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ddd',
                textDecoration: 'none'
              }}>
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://instagram.com/ayeesharhwaxeeree001" target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ddd',
                textDecoration: 'none'
              }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="mailto:aishaabdullahiwaziri001@gmail.com" style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ddd',
                textDecoration: 'none'
              }}>
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '15px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.to} style={{ marginBottom: '10px' }}>
                  <Link to={link.to} style={{ color: '#aaa', fontSize: '14px', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '15px' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#aaa' }}>
              <li style={{ marginBottom: '10px' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#D4AF37', marginRight: '8px' }}></i>
                Kaduna, Nigeria
              </li>
              <li style={{ marginBottom: '10px' }}>
                <i className="fas fa-phone" style={{ color: '#D4AF37', marginRight: '8px' }}></i>
                +234 704 882 3830
              </li>
              <li style={{ marginBottom: '10px' }}>
                <i className="fas fa-envelope" style={{ color: '#D4AF37', marginRight: '8px' }}></i>
                aishaabdullahiwaziri001@gmail.com
              </li>
            </ul>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          color: '#888',
          fontSize: '13px'
        }}>
          <p>&copy; {new Date().getFullYear()} Waziri's Henna. All Rights Reserved. | Designed by <span style={{ color: '#D4AF37' }}>Aisha Abdullahi Waziri</span></p>
        </div>
      </footer>

      {/* ==================== WHATSAPP FLOAT ==================== */}
      <a
        href="https://wa.me/2347048823830?text=Hello%20Waziri's%20Henna!%20I'd%20like%20to%20book%20an%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: '25px',
          bottom: '25px',
          width: '56px',
          height: '56px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '28px',
          textDecoration: 'none',
          zIndex: 999,
          boxShadow: '0 5px 25px rgba(37, 211, 102, 0.3)'
        }}
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* ==================== BACK TO TOP ==================== */}
      {backToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            left: '25px',
            bottom: '25px',
            width: '48px',
            height: '48px',
            background: '#fff',
            border: '2px solid #ddd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B5E3C',
            cursor: 'pointer',
            zIndex: 998,
            fontSize: '18px',
            boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
          }}
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .book-btn { display: inline-block !important; }
        }
      `}</style>
    </div>
  )
}

export default CustomerLayout