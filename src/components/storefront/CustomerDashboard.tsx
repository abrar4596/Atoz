'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Award, ShoppingBag, RefreshCw, Calendar, Package, ArrowRight, ShieldAlert, ArrowLeft, Loader2, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Product } from './ProductCard'
import { fetchHistory } from '@/services/orderApi'
import { apiClient } from '@/services/apiClient'
import { formatCurrency } from '@/lib/utils'

interface IUserProfile {
  _id: string
  name: string
  phone: string
  googleId?: string
  loyaltyPoints: number
}

interface IOrderItem {
  productId: string
  name: string
  brand: string
  flavour?: string
  quantity: number
  price: number
}

interface IOrder {
  _id: string
  userId: string
  items: IOrderItem[]
  totalAmount: number
  status: 'Pending' | 'Processing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered'
  createdAt: string
  updatedAt: string
}

export default function CustomerDashboard() {
  const router = useRouter()
  const { addToCart } = useCart()

  const [user, setUser] = useState<IUserProfile | null>(null)
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReorderingId, setIsReorderingId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const userRes = await apiClient.get('/auth/profile')
        if (userRes.data.success) {
          setUser(userRes.data.data)
        }

        const ordersRes = await fetchHistory()
        if (ordersRes.success) {
          setOrders(ordersRes.data)
        }
      } catch (err: any) {
        console.error('Dashboard fetching error:', err)
        setError(err.message || 'An error occurred while loading dashboard details')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isClient])

  const handleReorder = async (orderId: string, orderItems: IOrderItem[]) => {
    setIsReorderingId(orderId)

    try {
      for (const item of orderItems) {
        const mockProduct: Product = {
          _id: item.productId,
          name: item.name,
          sku: `REORDER-${item.productId}`,
          description: 'Reordered supplement from your past purchases',
          price: item.price,
          brand: item.brand,
          imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300&auto=format&fit=crop',
          category: 'Protein',
          flavourTags: item.flavour ? [item.flavour] : [],
          inventory: {
            totalStock: 99,
            status: 'In_Stock'
          }
        }

        const selectedFlavour = item.flavour || 'Unflavoured'

        for (let q = 0; q < item.quantity; q++) {
          addToCart(mockProduct, selectedFlavour)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 400))
      router.push('/checkout')
    } catch (e) {
      console.error('Reordering failed:', e)
    } finally {
      setIsReorderingId(null)
    }
  }

  const getStatusBadgeClass = (status: IOrder['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'Processing':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'Ready for Pickup':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'Out for Delivery':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'Pending':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  const currentPoints = user?.loyaltyPoints || 0
  const nextTierPoints = 500
  const pointsRemaining = Math.max(0, nextTierPoints - currentPoints)
  const progressPercent = Math.min(100, (currentPoints / nextTierPoints) * 100)

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-6">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-lg font-bold">Failed to Load Dashboard</h2>
        <p className="text-zinc-500 text-xs">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-zinc-900 border border-white/10 hover:border-white/20 text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              Customer Dashboard
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              Welcome back, <span className="text-white font-bold">{user?.name}</span>. Manage your loyalty rewards and reorder supplements instantly.
            </p>
          </div>
          <div className="text-[10px] text-zinc-550 font-semibold select-none">
            User ID: {user?._id}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-950/40 to-zinc-950 border border-indigo-500/10 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group shadow-2xl">
              
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all duration-500" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-350">
                  Loyalty Passport
                </h3>
                <Award className="h-5 w-5 text-indigo-400" />
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Reward Balance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-white">{currentPoints}</span>
                  <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-wide">Points</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/5 pt-5">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <span className="text-zinc-450 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-zinc-550 fill-zinc-550" />
                    Silver Tier
                  </span>
                  <span className="text-indigo-300 flex items-center gap-1.5">
                    Gold Tier
                    <Star className="h-3.5 w-3.5 text-indigo-450 fill-indigo-400" />
                  </span>
                </div>

                <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-relaxed pt-1">
                  {pointsRemaining > 0 ? (
                    <>
                      Earn <span className="text-zinc-300 font-black">{pointsRemaining} more points</span> to unlock Gold Tier (10% discounts on checkout).
                    </>
                  ) : (
                    <span className="text-emerald-450">Gold tier benefits unlocked! Enjoy your 10% discount on all supplements.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
              
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-350 border-b border-white/5 pb-4 flex items-center justify-between">
                <span>Purchase History</span>
                <span className="text-xs text-zinc-550 font-bold uppercase">
                  {orders.length} Past {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">No order records found</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <div 
                      key={order._id} 
                      className="border border-white/5 hover:border-indigo-900/10 bg-zinc-900/10 hover:bg-indigo-950/5 p-5 rounded-2xl transition duration-300 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/5 text-zinc-400">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-none">
                              {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-1">
                              ID: {order._id}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pr-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">{item.name}</p>
                              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
                                {item.brand} {item.flavour ? `| ${item.flavour}` : ''}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-zinc-300 font-bold">{formatCurrency(item.price)}</span>
                              <p className="text-[9px] text-zinc-550">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/5 pt-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-xs font-bold text-zinc-400">
                          Total Amount Paid: <span className="text-indigo-400 text-sm font-black">{formatCurrency(order.totalAmount)}</span>
                        </div>
                        
                        <button
                          onClick={() => handleReorder(order._id, order.items)}
                          disabled={isReorderingId !== null}
                          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 font-extrabold uppercase px-4 py-2.5 rounded-xl text-[10px] tracking-wider transition cursor-pointer disabled:cursor-not-allowed select-none"
                        >
                          {isReorderingId === order._id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Adding Items...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3.5 w-3.5" />
                              1-Click Reorder
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
