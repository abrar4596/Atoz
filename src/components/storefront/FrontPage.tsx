'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Pill, Activity, ArrowRight, ShieldCheck, Zap, ChevronDown } from 'lucide-react'
import ProductGrid from './ProductGrid'
import CanvasBackground from './CanvasBackground'

export default function FrontPage() {
  const scrubContainerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: scrubContainerRef,
    offset: ['start start', 'end end'],
  })

  // Scroll-Triggered Text Exit & Entry Animations
  const s1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.25], [1, 1, 0])
  const s1Y = useTransform(scrollYProgress, [0, 0.12, 0.25], [0, 0, -50])
  const s1BlurValue = useTransform(scrollYProgress, [0, 0.12, 0.25], [0, 0, 10])
  const s1Filter = useTransform(s1BlurValue, (b) => `blur(${b}px)`)

  const s2Opacity = useTransform(scrollYProgress, [0.22, 0.32, 0.48, 0.58], [0, 1, 1, 0])
  const s2Y = useTransform(scrollYProgress, [0.22, 0.32, 0.48, 0.58], [50, 0, 0, -50])
  const s2BlurValue = useTransform(scrollYProgress, [0.22, 0.32, 0.48, 0.58], [10, 0, 0, 10])
  const s2Filter = useTransform(s2BlurValue, (b) => `blur(${b}px)`)

  const s3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.78, 0.88], [0, 1, 1, 0])
  const s3Y = useTransform(scrollYProgress, [0.55, 0.65, 0.78, 0.88], [50, 0, 0, -50])
  const s3BlurValue = useTransform(scrollYProgress, [0.55, 0.65, 0.78, 0.88], [10, 0, 0, 10])
  const s3Filter = useTransform(s3BlurValue, (b) => `blur(${b}px)`)

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-indigo-500/30">
      
      <div ref={scrubContainerRef} className="relative w-full">
        <CanvasBackground scrollYProgress={scrollYProgress} />

        {/* Sticky Text Scrubbing Container */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pointer-events-none">
          
          {/* Section 1: Hero Banner */}
          <motion.div 
            style={{ opacity: s1Opacity, y: s1Y, filter: s1Filter }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-4 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-350 shadow-lg mb-6 sm:mb-8">
              <Activity className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              Premium Performance & Wellness
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl mb-6">
              Smarter Fuel<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-white">
                Stronger Health
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-zinc-350 max-w-xl leading-relaxed mb-8 sm:mb-10 drop-shadow-md">
              Engineered for high-performing athletes and daily wellness. Get professional supplements and certified medicines delivered directly to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <button
                onClick={scrollToCatalog}
                className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-white hover:bg-zinc-200 text-black text-sm sm:text-base font-extrabold rounded-full transition-all duration-300 shadow-xl hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="h-4.5 w-4.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                Shop Supplements
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToCatalog}
                className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 hover:border-white/20 text-white text-sm sm:text-base font-extrabold rounded-full backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <Pill className="h-4.5 w-4.5 text-emerald-500" />
                Shop Pharmacy / Medicines
              </button>
            </div>

            <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-zinc-500">
              <span className="text-[10px] font-bold tracking-widest uppercase mb-1">Scroll to Scrub</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Section 2: Product Authenticity/Spotlight */}
          <motion.div 
            style={{ opacity: s2Opacity, y: s2Y, filter: s2Filter }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-4 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-350 shadow-lg mb-6 sm:mb-8">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              100% Authentic Guarantee
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl mb-6">
              Zero Counterfeit<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-300">
                Certified Brands
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-zinc-350 max-w-2xl leading-relaxed mb-10 drop-shadow-md">
              We purchase directly from verified pharmaceutical distributors and premium supplement manufacturers. Every product has batch-level tracing and QR verification checks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-md text-left">
                <Sparkles className="h-5 w-5 text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">Third-Party Tested</h4>
                <p className="text-xs text-zinc-400 mt-1">Verified pure formula containing exactly what the label specifies.</p>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-md text-left">
                <Activity className="h-5 w-5 text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">Temp Controlled</h4>
                <p className="text-xs text-zinc-400 mt-1">Stored in cold chambers to maintain supplement potency and shelf life.</p>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-md text-left">
                <Zap className="h-5 w-5 text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">10-min Store Pickup</h4>
                <p className="text-xs text-zinc-400 mt-1">Reserve supplements online, pick up in store in less than 10 minutes.</p>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Live Catalog Intro */}
          <motion.div 
            style={{ opacity: s3Opacity, y: s3Y, filter: s3Filter }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-3xl mx-auto px-4 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-350 shadow-lg mb-6 sm:mb-8">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              Live Catalog Status
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl mb-6">
              Real-Time<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-zinc-200">
                Inventory Check
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-zinc-350 max-w-xl leading-relaxed mb-8 drop-shadow-md">
              Browse active stocks of vitamins, proteins, amino acids, and accessories immediately available for pickup or instant local delivery.
            </p>

            <button
              onClick={scrollToCatalog}
              className="group flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/30 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:shadow-indigo-500/20"
            >
              Explore Catalog Grid
              <ChevronDown className="h-4.5 w-4.5 transition-transform group-hover:translate-y-0.5" />
            </button>
          </motion.div>

        </div>

        <div className="h-[200vh] pointer-events-none" />
      
      </div>

      {/* Main Catalog Section - Rolls up over the canvas background */}
      <div className="relative z-10 bg-zinc-950 border-t border-white/5 py-16">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-950/15 via-transparent to-transparent -z-10" />
        <div id="catalog-section" className="scroll-mt-24">
          <ProductGrid />
        </div>
      </div>
      
    </div>
  )
}
