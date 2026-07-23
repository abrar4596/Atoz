'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Truck, Store, Clock, ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'

export interface OrderDetails {
  orderId: string
  customerDetails: {
    fullName: string
    phone: string
  }
  fulfillment: {
    method: 'delivery' | 'pickup'
    details: {
      address?: string
      window?: string
      storeAddress?: string
      timeSlot?: string
    }
  }
  items: Array<{
    id: string
    name: string
    brand: string
    price: number
    quantity: number
    flavour?: string
  }>
  financials: {
    subtotal: number
    tax: number
    deliveryFee: number
    total: number
  }
}

interface OrderConfirmationProps {
  order?: OrderDetails
  onContinue?: () => void
}

export default function OrderConfirmation({ order: propOrder, onContinue }: OrderConfirmationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const queryOrderId = searchParams.get('orderId')
  const queryFulfillment = searchParams.get('fulfillment') as 'delivery' | 'pickup' | null

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (propOrder) {
      setOrder(propOrder)
      return
    }

    if (isClient) {
      try {
        const storedOrderRaw = localStorage.getItem('atoz_last_order')
        if (storedOrderRaw) {
          const storedOrder = JSON.parse(storedOrderRaw) as OrderDetails
          if (!queryOrderId || storedOrder.orderId === queryOrderId) {
            setOrder(storedOrder)
          }
        }
      } catch (error) {
        console.error('Failed to retrieve order from localStorage:', error)
      }
    }
  }, [propOrder, isClient, queryOrderId])

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      router.push('/')
    }
  }

  const displayOrder = order || (queryOrderId ? {
    orderId: queryOrderId,
    customerDetails: {
      fullName: 'Valued Customer',
      phone: ''
    },
    fulfillment: {
      method: queryFulfillment || 'delivery',
      details: queryFulfillment === 'pickup'
        ? {
            storeAddress: '100 Supplements Way, Wellness District, CA 90210',
            timeSlot: 'Scheduled Time Slot'
          }
        : {
            address: 'Your shipping address',
            window: 'Same-day Local Delivery'
          }
    },
    items: [],
    financials: {
      subtotal: 0,
      tax: 0,
      deliveryFee: queryFulfillment === 'delivery' ? 4.99 : 0,
      total: 0
    }
  } as OrderDetails : null)

  useEffect(() => {
    if (isClient && !queryOrderId && !propOrder) {
      router.push('/')
    }
  }, [isClient, queryOrderId, propOrder, router])

  if (!isClient || !displayOrder) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  const { orderId, customerDetails, fulfillment, items, financials } = displayOrder

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 bg-zinc-950 border border-white/5 p-6 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Order Confirmed!
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
            Thank you for shopping with AtoZ. We have sent SMS order notifications to <span className="text-zinc-200 font-bold">{customerDetails.phone}</span>.
          </p>
          <div className="inline-block bg-zinc-900 border border-white/5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-350 select-all cursor-pointer">
            Order ID: {orderId}
          </div>
        </div>

        {fulfillment.method === 'delivery' ? (
          <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-150">
                Local Home Delivery Details
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-zinc-400">
              <div>
                <span className="text-[10px] text-zinc-550 uppercase tracking-widest block mb-1">Shipping Address</span>
                <p className="text-white leading-relaxed">{fulfillment.details.address}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-550 uppercase tracking-widest block mb-1">Estimated Arrival</span>
                <p className="text-emerald-400 leading-relaxed font-bold">{fulfillment.details.window}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-950/15 border border-indigo-900/20 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-indigo-900/20 pb-3">
              <div className="p-2 rounded-xl bg-indigo-550/10 border border-indigo-500/20 text-indigo-400">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-300">
                In-Store Pickup Passport
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-semibold text-zinc-400">
              <div>
                <span className="text-[10px] text-indigo-350/85 uppercase tracking-widest block mb-1">Scheduled Window</span>
                <p className="text-white flex items-center gap-1.5 leading-relaxed font-bold">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  {fulfillment.details.timeSlot}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-indigo-350/85 uppercase tracking-widest block mb-1">Physical Store Address</span>
                <p className="text-zinc-300 leading-normal">{fulfillment.details.storeAddress}</p>
              </div>
            </div>
            
            <div className="text-[10px] text-indigo-350 border border-indigo-950 bg-indigo-950/20 p-2.5 rounded-lg text-center font-bold tracking-widest uppercase">
              Please present your order ID or registered phone number at the counter for pickup.
            </div>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="border border-white/5 rounded-2xl overflow-hidden bg-zinc-900/20">
            <div className="px-5 py-4 border-b border-white/5 bg-zinc-900/30 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-350">
                Purchased Items
              </h3>
              <ShoppingBag className="h-4 w-4 text-zinc-550" />
            </div>
            <div className="p-5 divide-y divide-white/5 space-y-3.5 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.flavour}`} className="flex justify-between items-center text-xs gap-3 pt-3.5 first:pt-0">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate leading-snug">{item.name}</p>
                    <p className="text-zinc-550 text-[10px] font-semibold mt-0.5 uppercase tracking-wider">
                      {item.brand} {item.flavour ? `| ${item.flavour}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-zinc-300 tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-zinc-550">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-white/5 bg-zinc-900/30 space-y-2.5 text-xs font-semibold text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white tabular-nums">${financials.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-white tabular-nums">${financials.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment Fee</span>
                <span className="text-white tabular-nums">
                  {financials.deliveryFee > 0 ? `$${financials.deliveryFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3.5 text-sm font-bold text-white">
                <span>Total Paid</span>
                <span className="text-indigo-400 tabular-nums">${financials.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold uppercase py-4 rounded-xl text-xs sm:text-sm tracking-wider transition shadow-lg shadow-indigo-650/15 cursor-pointer"
          >
            Continue Shopping
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-center">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-650" />
          AtoZ Wellness Inc. Safe & secure payment verification system
        </div>

      </div>
    </div>
  )
}
