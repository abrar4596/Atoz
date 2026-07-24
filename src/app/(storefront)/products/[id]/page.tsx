'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Tag,
  DollarSign,
  Info,
  ShieldCheck
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { fetchProductById } from '@/services/productApi'
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

interface ProductResponse {
  success: boolean
  product: ProductDetails
  inStock: boolean
}

export default function StorefrontProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { addToCart, updateQuantity, cartItems } = useCart()

  const [data, setData] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Interactive UI State
  const [activeImage, setActiveImage] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedFlavour, setSelectedFlavour] = useState<string>('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    async function loadProductDetails() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchProductById(id)
        if (res.success && res.product) {
          setData(res)
          const defaultImage = res.product.imageUrls?.[0] || res.product.imageUrl || ''
          setActiveImage(defaultImage)
          
          if (res.product.flavourTags && res.product.flavourTags.length > 0) {
            setSelectedFlavour(res.product.flavourTags[0])
          }
        } else {
          setError(res.error || 'Supplement information is currently unavailable.')
        }
      } catch (err: any) {
        console.error('Error fetching storefront product:', err)
        const msg = err.response?.data?.error || err.message || 'Failed to load product details.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProductDetails()
    }
  }, [id])

  const handleQuantityChange = (val: number) => {
    if (val < 1) return
    setQuantity(val)
  }

  const handleAddToCart = () => {
    if (!data) return
    const { product, inStock } = data
    if (!inStock) return

    // Construct Product mock for CartContext
    const cartProduct = {
      ...product,
      inventory: {
        totalStock: inStock ? 10 : 0,
        status: inStock ? 'In_Stock' : 'Out_Of_Stock'
      }
    }

    // Check if the item (product + flavor) is already in the cart
    const existingItem = cartItems.find(
      (item) => item.product._id === product._id && item.selectedFlavour === selectedFlavour
    )

    if (existingItem) {
      updateQuantity(product._id, selectedFlavour, existingItem.quantity + quantity)
    } else {
      // First, trigger addToCart which appends item with initial quantity 1
      addToCart(cartProduct, selectedFlavour)
      // If quantity selected > 1, update it instantly
      if (quantity > 1) {
        updateQuantity(product._id, selectedFlavour, quantity)
      }
    }

    setToast(`Added ${quantity} x ${product.name} (${selectedFlavour || 'Default'}) to cart!`)
    setTimeout(() => setToast(null), 3500)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8 min-h-[550px] animate-pulse space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="aspect-square bg-zinc-900 rounded-2xl" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square bg-zinc-900 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 w-2/3 bg-zinc-900 rounded-md" />
              <div className="h-4 w-1/3 bg-zinc-900 rounded-md" />
              <div className="h-32 bg-zinc-900 rounded-2xl" />
              <div className="h-16 w-1/2 bg-zinc-900 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-6 text-rose-400 shadow-sm flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-rose-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Product Details Unavailable</h3>
            <p className="text-sm mt-1">{error || 'Supplement SKU is not listed or has been removed.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const { product, inStock } = data
  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600']

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-55 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/80 backdrop-blur-md px-4 py-3.5 shadow-2xl text-emerald-400 animate-slide-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold">{toast}</p>
        </div>
      )}

      {/* Navigation */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      {/* Glassmorphic Details Card */}
      <div className="bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Left Column: Media Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 flex items-center justify-center relative overflow-hidden group shadow-inner">
              <img
                src={activeImage || images[0]}
                alt={product.name}
                className="object-contain max-h-full max-w-full rounded-xl transition duration-500 transform group-hover:scale-103"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600'
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
                      activeImage === imgUrl ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="object-contain max-h-full max-w-full rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=120'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Header / Meta */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">{product.brand}</span>
                <h1 className="text-3xl font-extrabold text-white mt-1 leading-tight">{product.name}</h1>
                <p className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-wider">SKU: {product.sku}</p>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  inStock
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                }`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 border border-zinc-700/60 px-3 py-1 text-xs font-semibold text-zinc-300">
                  <Tag className="h-3.5 w-3.5 text-zinc-400" /> {product.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-zinc-500" /> Supplement Description
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 border border-zinc-800 px-4 py-3.5 rounded-xl whitespace-pre-wrap">
                {product.description || 'No description available for this supplement.'}
              </p>
            </div>

            {/* Flavour Options */}
            {product.flavourTags && product.flavourTags.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Choose Flavour</span>
                <div className="flex flex-wrap gap-2">
                  {product.flavourTags.map((flavour) => (
                    <button
                      key={flavour}
                      onClick={() => setSelectedFlavour(flavour)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all duration-200 cursor-pointer ${
                        selectedFlavour === flavour
                          ? 'border-indigo-500 bg-indigo-950/20 text-indigo-400 shadow shadow-indigo-500/10'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-450'
                      }`}
                    >
                      {flavour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/30 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block mb-0.5">Fulfillment price</span>
                <div className="text-3xl font-black text-white">{formatCurrency(product.price)}</div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Quantity Controls */}
                {inStock && (
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl h-11 px-1">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-12 bg-transparent text-center text-sm font-extrabold text-white border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Cart Trigger */}
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl px-6 h-11 text-xs font-bold uppercase tracking-wider transition duration-300 shadow cursor-pointer ${
                    inStock
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                      : 'bg-zinc-850 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {inStock ? 'Add to Cart' : 'Currently Unavailable'}
                </button>
              </div>
            </div>

            {/* Quality seal badge */}
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold pl-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Authentic Supplements & Quality Guaranteed</span>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  )
}
