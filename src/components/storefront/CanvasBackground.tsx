'use client'

import { useEffect, useRef, useState } from 'react'
import { useTransform, useMotionValueEvent, MotionValue } from 'framer-motion'

interface CanvasBackgroundProps {
  scrollYProgress: MotionValue<number>
}

export default function CanvasBackground({ scrollYProgress }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const TOTAL_FRAMES = 51
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameIndex = useRef(1)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize, { passive: true })
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const frameIndexValue = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES])

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas
    const imgRatio = img.width / img.height
    const canvasRatio = canvas.width / canvas.height

    let drawWidth = canvas.width
    let drawHeight = canvas.height
    let offsetX = 0
    let offsetY = 0

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio
      offsetX = (canvas.width - drawWidth) / 2
    } else {
      drawHeight = canvas.width / imgRatio
      offsetY = (canvas.height - drawHeight) / 2
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imagesRef.current[index - 1]
    if (img && img.complete) {
      drawImageCover(ctx, img)
    } else {
      const folder = isMobile ? 'atozBG2' : 'atozBG1'
      const tempImg = new Image()
      tempImg.src = `/${folder}/ezgif-frame-${String(index).padStart(3, '0')}.jpg`
      tempImg.onload = () => {
        imagesRef.current[index - 1] = tempImg
        if (index === currentFrameIndex.current) {
          drawImageCover(ctx, tempImg)
        }
      }
    }
  }

  useEffect(() => {
    const folder = isMobile ? 'atozBG2' : 'atozBG1'
    const loadedImages: HTMLImageElement[] = []

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/${folder}/ezgif-frame-${String(i).padStart(3, '0')}.jpg`
      img.onload = () => {
        if (i === 1 && currentFrameIndex.current === 1) {
          drawFrame(1)
        }
      }
      loadedImages.push(img)
    }

    imagesRef.current = loadedImages
    handleResize()
  }, [isMobile])

  const handleResize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    drawFrame(currentFrameIndex.current)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  useMotionValueEvent(frameIndexValue, 'change', (latestValue) => {
    const roundedIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latestValue)))
    if (roundedIndex !== currentFrameIndex.current) {
      currentFrameIndex.current = roundedIndex
      requestAnimationFrame(() => drawFrame(roundedIndex))
    }
  })

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none" 
      />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/45 to-zinc-950/65 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-gradient from-transparent to-black/75 z-0 pointer-events-none" />
    </>
  )
}
