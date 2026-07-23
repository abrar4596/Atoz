'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Truck, Store, CreditCard, ShieldCheck, ShoppingBag, Loader2, ArrowLeft, LogIn } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { submitCheckout } from '@/services/orderApi'

const checkoutSchema = z.object({
  fulfillmentMethod: z.enum(['delivery', 'pickup']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits for SMS notifications'),
  
  shippingStreet: z.string().optional(),
  shippingCity: z.string().optional(),

  pickupTimeSlot: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.fulfillmentMethod === 'delivery') {
    if (!data.shippingStreet || data.shippingStreet.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Shipping street address is required for delivery',
        path: ['shippingStreet'],
      })
    }
    if (!data.shippingCity || data.shippingCity.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Shipping city is required for delivery',
        path: ['shippingCity'],
      })
    }
  }

  if (data.fulfillmentMethod === 'pickup') {
    if (!data.pickupTimeSlot || data.pickupTimeSlot === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a pickup time slot',
        path: ['pickupTimeSlot'],
      })
    }
  }
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutForm() {
  const { cartItems, subtotal, estimatedTax, clearCart } = useCart()
  const { user, loading } = useAuth()
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isClient, user, loading, router, pathname])

  useEffect(() => {
    if (isClient && cartItems.length === 0) {
      router.push('/')
    }
  }, [isClient, cartItems, router])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillmentMethod: 'delivery',
      pickupTimeSlot: '',
    },
  })

  const fulfillmentMethod = watch('fulfillmentMethod')

  const deliveryFee = fulfillmentMethod === 'delivery' ? 4.99 : 0
  const grandTotal = subtotal + estimatedTax + deliveryFee

  const handleFulfillmentChange = (method: 'delivery' | 'pickup') => {
    setValue('fulfillmentMethod', method)
    clearErrors(['shippingStreet', 'shippingCity', 'pickupTimeSlot'])
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmittingOrder(true)
    
    await new Promise((resolve) => setTimeout(resolve, 2200))

    const mockOrderId = `ATOZ-${Math.floor(100000 + Math.random() * 900000)}`
    
    const finalOrder = {
      orderId: mockOrderId,
      customerDetails: {
        fullName: data.fullName,
        phone: data.phone,
      },
      fulfillment: {
        method: data.fulfillmentMethod,
        details: data.fulfillmentMethod === 'delivery' 
          ? {
              address: `${data.shippingStreet}, ${data.shippingCity}`,
              window: 'Same-day Local Delivery (Within 4 hours)'
            }
          : {
              storeAddress: '100 Supplements Way, Wellness District, CA 90210',
              timeSlot: data.pickupTimeSlot
            }
      },
      items: cartItems.map(item => ({
        id: item.product._id,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        flavour: item.selectedFlavour
      })),
      financials: {
        subtotal,
        tax: estimatedTax,
        deliveryFee,
        total: grandTotal
      }
    }

    try {
      await submitCheckout({
        items: cartItems.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          flavour: item.selectedFlavour
        })),
        totalAmount: grandTotal,
        status: data.fulfillmentMethod === 'delivery' ? 'Processing' : 'Ready for Pickup'
      })
    } catch (e) {
      console.error('Failed to submit order to backend:', e)
    }

    try {
      localStorage.setItem('atoz_last_order', JSON.stringify(finalOrder))
    } catch (e) {
      console.error('Failed to store order in localStorage:', e)
    }

    setIsSubmittingOrder(false)
    clearCart()

    router.push(`/confirmation?orderId=${mockOrderId}&fulfillment=${data.fulfillmentMethod}`)
  }

  const renderError = (errorField: any) => {
    if (!errorField?.message) return null
    return <p className="text-xs text-red-400 mt-1">{errorField.message.toString()}</p>
  }

  if (!isClient || loading || !user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Secure Checkout
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Complete your order by choosing your preferred fulfillment option below.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <ShoppingBag className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Your Cart is Empty</h3>
            <p className="text-zinc-500 text-sm mb-6">Add products to your cart before proceeding to checkout.</p>
            <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition">
              Browse Supplements
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl backdrop-blur-md">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block mb-4">
                  Select Fulfillment Pathway
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFulfillmentChange('delivery')}
                    className={`flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl border text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      fulfillmentMethod === 'delivery'
                        ? 'border-indigo-600 bg-indigo-950/20 text-indigo-400 shadow-xl'
                        : 'border-white/5 bg-zinc-950/40 text-zinc-400 hover:border-white/10'
                    }`}
                  >
                    <Truck className="h-4.5 w-4.5" />
                    Local Delivery
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFulfillmentChange('pickup')}
                    className={`flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl border text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      fulfillmentMethod === 'pickup'
                        ? 'border-indigo-600 bg-indigo-950/20 text-indigo-400 shadow-xl'
                        : 'border-white/5 bg-zinc-950/40 text-zinc-400 hover:border-white/10'
                    }`}
                  >
                    <Store className="h-4.5 w-4.5" />
                    In-Store Pickup
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-350 border-b border-white/5 pb-3">
                  1. Contact Information
                </h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-all"
                    placeholder="Enter your name"
                  />
                  {renderError(errors.fullName)}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">Phone Number (10 digits)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    {...register('phone')}
                    className="w-full bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-all"
                    placeholder="10 digit number"
                  />
                  {renderError(errors.phone)}
                </div>
              </div>

              {fulfillmentMethod === 'delivery' ? (
                <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-350 border-b border-white/5 pb-3">
                    2. Delivery Details
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">Street Address</label>
                    <input
                      type="text"
                      {...register('shippingStreet')}
                      className="w-full bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-all"
                      placeholder="Apartment, suite, unit, or building"
                    />
                    {renderError(errors.shippingStreet)}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">City</label>
                    <input
                      type="text"
                      {...register('shippingCity')}
                      className="w-full bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-all"
                      placeholder="City"
                    />
                    {renderError(errors.shippingCity)}
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-350 border-b border-white/5 pb-3">
                    2. Pickup Schedule Details
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">Time Slot Window</label>
                    <select
                      {...register('pickupTimeSlot')}
                      className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-all text-zinc-400"
                    >
                      <option value="">Select a time slot</option>
                      <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM (Morning)</option>
                      <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM (Early Afternoon)</option>
                      <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM (Late Afternoon)</option>
                      <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM (Evening)</option>
                    </select>
                    {renderError(errors.pickupTimeSlot)}
                  </div>
                  <div className="text-xs text-zinc-400 border border-indigo-950/50 bg-indigo-950/10 p-3.5 rounded-xl">
                    <span className="font-bold text-zinc-350 block mb-1">Pickup Store Location:</span>
                    100 Supplements Way, Wellness District, CA 90210 (Hours: 8:00 AM - 10:00 PM Daily)
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-350 border-b border-white/5 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <ShoppingBag className="h-4.5 w-4.5 text-zinc-500" />
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={`${item.product._id}-${item.selectedFlavour}`} className="flex justify-between items-center text-xs gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate leading-snug">{item.product.name}</p>
                        <p className="text-zinc-550 text-[10px] font-medium mt-0.5 uppercase tracking-wide">
                          Qty: {item.quantity} {item.selectedFlavour ? `| ${item.selectedFlavour}` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-zinc-355 tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2 text-xs font-semibold text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="text-white tabular-nums">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fulfillment ({fulfillmentMethod === 'delivery' ? 'Local Delivery' : 'In-Store Pickup'})</span>
                    <span className="text-white tabular-nums">
                      {fulfillmentMethod === 'delivery' ? `$${deliveryFee.toFixed(2)}` : 'FREE'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-t border-white/5 pt-4 text-base font-bold text-white">
                    <span>Grand Total</span>
                    <span className="text-indigo-400 tabular-nums">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="w-full flex items-center justify-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 font-extrabold uppercase py-4 rounded-xl text-sm transition shadow-lg shadow-indigo-650/15 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmittingOrder ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin text-zinc-500" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4.5 w-4.5" />
                      Authorize & Place Order
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-550 uppercase tracking-widest text-center pt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  SSL Encrypted Verified Transaction
                </div>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
