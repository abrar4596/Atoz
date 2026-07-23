'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import { AlertBadge } from './AlertBadge'
import { ReorderModal } from './ReorderModal'
import { sendPurchaseOrder } from '@/services/adminApi'

interface DistributorData {
  name?: string
  contactEmail?: string
}

interface ProductData {
  _id: string
  name: string
  sku: string
  distributorId?: DistributorData
}

interface InventoryItem {
  _id: string
  batchNumber: string
  stockQuantity: number
  expiryDate: string
  status: string
  productId?: ProductData
}

export function AdminInventoryAlerts({ inventoryItems }: { inventoryItems: InventoryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')

  const flaggedItems = useMemo(
    () =>
      inventoryItems.filter((item) => {
        const expiry = new Date(item.expiryDate)
        const daysToExpiry = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return item.stockQuantity < 3 || daysToExpiry < 60
      }),
    [inventoryItems],
  )

  const handleApprove = async () => {
    if (!selectedItem) return
    setPendingId(selectedItem._id)
    setMessage('')

    try {
      const result = await sendPurchaseOrder(selectedItem.productId?._id || '')

      if (!result.success) {
        throw new Error(result.error || 'Unable to send purchase order')
      }

      setCompletedIds((current) => [...current, selectedItem._id])
      setMessage(`Purchase order sent to ${selectedItem.productId?.distributorId?.name || 'the distributor'}.`)
    } catch (error: any) {
      setMessage(error.message || 'Unable to submit purchase order')
    } finally {
      setPendingId(null)
      setSelectedItem(null)
    }
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Expiry</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {flaggedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                    No active flags. Inventory performance looks stable.
                  </td>
                </tr>
              ) : (
                flaggedItems.map((item) => {
                  const expiry = new Date(item.expiryDate)
                  const daysToExpiry = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  const sent = completedIds.includes(item._id)

                  return (
                    <tr key={item._id} className="border-t border-zinc-200 text-zinc-700">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-950">{item.productId?.name || 'Unknown product'}</div>
                        <div className="text-xs text-zinc-550">Batch {item.batchNumber}</div>
                      </td>
                      <td className="px-4 py-3">{item.productId?.sku || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.stockQuantity}</span>
                          {item.stockQuantity < 3 && (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold uppercase">
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{daysToExpiry < 60 ? `${daysToExpiry} days` : 'Grip safe'}</span>
                          {daysToExpiry < 60 && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold uppercase">
                              Expiring
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          disabled={pendingId === item._id || sent}
                          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                        >
                          {sent ? <CheckCircle2 className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                          {sent ? 'Sent' : 'Generate PO'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReorderModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onApprove={handleApprove}
        productName={selectedItem?.productId?.name || 'Product preview'}
        sku={selectedItem?.productId?.sku || ''}
        distributorName={selectedItem?.productId?.distributorId?.name || 'Unknown'}
        stockQuantity={selectedItem?.stockQuantity ?? 0}
        isPending={pendingId === selectedItem?._id}
      />
    </div>
  )
}
export default AdminInventoryAlerts
