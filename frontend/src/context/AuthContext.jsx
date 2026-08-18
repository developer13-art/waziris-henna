import React, { createContext, useContext, useState, useEffect } from 'react'
import api, { endpoints } from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage synchronously before rendering
    const savedToken = localStorage.getItem('waziris_token')
    const savedUser = localStorage.getItem('waziris_user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('waziris_token')
        localStorage.removeItem('waziris_user')
      }
    }
    
    // Set isLoading to false immediately after loading from localStorage
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post(endpoints.login, { email, password })
      
      if (response.success) {
        const { user, token } = response.data
        
        setUser(user)
        setToken(token)
        
        localStorage.setItem('waziris_token', token)
        localStorage.setItem('waziris_user', JSON.stringify(user))
        
        toast.success('Login successful!')
        return { success: true, user }
      }
      
      toast.error(response.message || 'Login failed')
      return { success: false }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('waziris_token')
    localStorage.removeItem('waziris_user')
    toast.info('Logged out successfully')
  }

  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext