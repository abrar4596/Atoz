'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, User, ShoppingBag, Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="relative z-20 bg-black/80 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Trust */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                AtoZ<span className="text-indigo-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Premium gym supplements and authentic pharmacy essentials, delivered locally.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/#catalog-section"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Shop Supplements
              </Link>
              <Link
                href="/#catalog-section"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Shop Pharmacy
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Customer Dashboard
              </Link>
              <Link
                href="#"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cart
              </Link>
            </div>
          </div>

          {/* Column 3: Customer Service & Local Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Shipping & Local Delivery
              </Link>
              <Link
                href="#"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                In-Store Pickup
              </Link>
              <Link
                href="#"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Return Policy
              </Link>
              <Link
                href="#"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>Hospital Chowk, Amahiya Road</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Phone className="h-4 w-4 shrink-0 text-indigo-400" />
                <a href="tel:+9911411414" className="hover:text-white transition-colors">
                  (909) 841-1414
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Mail className="h-4 w-4 shrink-0 text-indigo-400" />
                <a href="mailto:arizkhaan.0607@gmail.com" className="hover:text-white transition-colors">
                  arizkhaan.0607@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-900/70 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  className="bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-500/20"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Social Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            © 2026 AtoZ. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Check className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
