'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Transition background state once scrolled past top
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
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase group-hover:text-indigo-400 transition-colors">
                AtoZ<span className="text-indigo-500">.</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-widest text-zinc-400 uppercase border border-zinc-800 rounded px-1.5 py-0.5 group-hover:border-indigo-500/30 group-hover:text-white transition-all">
                Store
              </span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-zinc-355">
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

          {/* Action Icons Panel */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Input Toggle */}
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

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-black scale-90">
                2
              </span>
            </Link>

            {/* Profile / Account / Sign In (Desktop) */}
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4">
              <Link 
                href="/signin" 
                className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors py-1.5"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full transition-all shadow-md hover:shadow-indigo-500/20"
              >
                Join
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Drawer Menu */}
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
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-355 hover:bg-white/5 hover:text-white transition"
            >
              Store Catalog
            </Link>
          </div>
          
          {/* Mobile Auth Access */}
          <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
            <Link
              href="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-sm font-semibold transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
