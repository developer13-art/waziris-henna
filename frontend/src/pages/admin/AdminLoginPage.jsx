import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        toast.error('Access denied. Admin only.')
      }
    }

    setIsLoading(false)
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Waziri's Henna</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF1E6] to-[#FFF8F0] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <h1 className="font-playfair text-3xl font-bold text-[#8B5E3C]">
                  Waziri<span className="text-[#D4AF37]">'s</span> Henna
                </h1>
              </Link>
              <p className="text-gray-500 mt-2 text-sm">Admin Dashboard Login</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-semibold text-sm mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@wazirishenna.com"
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sm mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#8B5E3C] text-white font-bold rounded-xl hover:bg-[#6B4423] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-gray-500 hover:text-[#8B5E3C] transition-colors">
                <i className="fas fa-arrow-left mr-1"></i> Back to Website
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default AdminLoginPage