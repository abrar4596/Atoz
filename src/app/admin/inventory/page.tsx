'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import axios from 'axios'
import { AdminInventoryAlerts } from '@/components/admin/AdminInventoryAlerts'

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getAlerts = async () => {
      try {
        setLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('atoz_jwt_token') : null
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        
        const response = await axios.get(`${apiUrl}/admin/dashboard/roi`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        })
        
        if (response.data && response.data.success) {
          setInventoryItems(response.data.data.alerts)
          setError(null)
        } else {
          throw new Error(response.data?.error || 'Failed to fetch inventory alerts')
        }
      } catch (err: any) {
        console.error('Alerts load error:', err)
        setError('Failed to load live data')
      } finally {
        setLoading(false)
      }
    }
    getAlerts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Title Banner Skeleton */}
        <div className="rounded-3xl bg-zinc-900 p-6 h-36 border border-zinc-800"></div>
        {/* Table/List Skeleton */}
        <div className="rounded-3xl bg-white p-6 border border-zinc-200 space-y-4">
          <div className="h-10 bg-zinc-100 rounded-2xl"></div>
          <div className="h-12 bg-zinc-550 rounded-2xl opacity-20"></div>
          <div className="h-12 bg-zinc-550 rounded-2xl opacity-20"></div>
          <div className="h-12 bg-zinc-550 rounded-2xl opacity-20"></div>
          <div className="h-12 bg-zinc-550 rounded-2xl opacity-20"></div>
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
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Inventory Alerts</p>
        <h1 className="mt-2 text-3xl font-semibold">Low-stock and near-expiry SKUs</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          This list is limited to products below 3 units or expiring within the next 60 days.
        </p>
      </div>

      <AdminInventoryAlerts inventoryItems={inventoryItems} />
    </div>
  )
}

