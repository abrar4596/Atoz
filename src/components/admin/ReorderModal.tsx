import React from 'react'
import { X, ShoppingCart, Loader2 } from 'lucide-react'

interface ReorderModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  productName: string
  sku: string
  distributorName: string
  stockQuantity: number
  isPending: boolean
}

export function ReorderModal({
  isOpen,
  onClose,
  onApprove,
  productName,
  sku,
  distributorName,
  stockQuantity,
  isPending,
}: ReorderModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Purchase order</p>
            <h3 className="mt-2 text-xl font-semibold text-zinc-950">{productName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4 rounded-3xl bg-zinc-50 p-5 text-sm text-zinc-700">
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600">SKU</span>
            <span className="font-semibold text-zinc-950">{sku}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600">Distributor</span>
            <span className="font-semibold text-zinc-950">{distributorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600">Minimum order quantity</span>
            <span className="font-semibold text-zinc-950">{Math.max(3 - stockQuantity, 1)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            Approve & Send
          </button>
        </div>
      </div>
    </div>
  )
}
export default ReorderModal
