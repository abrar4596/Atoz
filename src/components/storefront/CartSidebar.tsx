'use client'

import { useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, Store, Truck, ShoppingBag, ArrowRight, LogIn, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function CartSidebar() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    updateFulfillmentMethod,
    removeFromCart,
    subtotal,
    estimatedTax,
    total,
  } = useCart()

  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-md bg-zinc-950 border-l border-white/5 shadow-2xl text-white h-full"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold uppercase tracking-wider">Your Shopping Cart</h2>
                <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-450 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 py-10">
                  <div className="p-4 rounded-full bg-zinc-900 border border-white/5 mb-4">
                    <ShoppingBag className="h-10 w-10 text-zinc-655 text-zinc-500" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-400">Your cart is currently empty</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[250px]">
                    Browse our supplements catalog and add premium stock to your shelf.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-6 px-5 py-2.5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const { product, quantity, selectedFlavour, fulfillmentMethod } = item
                  const stock = product.inventory?.totalStock ?? 0
                  const isOutOfStockLocally = stock <= 0

                  return (
                    <div
                      key={`${product._id}-${selectedFlavour}`}
                      className="flex flex-col p-4 bg-zinc-900/40 border border-white/5 rounded-2xl gap-3 transition-colors hover:bg-zinc-900/60"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/5 p-2 flex items-center justify-center shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="object-contain max-w-full max-h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            {product.brand}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate leading-snug">
                            {product.name}
                          </h4>
                          {selectedFlavour && (
                            <span className="inline-block text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-semibold mt-1">
                              Flavour: {selectedFlavour}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(product._id, selectedFlavour)}
                          className="text-zinc-555 text-zinc-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                          aria-label="Remove Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-b border-white/5 py-2">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-zinc-900">
                          <button
                            onClick={() => updateQuantity(product._id, selectedFlavour, quantity - 1)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-white tabular-nums select-none">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, selectedFlavour, quantity + 1)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-bold text-white tabular-nums">
                          ${(product.price * quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                          Fulfillment Mode
                        </span>
                        
                        {isOutOfStockLocally ? (
                          <div className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-2 rounded-xl flex items-center gap-2">
                            <Truck className="h-4 w-4 shrink-0 text-amber-400" />
                            <span>Available for Shipping Only (Local Pickup Out of Stock)</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => updateFulfillmentMethod(product._id, selectedFlavour, 'pickup')}
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                fulfillmentMethod === 'pickup'
                                  ? 'border-indigo-650 bg-indigo-950/20 text-indigo-400'
                                  : 'border-white/5 bg-zinc-950/50 text-zinc-400 hover:border-white/10'
                              }`}
                            >
                              <Store className="h-3.5 w-3.5" />
                              Store Pickup
                            </button>
                            <button
                              type="button"
                              onClick={() => updateFulfillmentMethod(product._id, selectedFlavour, 'shipping')}
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                fulfillmentMethod === 'shipping'
                                  ? 'border-indigo-650 bg-indigo-950/20 text-indigo-400'
                                  : 'border-white/5 bg-zinc-950/50 text-zinc-400 hover:border-white/10'
                              }`}
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Home Shipping
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-white/5 bg-zinc-900/30 space-y-4">
                <div className="space-y-2 text-xs text-zinc-400 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="text-white tabular-nums">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold">
                    <span className="text-white">Total Order Value</span>
                    <span className="text-indigo-400 tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (loading) return
                    if (!user) {
                      setIsOpen(false)
                      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
                      return
                    }
                    setIsOpen(false)
                    router.push('/checkout')
                  }}
                  className={`w-full flex items-center justify-center gap-2 font-extrabold uppercase py-4 rounded-xl text-sm transition shadow-lg cursor-pointer ${
                    loading
                      ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                      : !user
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/15'
                        : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-indigo-650/15'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Loading...
                    </>
                  ) : !user ? (
                    <>
                      <LogIn className="h-4.5 w-4.5" />
                      Sign In to Checkout
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
