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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2 sm:py-3'
          : 'py-4 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The Barbell Assembly */}
        <div className="w-full flex items-center justify-between gap-1 sm:gap-2.5 relative">
          
          {/* Left Weight Plate (Logo Bumper Plate) */}
          {/* Deep charcoal rubber bumper plate, metallic insert hub ring, dropshadow */}
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#121212] border border-zinc-800 flex items-center justify-center relative shadow-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] select-none shrink-0 ring-4 ring-inset ring-zinc-800/80 z-20">
            {/* Metal hub insert ring */}
            <div className="absolute inset-2.5 sm:inset-3 rounded-full border-[2.5px] border-zinc-700/80 pointer-events-none" />
            
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center justify-center relative z-10 text-center"
            >
              <span className="text-base sm:text-lg font-black tracking-tighter text-white uppercase hover:text-indigo-400 transition-colors">
                AtoZ<span className="text-indigo-500 font-extrabold">.</span>
              </span>
            </Link>
          </div>

          {/* Left Barbell Collar (Silver chrome lock clip ring) */}
          <div className="w-2.5 sm:w-3.5 h-11 sm:h-14 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-550 border border-zinc-400 rounded-sm shadow-md shrink-0 z-10" />

          {/* Barbell Rod (The main shaft hosting links inside) */}
          {/* Brushed gunmetal finish, cylindrical linear gradient, inner shadow */}
          <div className="flex-1 h-9 sm:h-12 bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-850 rounded-md sm:rounded-lg flex items-center justify-center px-4 sm:px-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-2px_4px_rgba(0,0,0,0.75)] border-y border-zinc-650/40 relative z-10 mx-0.5">
            {/* Brushed metal knurling texture overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:4px_100%] opacity-20 pointer-events-none rounded-md sm:rounded-lg" />
            
            {/* Center Navigation Links (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-8 text-[10px] font-black tracking-[0.25em] uppercase drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] text-zinc-100 relative z-10">
              <Link 
                href="/#catalog-section" 
                className="hover:text-amber-400 hover:scale-102 transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-amber-400 after:transition-all"
              >
                Supplements
              </Link>
              <Link 
                href="/#catalog-section" 
                className="hover:text-amber-400 hover:scale-102 transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-amber-400 after:transition-all"
              >
                Pharmacy
              </Link>
              <Link 
                href="/#catalog-section" 
                className="hover:text-amber-400 hover:scale-102 transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-amber-400 after:transition-all"
              >
                Store Catalog
              </Link>
            </div>
            
            {/* Mobile navigation placeholder when barbell center rod is empty on mobile */}
            <div className="flex md:hidden text-[9px] font-black tracking-widest text-zinc-350 uppercase select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              AtoZ Supplement Store
            </div>
          </div>

          {/* Right Barbell Collar (Metal lock ring) */}
          <div className="w-2.5 sm:w-3.5 h-11 sm:h-14 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-550 border border-zinc-400 rounded-sm shadow-md shrink-0 z-10" />

          {/* Right Weight Plate (Actions Bumper Plate) */}
          {/* Matching charcoal bumper plate housing search, cart, user profile, and hamburger */}
          <div className="h-16 px-3.5 sm:h-20 sm:px-6 rounded-full bg-[#121212] border border-zinc-800 flex items-center justify-center relative shadow-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] select-none shrink-0 ring-4 ring-inset ring-zinc-800/80 z-20 gap-1.5 sm:gap-3">
            {/* Metal hub insert ring */}
            <div className="absolute inset-2.5 sm:inset-3 rounded-full border-[2.5px] border-zinc-700/80 pointer-events-none" />

            <div className="flex items-center gap-1 sm:gap-2.5 relative z-10">
              
              {/* Search Toggle (Desktop only inside plate) */}
              <div className={`hidden sm:flex relative items-center transition-all duration-350 ${isSearchOpen ? 'w-32 lg:w-44' : 'w-8'}`}>
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-full py-1 pl-3 pr-8 text-[10px] text-white placeholder-zinc-650 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                    autoFocus
                  />
                )}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute right-0 p-1.5 text-zinc-450 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                  aria-label="Toggle Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Cart Trigger Button */}
              <button
                onClick={toggleCart}
                className="p-1.5 text-zinc-450 hover:text-white hover:bg-white/5 rounded-full transition-all relative cursor-pointer"
                aria-label="Open Cart"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-zinc-950 text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-zinc-950 scale-90 animate-pulse shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Dropdown / Auth Menu (Desktop only) */}
              <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-3" data-user-menu>
                {!mounted || loading ? (
                  <>
                    <Link 
                      href="/login" 
                      className="flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1"
                    >
                      <User className="h-3.5 w-3.5" />
                      Sign In
                    </Link>
                  </>
                ) : user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-zinc-300 hover:text-white transition-colors py-1"
                    >
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-black border border-white/10">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Desktop User Menu Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-3 w-48 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                        <div className="p-2.5 space-y-0.5">
                          <Link 
                            href={user.isAdmin ? '/admin' : '/dashboard'} 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <User className="h-3.5 w-3.5 text-indigo-400" />
                            Dashboard
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1"
                    >
                      <User className="h-3.5 w-3.5" />
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Hamburger Menu Toggle (Mobile only inside plate) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 md:hidden text-zinc-450 hover:text-white hover:bg-white/5 rounded-full transition cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sliding Menu (styled matching iron/barbell panel) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-900 mt-2 mx-4 px-5 py-5 rounded-2xl space-y-4 animate-slide-down shadow-2xl relative z-40">
          <div className="space-y-1">
            <Link
              href="/#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-white/5 hover:text-white transition"
            >
              Supplements
            </Link>
            <Link
              href="/#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-white/5 hover:text-white transition"
            >
              Pharmacy
            </Link>
            <Link
              href="/#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-white/5 hover:text-white transition"
            >
              Store Catalog
            </Link>
          </div>
          
          <div className="border-t border-zinc-900 pt-3 flex flex-col gap-1.5">
            {!mounted || loading ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-white/5 hover:text-white transition"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >
                  Create Account
                </Link>
              </>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-850/80 mb-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-black border border-white/10">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {user.name || 'User'}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>
                <Link
                  href={user.isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/5 transition"
                >
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/5 hover:text-red-300 transition text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-white/5 hover:text-white transition"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
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
