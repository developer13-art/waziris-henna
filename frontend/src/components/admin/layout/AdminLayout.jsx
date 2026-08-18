import React, { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-chart-pie', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check' },
  { to: '/admin/customers', label: 'Customers', icon: 'fa-users' },
  { to: '/admin/designs', label: 'Designs', icon: 'fa-palette' },
  { to: '/admin/services', label: 'Services', icon: 'fa-crown' },
  { to: '/admin/products', label: 'Products', icon: 'fa-box' },
  { to: '/admin/orders', label: 'Orders', icon: 'fa-shopping-cart' },
  { to: '/admin/payments', label: 'Payments', icon: 'fa-credit-card' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'fa-star' },
  { to: '/admin/journal', label: 'Journal', icon: 'fa-book' },
  { to: '/admin/reports', label: 'Reports', icon: 'fa-chart-bar' },
  { to: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
]

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const getPageTitle = () => {
    const currentLink = sidebarLinks.find(link => 
      link.end ? location.pathname === link.to : location.pathname.startsWith(link.to)
    )
    return currentLink?.label || 'Dashboard'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '0',
        background: '#222',
        color: '#fff',
        minHeight: '100vh',
        transition: 'width 0.3s',
        overflow: 'hidden',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff' }}>
              Waziri<span style={{ color: '#D4AF37' }}>'s</span> Admin
            </h2>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          {sidebarLinks.map((link) => {
            const isActive = link.end 
              ? location.pathname === link.to 
              : location.pathname.startsWith(link.to)

            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: isActive ? '#222' : '#ccc',
                  background: isActive ? '#D4AF37' : 'transparent',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                <i className={`fas ${link.icon}`} style={{ width: '20px' }}></i>
                <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#D4AF37',
              color: '#222',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.full_name || 'Admin'}
              </p>
              <p style={{ fontSize: '11px', color: '#999' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              color: '#ccc',
              fontSize: '14px',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)'
              e.target.style.color = '#fca5a5'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none'
              e.target.style.color = '#ccc'
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i>
            <span style={{ whiteSpace: 'nowrap' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '250px' : '0', 
        transition: 'margin-left 0.3s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Top Bar */}
        <header style={{
          background: '#fff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '20px', 
                cursor: 'pointer', 
                color: '#666',
                padding: '8px'
              }}
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '600' }}>{getPageTitle()}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ 
              fontSize: '14px', 
              color: '#666', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-external-link-alt"></i>
              <span style={{ display: 'none', sm: 'inline' }}>View Website</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout