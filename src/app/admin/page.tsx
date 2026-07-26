'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, AlertTriangle, DollarSign, PackageCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { formatCurrency } from '@/lib/utils'

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('atoz_jwt_token') : null
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        
        const response = await axios.get(`${apiUrl}/admin/dashboard/roi`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        })
        
        if (response.data && response.data.success) {
          const { cashSaved, criticalActionCount, alerts } = response.data.data
          setStats({
            cashSaved,
            criticalActionRequired: criticalActionCount,
            flaggedItems: alerts
          })
          setError(null)
        } else {
          throw new Error(response.data?.error || 'Failed to fetch dashboard ROI stats')
        }
      } catch (err: any) {
        console.error('Stats loading error:', err)
        setError('Failed to load live data')
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="rounded-3xl bg-zinc-900 p-6 h-36 border border-zinc-800"></div>
        {/* KPI Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-zinc-100 p-6 h-36 border border-zinc-200"></div>
          <div className="rounded-3xl bg-zinc-100 p-6 h-36 border border-zinc-200"></div>
        </div>
        {/* Alerts Card Skeleton */}
        <div className="rounded-3xl bg-zinc-50 p-6 h-64 border border-zinc-200 space-y-3">
          <div className="h-6 bg-zinc-200 rounded w-1/4"></div>
          <div className="h-12 bg-zinc-200 rounded-2xl"></div>
          <div className="h-12 bg-zinc-200 rounded-2xl"></div>
          <div className="h-12 bg-zinc-200 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error banner if live fetch failed */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-center gap-2">
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

      {stats && (
        <>
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
              {!stats.flaggedItems || stats.flaggedItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500">
                  No urgent inventory issues detected right now.
                </div>
              ) : (
                stats.flaggedItems.slice(0, 4).map((item: any) => {
                  let badgeColor = 'bg-zinc-100 text-zinc-800 border-zinc-200'
                  let badgeText = item.issue || 'Action needed'

                  if (item.issue === 'Low Stock') {
                    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200'
                  } else if (item.issue === 'Expiring Soon') {
                    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200'
                  } else if (item.issue === 'Critical: Both') {
                    badgeColor = 'bg-red-50 text-red-700 border-red-200 font-bold'
                  }

                  return (
                    <div key={item._id} className="flex flex-wrap items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                      <div>
                        <p className="font-semibold text-zinc-950">{item.productId?.name ?? 'Unknown product'}</p>
                        <p className="text-sm text-zinc-500">
                          {item.stockQuantity} units • Batch {item.batchNumber}
                          {item.expiryDate && ` • Expiry: ${new Date(item.expiryDate).toLocaleDateString('en-IN')}`}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${badgeColor}`}>
                        {badgeText}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

