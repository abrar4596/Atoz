'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, X, PackageCheck } from 'lucide-react'
import { fetchAdminOrders, updateAdminOrderStatus } from '@/services/adminApi'
import { formatCurrency } from '@/lib/utils'

interface UserProfile {
  name: string
  email: string
}

interface OrderItem {
  productId: string
  name: string
  brand: string
  flavour?: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  user?: UserProfile
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
}

interface ToastMessage {
  message: string
  type: 'success' | 'error'
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true)
        const res = await fetchAdminOrders()
        if (res.success) {
          setOrders(res.data)
          setError(null)
        } else {
          throw new Error(res.error || 'Failed to fetch orders')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend')
      } finally {
        setLoading(false)
      }
    }
    getOrders()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    const timer = setTimeout(() => {
      setToast(current => current?.message === message ? null : current)
    }, 4000)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const originalOrders = [...orders]
    
    // Optimistic UI Update
    setOrders((currentOrders) =>
      currentOrders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    )

    try {
      const res = await updateAdminOrderStatus(orderId, newStatus)
      if (res.success) {
        showToast(`Order #${orderId.slice(-6)} marked as ${newStatus}`, 'success')
      } else {
        throw new Error(res.error || 'Failed to update status')
      }
    } catch (err: any) {
      console.error('Failed updating status:', err)
      setOrders(originalOrders)
      showToast(err.message || 'Failed to update status', 'error')
    }
  }

  const getOptions = (currentStatus: string) => {
    const base = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    if (!base.includes(currentStatus)) {
      return [...base, currentStatus]
    }
    return base
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="rounded-3xl bg-zinc-900 p-6 h-36 border border-zinc-800"></div>
        {/* Table Skeleton */}
        <div className="rounded-3xl bg-white p-6 border border-zinc-200 space-y-4">
          <div className="h-8 bg-zinc-100 rounded-xl w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-4 py-2 border-b border-zinc-100">
              <div className="h-4 bg-zinc-200 rounded"></div>
              <div className="h-4 bg-zinc-200 rounded"></div>
              <div className="h-4 bg-zinc-200 rounded"></div>
              <div className="h-4 bg-zinc-200 rounded"></div>
              <div className="h-4 bg-zinc-200 rounded"></div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-zinc-100">
                <div className="h-4 bg-zinc-100 rounded"></div>
                <div className="h-4 bg-zinc-100 rounded"></div>
                <div className="h-4 bg-zinc-100 rounded"></div>
                <div className="h-4 bg-zinc-100 rounded"></div>
                <div className="h-4 bg-zinc-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-55 flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl transition-all duration-300 transform translate-y-0 animate-slide-in ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          )}
          <p className="text-sm font-semibold">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-3 text-zinc-400 hover:text-zinc-600 transition p-0.5 rounded-full hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Order Management</p>
        <h1 className="mt-2 text-3xl font-semibold">Fulfillment tracking</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Track and update status of customer orders.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-900 border-b border-zinc-200 pb-4 mb-4">
          <PackageCheck className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold">All Customer Orders</h2>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">No customer orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer Name</th>
                  <th className="px-4 py-3 font-medium">Total Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  let selectColorClass = ''
                  switch (order.status) {
                    case 'Delivered':
                      selectColorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-500'
                      break
                    case 'Cancelled':
                      selectColorClass = 'bg-rose-50 text-rose-800 border-rose-200 focus:ring-rose-500'
                      break
                    case 'Pending':
                      selectColorClass = 'bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-500'
                      break
                    case 'Shipped':
                      selectColorClass = 'bg-blue-50 text-blue-800 border-blue-200 focus:ring-blue-500'
                      break
                    case 'Processing':
                    default:
                      selectColorClass = 'bg-indigo-50 text-indigo-800 border-indigo-200 focus:ring-indigo-500'
                      break
                  }

                  return (
                    <tr key={order._id} className="border-t border-zinc-150 text-zinc-700 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-zinc-950">#{order._id.slice(-6)}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{order.user?.name || 'Guest/Unknown'}</td>
                      <td className="px-4 py-3 font-semibold text-zinc-950">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer transition ${selectColorClass}`}
                        >
                          {getOptions(order.status).map((status) => (
                            <option key={status} value={status} className="bg-white text-zinc-800 font-medium">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

