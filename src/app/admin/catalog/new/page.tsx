'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createProduct, fetchDistributors } from '@/services/adminApi'

interface Distributor {
  _id: string
  name: string
  contactEmail: string
  contactPhone: string
  address: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [loadingDistributors, setLoadingDistributors] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Product states
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('Protein')
  const [flavourTags, setFlavourTags] = useState('')
  const [distributorId, setDistributorId] = useState('')

  // Inventory states
  const [batchNumber, setBatchNumber] = useState('')
  const [stockQuantity, setStockQuantity] = useState('10')
  const [expiryDate, setExpiryDate] = useState('')

  useEffect(() => {
    async function loadDistributors() {
      try {
        setLoadingDistributors(true)
        const res = await fetchDistributors()
        if (res.success && res.data) {
          setDistributors(res.data)
          if (res.data.length > 0) {
            setDistributorId(res.data[0]._id)
          }
        } else {
          setError('Failed to fetch distributor list. Check server status.')
        }
      } catch (err: any) {
        console.error('Error fetching distributors:', err)
        setError('Error connecting to backend to fetch distributors.')
      } finally {
        setLoadingDistributors(false)
      }
    }
    loadDistributors()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Form validation
    if (!name.trim()) return setError('Product name is required')
    if (!sku.trim()) return setError('SKU is required')
    if (!description.trim()) return setError('Product description is required')
    if (!price || isNaN(Number(price)) || Number(price) < 0) return setError('Valid price (>= 0) is required')
    if (!brand.trim()) return setError('Brand name is required')
    if (!imageUrl.trim()) return setError('Image URL is required')
    if (!category) return setError('Category is required')
    if (!distributorId) return setError('Distributor is required')
    if (!batchNumber.trim()) return setError('Batch number is required')
    if (!stockQuantity || isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) return setError('Valid stock quantity (>= 0) is required')
    if (!expiryDate) return setError('Expiry date is required')

    try {
      setSubmitting(true)
      
      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        description: description.trim(),
        price: Number(price),
        brand: brand.trim(),
        imageUrl: imageUrl.trim(),
        category,
        flavourTags: flavourTags.split(',').map(t => t.trim()).filter(Boolean),
        distributorId,
        batchNumber: batchNumber.trim(),
        stockQuantity: Number(stockQuantity),
        expiryDate,
      }

      const res = await createProduct(payload)
      
      if (res.success) {
        setSuccess('Product and linked Inventory batch created successfully!')
        setName('')
        setSku('')
        setDescription('')
        setPrice('')
        setBrand('')
        setImageUrl('')
        setFlavourTags('')
        setBatchNumber('')
        setStockQuantity('10')
        setExpiryDate('')
        
        // Wait 1.5 seconds then redirect back to inventory list
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

      <form onSubmit={handleSubmit} className="space-y-8">
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Details Section */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-3">1. Product Static Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., 100% Whey Gold Standard"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="e.g., WHEY-GOLD-2LB"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition uppercase"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="e.g., Optimum Nutrition"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g., 74.99"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                    disabled={submitting}
                  >
                    <option value="Protein">Protein</option>
                    <option value="Pre-workout">Pre-workout</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Product Description *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the product benefits, ingredients, and size..."
                  rows={3}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition resize-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Flavour Tags (comma-separated)</label>
                <input
                  type="text"
                  value={flavourTags}
                  onChange={e => setFlavourTags(e.target.value)}
                  placeholder="Chocolate, Vanilla, Strawberry"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Distributor *</label>
                {loadingDistributors ? (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    Loading distributors...
                  </div>
                ) : (
                  <select
                    value={distributorId}
                    onChange={e => setDistributorId(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                    required
                    disabled={submitting}
                  >
                    {distributors.length === 0 ? (
                      <option value="" disabled>No distributors available</option>
                    ) : (
                      distributors.map(dist => (
                        <option key={dist._id} value={dist._id}>
                          {dist.name} ({dist.contactEmail})
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Details Section */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-3">2. Initial Batch Inventory</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={e => setBatchNumber(e.target.value)}
                    placeholder="e.g., BATCH-OPT-001"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition uppercase"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(e.target.value)}
                    placeholder="e.g., 24"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                    required
                    disabled={submitting}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 mt-6 flex justify-end gap-3">
              <Link
                href="/admin/inventory"
                className="rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3.5 text-sm font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || loadingDistributors}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 text-amber-400" />
                    Save Product SKU
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
