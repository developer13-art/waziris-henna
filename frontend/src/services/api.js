import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 60000,
})

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('waziris_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('waziris_token')
      localStorage.removeItem('waziris_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// ==================== API ENDPOINTS ====================

export const endpoints = {
  // Upload
  upload: '/upload',

  // Auth
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',

  // Services
  services: '/services',
  serviceDetail: (id) => `/services/${id}`,

  // Designs
  designs: '/designs',
  designDetail: (id) => `/designs/${id}`,
  similarDesigns: (id) => `/designs/${id}/similar`,

  // Categories
  categories: '/categories',
  categoryDetail: (id) => `/categories/${id}`,

  // Products
  products: '/products',
  productDetail: (id) => `/products/${id}`,
  productInventory: (id) => `/products/${id}/inventory`,

  // Bookings
  bookings: '/bookings',
  bookingDetail: (id) => `/bookings/${id}`,
  bookingStatus: (id) => `/bookings/${id}/status`,

  // Orders
  orders: '/orders',
  orderDetail: (id) => `/orders/${id}`,
  orderStatus: (id) => `/orders/${id}/status`,

  // Payments
  payments: '/payments',
  paymentDetail: (id) => `/payments/${id}`,
  initializePayment: (id) => `/payments/${id}/initialize`,
  verifyPayment: (ref) => `/payments/${ref}/verify`,

  // Reviews
  reviews: '/reviews',
  reviewDetail: (id) => `/reviews/${id}`,

  // Journal
  journal: '/journal',
  journalDetail: (id) => `/journal/${id}`,

  // Dashboard
  dashboardOverview: '/dashboard',
  dashboardStats: '/dashboard/stats',
  recentBookings: '/dashboard/recent-bookings',
  recentOrders: '/dashboard/recent-orders',
  revenueData: '/dashboard/revenue',

  // Reports
  bookingReport: '/reports/bookings',
  salesReport: '/reports/sales',
  productReport: '/reports/products',
  customerReport: '/reports/customers',

  // Settings
  settings: '/settings',

  // Customers
  customers: '/customers',
  customerDetail: (id) => `/customers/${id}`,
  customerBookings: (id) => `/customers/${id}/bookings`,
  customerOrders: (id) => `/customers/${id}/orders`,
  customerFavorites: (id) => `/customers/${id}/favorites`,
}

export default api