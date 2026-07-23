'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { fetchAlerts } from '@/services/adminApi'
import { AdminInventoryAlerts } from '@/components/admin/AdminInventoryAlerts'

// Mock data fallback
const MOCK_ALERTS = [
  { _id: '1', productId: { name: 'Organic Milk', _id: 'p1' }, stockQuantity: 2, batchNumber: 'BATCH-001', expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'low_stock' },
  { _id: '2', productId: { name: 'Fresh Eggs', _id: 'p2' }, stockQuantity: 1, batchNumber: 'BATCH-002', expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), status: 'low_stock' },
  { _id: '3', productId: { name: 'Greek Yogurt', _id: 'p3' }, stockQuantity: 5, batchNumber: 'BATCH-003', expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'near_expiry' },
  { _id: '4', productId: { name: 'Whole Wheat Bread', _id: 'p4' }, stockQuantity: 2, batchNumber: 'BATCH-004', expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'low_stock' },
  { _id: '5', productId: { name: 'Orange Juice', _id: 'p5' }, stockQuantity: 10, batchNumber: 'BATCH-005', expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), status: 'near_expiry' },
]

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getAlerts = async () => {
      try {
        setLoading(true)
        const res = await fetchAlerts()
        console.log('fetchAlerts response:', res)
        if (res.success) {
          setInventoryItems(res.data)
        } else {
          console.warn('fetchAlerts not successful, using mock data')
          setInventoryItems(MOCK_ALERTS)
          setError(res.error || 'Failed to load live alerts - showing demo data')
        }
      } catch (err: any) {
        console.error('Alerts load error:', err)
        console.warn('Using mock data due to error')
        setInventoryItems(MOCK_ALERTS)
        setError('Backend unavailable - showing demo data')
      } finally {
        setLoading(false)
      }
    }
    getAlerts()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-zinc-500 text-sm">Loading inventory alerts...</p>
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
