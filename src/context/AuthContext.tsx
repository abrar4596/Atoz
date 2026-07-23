'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '@/services/apiClient'

interface UserType {
  _id: string
  name: string
  phone: string
  isAdmin: boolean
  loyaltyPoints: number
}

interface AuthContextType {
  user: UserType | null
  token: string | null
  loading: boolean
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string; message?: string; isAdmin?: boolean }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state to null on server, then load from localStorage on client in useEffect
  const [user, setUser] = useState<UserType | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Safely load from localStorage only on the client
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid use case for loading saved state
    const storedToken = localStorage.getItem('atoz_jwt_token')
    const storedUser = localStorage.getItem('atoz_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (phone: string, password: string) => {
    try {
      console.log('=== LOGIN START ===')
      console.log('Attempting login with phone:', phone)
      const response = await apiClient.post('/auth/login', { phone: phone.trim(), password })
      console.log('Full login response:', response)
      console.log('Login response data:', response.data)
      
      if (response.data.success || response.status === 200) {
        // Handle ALL possible token property names from backend
        const sessionToken = 
          response.data.token || 
          response.data.sessionToken || 
          response.data.jwtToken || 
          response.data.accessToken ||
          response.data.data?.token
        
        const jwtToken = 
          response.data.jwtToken || 
          response.data.accessToken || 
          response.data.token ||
          response.data.sessionToken ||
          response.data.data?.token
        
        const loggedUser = 
          response.data.user || 
          response.data.data?.user || 
          response.data.data
        
        console.log('Extracted sessionToken:', sessionToken)
        console.log('Extracted jwtToken:', jwtToken)
        console.log('Extracted user:', loggedUser)
        console.log('User isAdmin:', loggedUser?.isAdmin)

        if (!jwtToken) {
          console.error('NO TOKEN FOUND IN RESPONSE!')
          return {
            success: false,
            message: 'No authentication token received from server',
            error: 'No token received',
          }
        }

        localStorage.setItem('atoz_jwt_token', jwtToken)
        if (sessionToken) localStorage.setItem('atoz_session_token', sessionToken)
        localStorage.setItem('atoz_user', JSON.stringify(loggedUser))

        // Set the atoz_admin_session cookie - ROBUSTLY!
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString() // 1 week
        const isHttps = window.location.protocol === 'https:'
        
        // Build cookie string with all necessary attributes
        let cookieString = `atoz_admin_session=${encodeURIComponent(sessionToken || jwtToken)}; Path=/; Expires=${expires}; SameSite=Lax;`
        if (isHttps) {
          cookieString += ' Secure;'
        }
        
        document.cookie = cookieString
        console.log('Cookie string set:', cookieString)
        console.log('All cookies after set:', document.cookie)
        console.log('=== LOGIN SUCCESS ===')

        setToken(jwtToken)
        setUser(loggedUser)

        return { success: true, isAdmin: !!loggedUser?.isAdmin }
      }
      
      console.log('Login failed, response not successful')
      return {
        success: false,
        message: response.data.message || response.data.error || 'Login failed',
        error: response.data.error || response.data.message || 'Login failed',
      }
    } catch (error: unknown) {
      console.error('=== LOGIN ERROR ===')
      console.error('Login request error:', error)
      // Type guard for error object
      let errorMessage = 'Server error'
      if (error && typeof error === 'object') {
        const err = error as Record<string, any>
        console.error('Error response:', err.response)
        console.error('Error response data:', err.response?.data)
        if (err.response?.data?.message) errorMessage = err.response.data.message
        else if (err.response?.data?.error) errorMessage = err.response.data.error
        else if (err.message) errorMessage = err.message
      }
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('atoz_jwt_token')
    localStorage.removeItem('atoz_session_token')
    localStorage.removeItem('atoz_user')
    
    // Clear the atoz_admin_session cookie
    document.cookie = 'atoz_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
