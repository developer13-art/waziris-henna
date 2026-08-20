import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AdminLayout from './components/admin/layout/AdminLayout'
import CustomerLayout from './components/customer/layout/CustomerLayout'

// Lazy load customer pages
const HomePage = lazy(() => import('./pages/customer/HomePage'))
const AboutPage = lazy(() => import('./pages/customer/AboutPage'))
const ServicesPage = lazy(() => import('./pages/customer/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/customer/ServiceDetailPage'))
const DesignsPage = lazy(() => import('./pages/customer/DesignsPage'))
const DesignDetailPage = lazy(() => import('./pages/customer/DesignDetailPage'))
const DesignFinderPage = lazy(() => import('./pages/customer/DesignFinderPage'))
const ProductsPage = lazy(() => import('./pages/customer/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/customer/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/customer/CartPage'))
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'))
const BookingPage = lazy(() => import('./pages/customer/BookingPage'))
const BookingSuccessPage = lazy(() => import('./pages/customer/BookingSuccessPage'))
const JournalPage = lazy(() => import('./pages/customer/JournalPage'))
const ArticleDetailPage = lazy(() => import('./pages/customer/ArticleDetailPage'))
const FavoritesPage = lazy(() => import('./pages/customer/FavoritesPage'))
const ContactPage = lazy(() => import('./pages/customer/ContactPage'))
const PaymentStatusPage = lazy(() => import('./pages/customer/PaymentStatusPage'))

// Lazy load admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'))
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'))
const AdminDesignsPage = lazy(() => import('./pages/admin/AdminDesignsPage'))
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'))
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'))
const AdminJournalPage = lazy(() => import('./pages/admin/AdminJournalPage'))
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))

function Loader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#FFF8F0',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e8ddd4',
          borderTopColor: '#D4AF37',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#8B5E3C', fontSize: '18px' }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ==================== CUSTOMER ROUTES (With Layout) ==================== */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/designs/:slug" element={<DesignDetailPage />} />
          <Route path="/design-finder" element={<DesignFinderPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/success/:reference" element={<BookingSuccessPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<ArticleDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment/:status/:reference" element={<PaymentStatusPage />} />
        </Route>

        {/* ==================== ADMIN LOGIN (No Layout) ==================== */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ==================== ADMIN ROUTES (With Admin Layout) ==================== */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="designs" element={<AdminDesignsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="journal" element={<AdminJournalPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ==================== FALLBACK ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App