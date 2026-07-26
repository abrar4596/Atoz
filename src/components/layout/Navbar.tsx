'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

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

  const [isMobile, setIsMobile] = useState(false)

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Responsive device check to selectively disable 3D rotations on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Framer Motion Scroll Progress Hooks
  const { scrollYProgress } = useScroll()

  // 1. Z-axis tilt (dipping left down to -20deg in first 33% scroll)
  const rawRotateZ = useTransform(scrollYProgress, [0, 0.33, 1], ["0deg", "-20deg", "0deg"])
  // 2. X-axis roll (360-degree cylindrical rolling animation forward between 33% and 100% scroll)
  const rawRotateX = useTransform(scrollYProgress, [0, 0.33, 1], ["0deg", "0deg", "360deg"])

  // Conditionally disable dynamic 3D rotations on mobile screen widths to avoid overflow
  const rotateZ = useTransform(rawRotateZ, (v) => isMobile ? "0deg" : v)
  const rotateX = useTransform(rawRotateX, (v) => isMobile ? "0deg" : v)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full h-[120px] flex items-center justify-center pointer-events-none bg-transparent">
      {/* Animated Barbell Wrapper */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto transform-gpu"
        style={{
          rotateZ,
          rotateX,
          transformPerspective: 1200,
          transformOrigin: 'center center',
        }}
      >
        {/* The Barbell Assembly */}
        <div className="w-full flex items-center justify-between gap-1 sm:gap-2.5 relative">
          
          {/* Left Sleeve Tip (Threaded steel sleeve housing logo) */}
          <div className="h-9 w-20 sm:h-11 sm:w-24 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-500 border border-zinc-400 rounded-l-lg flex items-center justify-center shadow-lg relative shrink-0 z-30">
            {/* Thread ridges visual details */}
            <div className="absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:4px_100%] opacity-45 pointer-events-none rounded-l-lg" />
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="relative z-10 font-black text-xs text-zinc-950 tracking-tighter uppercase"
            >
              ATOZ<span className="text-indigo-650">.</span>
            </Link>
          </div>

          {/* Left Plate 2 (Outer Olympic Plate - Tall & Slim Bumper) */}
          <div className="w-2.5 h-16 sm:w-3.5 sm:h-28 bg-gradient-to-b from-zinc-800 via-zinc-700 via-zinc-800 to-zinc-950 rounded-sm border-y border-x border-zinc-800 shadow-md shrink-0 z-25" />

          {/* Left Plate 1 (Inner Olympic Plate - Tall & Slim Bumper) */}
          <div className="w-2.5 h-16 sm:w-3.5 sm:h-28 bg-gradient-to-b from-zinc-800 via-zinc-700 via-zinc-800 to-zinc-950 rounded-sm border-y border-x border-zinc-800 shadow-md shrink-0 z-25" />

          {/* Left Barbell Collar (Sleeve Stop) */}
          <div className="w-2 sm:w-3 h-11 sm:h-14 bg-gradient-to-b from-zinc-350 via-zinc-150 to-zinc-550 border border-zinc-400 rounded-sm shadow-md shrink-0 z-10 relative">
            {/* Collar Screw Bolt Pin */}
            <div className="w-1 h-2.5 bg-zinc-800 border border-zinc-750 absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-xs shadow-xs" />
          </div>

          {/* Barbell Rod (The main silver shaft housing links) */}
          <div className="flex-1 h-7 sm:h-9 bg-gradient-to-b from-zinc-300 via-zinc-100 via-zinc-200 to-zinc-450 border-y border-zinc-350 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-2px_3px_rgba(0,0,0,0.3)] relative mx-0.5 z-10 flex items-center justify-center">
            {/* Knurled grip visual patterns (left, middle, right) */}
            <div className="absolute left-4 w-12 sm:w-20 h-full bg-[linear-gradient(45deg,#b5b5ba_25%,transparent_25%),linear-gradient(-45deg,#b5b5ba_25%,transparent_25%)] bg-[length:4px_4px] opacity-25 pointer-events-none" />
            <div className="absolute right-4 w-12 sm:w-20 h-full bg-[linear-gradient(45deg,#b5b5ba_25%,transparent_25%),linear-gradient(-45deg,#b5b5ba_25%,transparent_25%)] bg-[length:4px_4px] opacity-25 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 w-16 sm:w-28 h-full bg-[linear-gradient(45deg,#b5b5ba_25%,transparent_25%),linear-gradient(-45deg,#b5b5ba_25%,transparent_25%)] bg-[length:4px_4px] opacity-25 pointer-events-none" />

            {/* Center Navigation Links (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-8 text-[10px] font-black tracking-[0.25em] uppercase text-zinc-900 relative z-10 drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.5)]">
              <Link 
                href="/#catalog-section" 
                className="hover:text-indigo-750 hover:scale-102 transition-all py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all duration-300"
              >
                Supplements
              </Link>
              <Link 
                href="/#catalog-section" 
                className="hover:text-indigo-750 hover:scale-102 transition-all py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all duration-300"
              >
                Pharmacy
              </Link>
              <Link 
                href="/#catalog-section" 
                className="hover:text-indigo-750 hover:scale-102 transition-all py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all duration-300"
              >
                Store Catalog
              </Link>
            </div>
            
            {/* Mobile navigation placeholder */}
            <div className="flex md:hidden text-[9px] font-extrabold tracking-widest text-zinc-800 uppercase select-none drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.5)]">
              AtoZ Supplement Store
            </div>
          </div>

          {/* Right Barbell Collar (Sleeve Stop) */}
          <div className="w-2 sm:w-3 h-11 sm:h-14 bg-gradient-to-b from-zinc-355 via-zinc-150 to-zinc-550 border border-zinc-400 rounded-sm shadow-md shrink-0 z-10 relative">
            {/* Collar Screw Bolt Pin */}
            <div className="w-1.5 h-2.5 bg-zinc-800 border border-zinc-750 absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-xs shadow-xs" />
          </div>

          {/* Right Plate 1 (Inner Olympic Plate - Tall & Slim Bumper) */}
          <div className="w-2.5 h-16 sm:w-3.5 sm:h-28 bg-gradient-to-b from-zinc-800 via-zinc-750 via-zinc-800 to-zinc-950 rounded-sm border-y border-x border-zinc-800 shadow-md shrink-0 z-25" />

          {/* Right Plate 2 (Outer Olympic Plate - Tall & Slim Bumper) */}
          <div className="w-2.5 h-16 sm:w-3.5 sm:h-28 bg-gradient-to-b from-zinc-800 via-zinc-750 via-zinc-800 to-zinc-950 rounded-sm border-y border-x border-zinc-800 shadow-md shrink-0 z-25" />

          {/* Right Sleeve Tip (Threaded steel sleeve housing actions) */}
          <div className="h-9 px-3 sm:h-11 sm:px-5 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-500 border border-zinc-400 rounded-r-lg flex items-center justify-center shadow-lg relative shrink-0 gap-1.5 sm:gap-2.5 z-30">
            {/* Thread ridges visual details */}
            <div className="absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:4px_100%] opacity-45 pointer-events-none rounded-r-lg" />
            
            <div className="flex items-center gap-1 sm:gap-2.5 relative z-10">
              
              {/* Search Toggle (Desktop only) */}
              <div className={`hidden sm:flex relative items-center transition-all duration-350 ${isSearchOpen ? 'w-24 lg:w-36' : 'w-8'}`}>
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-955/95 border border-zinc-700 rounded-full py-0.5 pl-3 pr-7 text-[10px] text-white placeholder-zinc-500 focus:outline-hidden focus:border-zinc-800 focus:ring-1 focus:ring-zinc-850/20 transition-all font-semibold"
                    autoFocus
                  />
                )}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute right-0 p-1 text-zinc-900 hover:text-indigo-800 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                  aria-label="Toggle Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Cart Trigger Button */}
              <button
                onClick={toggleCart}
                className="p-1 text-zinc-900 hover:text-indigo-800 hover:bg-black/5 rounded-full transition-all relative cursor-pointer"
                aria-label="Open Cart"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-indigo-650 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-zinc-300 scale-90 animate-pulse shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Dropdown / Auth Menu (Desktop only) */}
              <div className="hidden md:flex items-center gap-2 border-l border-zinc-400 pl-2" data-user-menu>
                {!mounted || loading ? (
                  <>
                    <Link 
                      href="/login" 
                      className="flex items-center gap-0.5 text-[9px] font-black tracking-wider uppercase text-zinc-800 hover:text-indigo-850 transition-colors py-0.5"
                    >
                      <User className="h-3.5 w-3.5" />
                      Sign In
                    </Link>
                  </>
                ) : user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1 text-[9px] font-black tracking-wider uppercase text-zinc-800 hover:text-indigo-850 transition-colors py-0.5"
                    >
                      <div className="h-6.5 w-6.5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-[9px] font-black border border-zinc-400">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Desktop User Menu Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-3 w-48 bg-zinc-955/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
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
                      className="flex items-center gap-0.5 text-[9px] font-black tracking-wider uppercase text-zinc-800 hover:text-indigo-850 transition-colors py-0.5"
                    >
                      <User className="h-3.5 w-3.5" />
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Hamburger Menu Toggle (Mobile only) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 text-zinc-900 hover:text-indigo-850 hover:bg-black/5 rounded-full transition cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

            </div>
          </div>

        </div>
      </motion.div>

      {/* Mobile Sliding Menu (decoupled sibling styled with absolute positioning & glassmorphism) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 w-full z-50 pointer-events-auto bg-black/95 backdrop-blur-md border-t border-zinc-900 px-6 py-6 space-y-4 shadow-2xl"
          >
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
                    className="w-full text-center py-2 bg-indigo-650 hover:bg-indigo-550 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
                  >
                    Create Account
                  </Link>
                </>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-850/80 mb-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-650 flex items-center justify-center text-white text-[10px] font-black border border-white/10">
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
                    className="w-full text-center py-2 bg-indigo-650 hover:bg-indigo-550 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
