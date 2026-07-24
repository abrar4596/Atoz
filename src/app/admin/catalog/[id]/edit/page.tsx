'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { updateProduct } from '@/services/adminApi'
import { fetchProductById } from '@/services/productApi'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)

  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const res = await fetchProductById(id)
        if (res.success && res.data) {
          // Re-map fields so they fit the ProductForm's expected initialData structure
          setInitialData({
            product: res.data,
            inventory: res.data.inventory
          })
        } else {
          setError(res.error || 'Failed to fetch product details.')
        }
      } catch (err: any) {
        console.error('Error fetching product:', err)
        setError('Error connecting to backend to fetch product.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      const res = await updateProduct(id, formData)
      if (res.success) {
        setSuccess('Product and linked Inventory updated successfully!')
        setTimeout(() => {
          router.push('/admin/catalog')
        }, 1500)
      } else {
        setError(res.error || 'Failed to update product.')
      }
    } catch (err: any) {
      console.error('Update product error:', err)
      const msg = err.response?.data?.error || err.message || 'Error occurred while updating product.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/catalog"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-950 font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin Control</p>
        <h1 className="mt-2 text-3xl font-semibold">Edit Product Supplement</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Modify the supplement's static details, update the batch inventory records, or upload a new product image.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-zinc-500 text-sm">Loading product details from database...</p>
        </div>
      ) : (
        <>
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

          {initialData && (
            <ProductForm
              initialData={initialData}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitButtonText="Update Product SKU"
            />
          )}
        </>
      )}
    </div>
  )
}
