'use client'

import { useState, useEffect } from 'react'
import { Loader2, PackageCheck } from 'lucide-react'
import { fetchHistory } from '@/services/orderApi'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true)
        const res = await fetchHistory()
        if (res.success) {
          setOrders(res.data)
        } else {
          setError(res.error || 'Failed to fetch orders')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend')
      } finally {
        setLoading(false)
      }
    }
    getOrders()
  }, [])

  return (
    <div className="space-y-6">
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

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">No customer orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-2 font-medium">Order ID</th>
                  <th className="px-4 py-2 font-medium">Total Amount</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-zinc-150">
                    <td className="px-4 py-3 font-semibold text-zinc-900">{order._id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-indigo-50 text-indigo-600 px-2.5 py-0.5 text-xs font-bold">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
