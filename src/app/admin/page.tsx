'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, AlertTriangle, DollarSign, PackageCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { fetchStats } from '@/services/adminApi'
import { formatCurrency } from '@/lib/utils'

// Mock data fallback for when backend is down
const MOCK_STATS = {
  cashSaved: 1250000,
  criticalActionRequired: 8,
  flaggedItems: [
    { _id: '1', productId: { name: 'Organic Milk' }, stockQuantity: 2, batchNumber: 'BATCH-001' },
    { _id: '2', productId: { name: 'Fresh Eggs' }, stockQuantity: 1, batchNumber: 'BATCH-002' },
    { _id: '3', productId: { name: 'Greek Yogurt' }, stockQuantity: 3, batchNumber: 'BATCH-003' },
    { _id: '4', productId: { name: 'Whole Wheat Bread' }, stockQuantity: 2, batchNumber: 'BATCH-004' },
  ]
}

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true)
        const res = await fetchStats()
        console.log('fetchStats response:', res)
        if (res.success) {
          setStats(res.data)
        } else {
          console.warn('fetchStats not successful, using mock data')
          setStats(MOCK_STATS)
          setError(res.error || 'Failed to load live stats - showing demo data')
        }
      } catch (err: any) {
        console.error('Stats loading error:', err)
        console.warn('Using mock data due to error')
        setStats(MOCK_STATS)
        setError('Backend unavailable - showing demo data')
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-zinc-500 text-sm">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Warning banner if using mock data */}
      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-700 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Immediate ROI proof</p>
            <h1 className="mt-2 text-3xl font-semibold">Protect your cash flow with inventory alerts.</h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              This admin dashboard surfaces low-stock and near-expiry items so you can act before revenue leaks.
            </p>
          </div>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            Review alerts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">Cash Saved (30 Days)</p>
              <p className="mt-2 text-4xl font-semibold text-zinc-950">{formatCurrency(stats.cashSaved)}</p>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500">Estimated value preserved by restocking flagged inventory before spoilage.</p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">Critical Action Required</p>
              <p className="mt-2 text-4xl font-semibold text-rose-600">{stats.criticalActionRequired}</p>
            </div>
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500">SKUs under 3 units or expiring within 60 days.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-900">
          <PackageCheck className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Current alerts</h2>
        </div>
        <div className="mt-4 space-y-3">
          {stats.flaggedItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500">
              No urgent inventory issues detected right now.
            </div>
          ) : (
            stats.flaggedItems.slice(0, 4).map((item: any) => (
              <div key={item._id} className="flex flex-wrap items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <div>
                  <p className="font-semibold text-zinc-950">{item.productId?.name ?? 'Unknown product'}</p>
                  <p className="text-sm text-zinc-500">{item.stockQuantity} units • Batch {item.batchNumber}</p>
                </div>
                <div className="rounded-2xl bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">Action needed</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
