'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // Hydration safeguard
  const { toggleCart, cartItems } = useCart()
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Hydration safeguard: set mounted to true after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isUserMenuOpen && !target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-white/5 py-3 shadow-2xl shadow-black/30'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-2 group"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase group-hover:text-indigo-400 transition-colors">
                AtoZ<span className="text-indigo-500">.</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-widest text-zinc-400 uppercase border border-zinc-800 rounded px-1.5 py-0.5 group-hover:border-indigo-500/30 group-hover:text-white transition-all">
                Store
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-zinc-350">
            <Link 
              href="/#catalog-section" 
              className="hover:text-white transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all"
            >
              Supplements
            </Link>
            <Link 
              href="/#catalog-section" 
              className="hover:text-white transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all"
            >
              Pharmacy
            </Link>
            <Link 
              href="/#catalog-section" 
              className="hover:text-white transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all"
            >
              Store Catalog
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            <div className={`relative flex items-center transition-all duration-350 ${isSearchOpen ? 'w-40 sm:w-60' : 'w-8'}`}>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  autoFocus
                />
              )}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute right-0 p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                aria-label="Toggle Search"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>

            <button
              onClick={toggleCart}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-black scale-90 animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4" data-user-menu>
              {/* Hydration fallback: render guest links until mounted */}
              {!mounted || loading ? (
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors py-1.5"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full transition-all shadow-md hover:shadow-indigo-500/20"
                  >
                    Join
                  </Link>
                </>
              ) : user ? (
                // Authenticated user menu
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-300 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/5"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-black border border-white/10">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden lg:inline-block">
                      Hi, {user.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-52 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl shadow-black/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 space-y-1">
                        <Link 
                          href={user.isAdmin ? '/admin' : '/dashboard'} 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <User className="h-4 w-4 text-indigo-400" />
                          {user.isAdmin ? 'Admin Dashboard' : 'Customer Dashboard'}
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Guest links
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors py-1.5"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full transition-all shadow-md hover:shadow-indigo-500/20"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-white/5 px-4 pt-4 pb-6 space-y-4 animate-slide-down">
          <div className="space-y-1">
            <Link
              href="/#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-white/5 hover:text-white transition"
            >
              Supplements
            </Link>
            <Link
              href="/#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-white/5 hover:text-white transition"
            >
              Pharmacy
            </Link>
            <Link
              href="/#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-white/5 hover:text-white transition"
            >
              Store Catalog
            </Link>
          </div>
          
          <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
            {/* Hydration fallback: render guest links until mounted */}
            {!mounted || loading ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-sm font-semibold transition"
                >
                  Create Account
                </Link>
              </>
            ) : user ? (
              // Authenticated mobile UI
              <>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-black border border-white/10">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {user.name || 'User'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>
                <Link
                  href={user.isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition"
                >
                  <User className="h-4 w-4 text-indigo-400" />
                  {user.isAdmin ? 'Admin Dashboard' : 'Customer Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/5 hover:text-red-300 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              // Guest mobile UI
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-sm font-semibold transition"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
