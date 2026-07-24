'use client'

import { useState } from 'react'
import { Store, Truck, ShoppingBag, Check, LogIn, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export interface Product {
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
  inventory: {
    totalStock: number
    status: string
    batches?: Array<{
      batchNumber: string
      stockQuantity: number
      expiryDate: string
      status: string
    }>
  }
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, selectedFlavour: string) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { name, brand, price, flavourTags, inventory } = product
  const imageUrl = product.imageUrls?.[0] || product.imageUrl || ''
  const stock = inventory?.totalStock ?? 0

  const [selectedFlavour, setSelectedFlavour] = useState(
    flavourTags && flavourTags.length > 0 ? flavourTags[0] : ''
  )
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (loading) {
      return
    }
    if (!user) {
      // Redirect to login with current path as redirect URL
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Proceed with adding to cart if authenticated
    addToCart(product, selectedFlavour)
    if (onAddToCart) {
      onAddToCart(product, selectedFlavour)
    }
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40 hover:border-zinc-200 dark:hover:border-zinc-700">
      
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-950/40 p-4 flex items-center justify-center">
        {/* Local Store Availability Badge */}
        <div className="absolute top-3 left-3 z-10">
          {stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/50 shadow-sm dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-505 bg-emerald-500 animate-pulse" />
              <Store className="h-3 w-3" />
              Pickup Today
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/50 shadow-sm dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30">
              <Truck className="h-3 w-3" />
              Ships to Home
            </span>
          )}
        </div>

        {/* Product Image with Hover Zoom */}
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300&auto=format&fit=crop'}
          alt={name}
          className="h-4/5 w-4/5 object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300&auto=format&fit=crop'
          }}
        />

        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Brand */}
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
          {brand}
        </span>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 line-clamp-2 min-h-[2.5rem] mb-2 leading-snug">
          {name}
        </h3>

        {/* Price & Stock info */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-zinc-50">
            {formatCurrency(price)}
          </div>
          {stock > 0 && (
            <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              {stock} left in store
            </span>
          )}
        </div>

        {/* Flavour Options */}
        {flavourTags && flavourTags.length > 0 && (
          <div className="mb-4">
            <span className="block text-[10px] sm:text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wide">
              Select Flavour
            </span>
            <div className="flex flex-wrap gap-1.5">
              {flavourTags.map((flavour) => (
                <button
                  key={flavour}
                  type="button"
                  onClick={() => setSelectedFlavour(flavour)}
                  className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-lg border font-medium transition-all duration-200 cursor-pointer ${
                    selectedFlavour === flavour
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400'
                      : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/40 text-zinc-600 dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400'
                  }`}
                >
                  {flavour}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdded || loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : loading
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : !user
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-md shadow-zinc-950/10 dark:shadow-none'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : isAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart
              </>
            ) : !user ? (
              <>
                <LogIn className="h-4 w-4" />
                Sign In to Add
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
