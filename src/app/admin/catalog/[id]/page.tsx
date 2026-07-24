'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Tag,
  Calendar,
  Layers,
  Hash,
  Package,
  Sparkles,
  Info,
  DollarSign,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { fetchProductPreview } from '@/services/adminApi'
import { formatCurrency } from '@/lib/utils'

interface ProductDetails {
  _id: string
  name: string
  sku: string
  description: string
  price: number
  brand: string
  imageUrl?: string
  imageUrls?: string[]
  category: string
  flavourTags: string[]
  distributorId?: string
}

interface InventoryDetails {
  _id: string
  productId: string
  batchNumber: string
  stockQuantity: number
  expiryDate: string
  status: string
  createdAt: string
  updatedAt: string
}

interface ProductPreviewResponse {
  success: boolean
  product: ProductDetails
  inventory: InventoryDetails | null
}

export default function ProductPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)

  const [data, setData] = useState<ProductPreviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string>('')

  useEffect(() => {
    async function loadPreview() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchProductPreview(id)
        if (res.success) {
          setData(res)
          // Set initial active image
          const defaultImage = res.product.imageUrls?.[0] || res.product.imageUrl || ''
          setActiveImage(defaultImage)
        } else {
          setError(res.error || 'Failed to retrieve product details.')
        }
      } catch (err: any) {
        console.error('Error fetching preview data:', err)
        const msg = err.response?.data?.error || err.message || 'Failed to connect to preview API.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadPreview()
    }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/catalog"
          className="inline-flex items-center gap-2 text-sm text-zinc-550 hover:text-zinc-950 font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8 text-zinc-100 shadow-2xl relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-800 rounded-md" />
                <div className="h-8 w-64 bg-zinc-800 rounded-md" />
              </div>
              <div className="h-8 w-24 bg-zinc-800 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="aspect-square bg-zinc-900 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 rounded-xl" />
                  ))}
                </div>
                <div className="h-16 bg-zinc-900 rounded-2xl" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-60 bg-zinc-900 rounded-2xl" />
                <div className="h-40 bg-zinc-900 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/catalog"
          className="inline-flex items-center gap-2 text-sm text-zinc-555 hover:text-zinc-950 font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-rose-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Error Auditing Product</h3>
              <p className="text-sm mt-1">{error || 'Product information could not be resolved from the database.'}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-sm font-semibold transition shadow"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { product, inventory } = data
  const hasImages = product.imageUrls && product.imageUrls.length > 0
  const images = hasImages
    ? product.imageUrls!
    : product.imageUrl
      ? [product.imageUrl]
      : ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600']

  // Determine inventory stock level alert color and badge status
  const stock = inventory?.stockQuantity ?? 0
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock < 10

  const statusLabel = isOutOfStock ? 'Out of Stock' : 'Active'
  const statusBadgeClass = isOutOfStock
    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
    : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'

  const stockBadgeTextClass = isOutOfStock
    ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
    : isLowStock
      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
      : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'

  return (
    <div className="space-y-6">
      {/* Dynamic Navigation */}
      <Link
        href="/admin/catalog"
        className="inline-flex items-center gap-2 text-sm text-zinc-550 hover:text-zinc-950 font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      {/* Main Glassmorphic Wrapper */}
      <div className="bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-6 mb-8 gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Supplement Audit</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">{product.name}</h1>
          </div>
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusBadgeClass} shadow-inner`}>
            {statusLabel}
          </span>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Column: Media Gallery & Pricing */}
          <div className="lg:col-span-1 space-y-6">
            <div className="aspect-square bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 flex items-center justify-center relative overflow-hidden group shadow-inner">
              <img
                src={activeImage || images[0]}
                alt={product.name}
                className="object-contain max-h-full max-w-full rounded-xl transition duration-500 transform group-hover:scale-102"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600'
                }}
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`aspect-square rounded-xl overflow-hidden border bg-zinc-900 transition flex items-center justify-center p-1 cursor-pointer ${
                      activeImage === imgUrl ? 'border-amber-500 shadow-md shadow-amber-500/10' : 'border-zinc-800 hover:border-zinc-650'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="object-contain max-h-full max-w-full rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=120'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Premium Price Box */}
            <div className="p-5 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-amber-500" /> Catalog Price
                </span>
                <div className="text-3xl font-black text-white tracking-tight">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                INR (₹)
              </span>
            </div>
          </div>

          {/* Right Column: Information Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Product Specifications */}
            <div className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-xl space-y-5">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white tracking-wide">Product Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Brand Name</span>
                  <p className="text-sm font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-850 px-3.5 py-2.5 rounded-xl">
                    {product.brand}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">SKU Code</span>
                  <p className="text-sm font-bold text-zinc-200 font-mono bg-zinc-900/80 border border-zinc-850 px-3.5 py-2.5 rounded-xl uppercase tracking-wider">
                    {product.sku}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-zinc-500" /> Category
                  </span>
                  <p className="text-sm font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-850 px-3.5 py-2.5 rounded-xl">
                    {product.category}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Flavour Tags</span>
                  <div className="flex flex-wrap gap-1.5 bg-zinc-900/80 border border-zinc-850 px-3 py-2 rounded-xl min-h-[46px] items-center">
                    {product.flavourTags && product.flavourTags.length > 0 ? (
                      product.flavourTags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-2.5 py-0.5 rounded-full text-xs font-bold"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-550 text-xs italic pl-1">No flavour tags assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-zinc-500" /> Product Description
                </span>
                <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/80 border border-zinc-850 px-4 py-3.5 rounded-xl whitespace-pre-wrap">
                  {product.description || 'No description provided.'}
                </div>
              </div>
            </div>

            {/* Card 2: Inventory & Expiry Records */}
            <div className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-xl space-y-5">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h3 className="font-extrabold text-base text-white tracking-wide">Inventory Profile</h3>
              </div>

              {inventory ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-zinc-500" /> Batch Number
                    </span>
                    <p className="text-sm font-bold text-zinc-200 font-mono bg-zinc-900/80 border border-zinc-850 px-3.5 py-2.5 rounded-xl">
                      {inventory.batchNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" /> Expiry Date
                    </span>
                    <p className="text-sm font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-850 px-3.5 py-2.5 rounded-xl">
                      {inventory.expiryDate
                        ? new Date(inventory.expiryDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No expiry date set'}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-zinc-500" /> Stock Quantity
                    </span>
                    <div className={`px-4 py-2 rounded-xl text-center leading-none flex items-center justify-between h-[46px] border ${stockBadgeTextClass}`}>
                      <span className="text-lg font-black">{stock}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {isOutOfStock ? 'OUT' : isLowStock ? 'LOW' : 'OK'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 text-center flex flex-col items-center justify-center space-y-2">
                  <Package className="h-8 w-8 text-zinc-500 animate-pulse" />
                  <p className="text-sm text-zinc-400 font-medium">No inventory or batch record exists for this product Supplement SKU.</p>
                  <p className="text-xs text-zinc-550">Go to the edit screen to seed or replenish stock levels.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
