'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { createProduct } from '@/services/adminApi'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      const res = await createProduct(formData)
      if (res.success) {
        setSuccess('Product and linked Inventory batch created successfully!')
        setTimeout(() => {
          router.push('/admin/inventory')
        }, 1500)
      } else {
        setError(res.error || 'Failed to create product.')
      }
    } catch (err: any) {
      console.error('Create product error:', err)
      const msg = err.response?.data?.error || err.message || 'Error occurred while submitting form.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-950 font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Inventory
      </Link>

      <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin Control</p>
        <h1 className="mt-2 text-3xl font-semibold">Create New Product & Inventory Batch</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Add a new supplement SKU to the catalog and define its first physical batch inventory in a single sequential step.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitButtonText="Save Product SKU"
      />
    </div>
  )
}
