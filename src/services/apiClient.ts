import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to automatically add authorization token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('atoz_jwt_token')
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiry / 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        console.warn('Session expired or invalid. Redirecting to login...')
        localStorage.removeItem('atoz_jwt_token')
        localStorage.removeItem('atoz_session_token')
        localStorage.removeItem('atoz_user')
        document.cookie = 'atoz_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;'
        
        // Avoid redirecting if we are already on the login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?error=${encodeURIComponent(
            error.response.data?.error || 'Session expired or invalid'
          )}&redirect=${encodeURIComponent(window.location.pathname)}`
        }
      }
    }
    return Promise.reject(error)
  }
)
