'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Sparkles, Pill, Activity, ArrowRight, ShieldCheck, Zap, ChevronDown } from 'lucide-react'
import ProductGrid from './ProductGrid'

export default function FrontPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Track responsive screen size (breakpoint at 768px)
  const [isMobile, setIsMobile] = useState(false)
  
  // Image cache and total frame count (51 frames exported in both folders)
  const TOTAL_FRAMES = 51
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameIndex = useRef(1)

  // 1. Detect screen size layout changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize, { passive: true })
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 2. Setup Framer Motion scroll tracker on the main parent container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map scroll progress (0 to 1) to frame indices (1 to 51)
  const frameIndexValue = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES])

  // Helper function to draw an image centered and scaled like "background-size: cover"
  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas
    const imgRatio = img.width / img.height
    const canvasRatio = canvas.width / canvas.height

    let drawWidth = canvas.width
    let drawHeight = canvas.height
    let offsetX = 0
    let offsetY = 0

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas viewport
      drawWidth = canvas.height * imgRatio
      offsetX = (canvas.width - drawWidth) / 2
    } else {
      // Image is taller than canvas viewport
      drawHeight = canvas.width / imgRatio
      offsetY = (canvas.height - drawHeight) / 2
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }

  // Draw a specific frame onto the canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imagesRef.current[index - 1]
    if (img && img.complete) {
      drawImageCover(ctx, img)
    } else {
      // Fallback: If image isn't loaded in cache yet, load it dynamically and draw
      const folder = isMobile ? 'atozBG2' : 'atozBG1'
      const tempImg = new Image()
      tempImg.src = `/${folder}/ezgif-frame-${String(index).padStart(3, '0')}.jpg`
      tempImg.onload = () => {
        imagesRef.current[index - 1] = tempImg
        // Ensure index matches current scrub value
        if (index === currentFrameIndex.current) {
          drawImageCover(ctx, tempImg)
        }
      }
    }
  }

  // 3. Preload all image frames on screen resize/mode change to prevent flickering
  useEffect(() => {
    const folder = isMobile ? 'atozBG2' : 'atozBG1'
    const loadedImages: HTMLImageElement[] = []

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/${folder}/ezgif-frame-${String(i).padStart(3, '0')}.jpg`
      img.onload = () => {
        // Redraw first frame as soon as it becomes available
        if (i === 1 && currentFrameIndex.current === 1) {
          drawFrame(1)
        }
      }
      loadedImages.push(img)
    }

    imagesRef.current = loadedImages

    // Force canvas resize and initial draw
    handleResize()
  }, [isMobile])

  // Resize canvas viewport dimensions to match screen and redraw active frame
  const handleResize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    drawFrame(currentFrameIndex.current)
  }

  // Resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  // 4. Scrub scroll values and trigger canvas drawings on requestAnimationFrame
  useMotionValueEvent(frameIndexValue, 'change', (latestValue) => {
    const roundedIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latestValue)))
    if (roundedIndex !== currentFrameIndex.current) {
      currentFrameIndex.current = roundedIndex
      requestAnimationFrame(() => drawFrame(roundedIndex))
    }
  })

  // 5. Scroll-Triggered Text Exit & Entry Animations
  // Section 1 (Hero): Visible at start, exits around 12% - 25% scroll progress
  const s1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.25], [1, 1, 0])
  const s1Y = useTransform(scrollYProgress, [0, 0.12, 0.25], [0, 0, -50])
  const s1BlurValue = useTransform(scrollYProgress, [0, 0.12, 0.25], [0, 0, 10])
  const s1Filter = useTransform(s1BlurValue, (b) => `blur(${b}px)`)

  // Section 2 (Spotlight): Enters at 22%, stays until 48%, exits by 58%
  const s2Opacity = useTransform(scrollYProgress, [0.22, 0.32, 0.48, 0.58], [0, 1, 1, 0])
  const s2Y = useTransform(scrollYProgress, [0.22, 0.32, 0.48, 0.58], [50, 0, 0, -50])
  const s2BlurValue = useTransform(scrollYProgress, [0.22, 0.32, 0.48, 0.58], [10, 0, 0, 10])
  const s2Filter = useTransform(s2BlurValue, (b) => `blur(${b}px)`)

  // Section 3 (Catalog Intro): Enters at 55%, stays until 78%, exits by 88%
  const s3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.78, 0.88], [0, 1, 1, 0])
  const s3Y = useTransform(scrollYProgress, [0.55, 0.65, 0.78, 0.88], [50, 0, 0, -50])
  const s3BlurValue = useTransform(scrollYProgress, [0.55, 0.65, 0.78, 0.88], [10, 0, 0, 10])
  const s3Filter = useTransform(s3BlurValue, (b) => `blur(${b}px)`)

  // Scroll to catalog section anchor
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white selection:bg-indigo-500/30">
      
      {/* Fixed Fullscreen Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none" 
      />

      {/* Cinematic Overlays to provide high-contrast readability */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/45 to-zinc-950/65 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-gradient from-transparent to-black/75 z-0 pointer-events-none" />

      {/* Sticky Text Scrubbing Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        
        {/* Section 1: Hero Banner */}
        <motion.div 
          style={{ opacity: s1Opacity, y: s1Y, filter: s1Filter }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-4 pointer-events-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-350 shadow-lg mb-6 sm:mb-8">
            <Activity className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            Premium Performance & Wellness
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl mb-6">
            Smarter Fuel<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-white">
              Stronger Health
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-350 max-w-xl leading-relaxed mb-8 sm:mb-10 drop-shadow-md">
            Engineered for high-performing athletes and daily wellness. Get professional supplements and certified medicines delivered directly to your doorstep.
          </p>

          {/* CTAs */}
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
              <Pill className="h-4.5 w-4.5 text-emerald-450" />
              Shop Pharmacy / Medicines
            </button>
          </div>

          {/* Scroll Prompt */}
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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-350 shadow-lg mb-6 sm:mb-8">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            100% Authentic Guarantee
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl mb-6">
            Zero Counterfeit<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 to-indigo-300">
              Certified Brands
            </span>
          </h2>

          {/* Text */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-350 max-w-2xl leading-relaxed mb-10 drop-shadow-md">
            We purchase directly from verified pharmaceutical distributors and premium supplement manufacturers. Every product has batch-level tracing and QR verification checks.
          </p>

          {/* Key Selling Cards Grid */}
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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-350 shadow-lg mb-6 sm:mb-8">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            Live Catalog Status
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl mb-6">
            Real-Time<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-zinc-250">
              Inventory Check
            </span>
          </h2>

          {/* Text */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-350 max-w-xl leading-relaxed mb-8 drop-shadow-md">
            Browse active stocks of vitamins, proteins, amino acids, and accessories immediately available for pickup or instant local delivery.
          </p>

          {/* Prompt to scroll to catalog */}
          <button
            onClick={scrollToCatalog}
            className="group flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/30 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:shadow-indigo-500/20"
          >
            Explore Catalog Grid
            <ChevronDown className="h-4.5 w-4.5 transition-transform group-hover:translate-y-0.5" />
          </button>
        </motion.div>

      </div>

      {/* Spacer to allow scrubbing of background frames */}
      <div className="h-[200vh] pointer-events-none" />

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
