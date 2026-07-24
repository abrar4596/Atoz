'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react'
import { fetchDistributors } from '@/services/adminApi'

interface Distributor {
  _id: string
  name: string
  contactEmail: string
  contactPhone: string
  address: string
}

interface ProductFormProps {
  initialData?: {
    product: {
      _id: string
      name: string
      sku: string
      description: string
      price: number
      brand: string
      imageUrl?: string
      imageUrls?: string[]
      category: string
      flavourTags: string[]
      distributorId: string
    }
    inventory?: {
      batchNumber: string
      stockQuantity: number
      expiryDate: string
    }
  }
  onSubmit: (formData: FormData) => Promise<void>
  submitting: boolean
  submitButtonText?: string
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitting,
  submitButtonText = 'Save Product SKU'
}: ProductFormProps) {
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [loadingDistributors, setLoadingDistributors] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Product states
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
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
          if (res.data.length > 0 && !distributorId) {
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

  useEffect(() => {
    if (initialData) {
      setName(initialData.product.name || '')
      setSku(initialData.product.sku || '')
      setDescription(initialData.product.description || '')
      setPrice(String(initialData.product.price || ''))
      setBrand(initialData.product.brand || '')
      setCategory(initialData.product.category || 'Protein')
      setFlavourTags(initialData.product.flavourTags?.join(', ') || '')
      setDistributorId(initialData.product.distributorId || '')

      // Handle multi-image initialization
      if (initialData.product.imageUrls && initialData.product.imageUrls.length > 0) {
        setExistingImages(initialData.product.imageUrls)
      } else if (initialData.product.imageUrl) {
        setExistingImages([initialData.product.imageUrl])
      } else {
        setExistingImages([])
      }

      if (initialData.inventory) {
        setBatchNumber(initialData.inventory.batchNumber || '')
        setStockQuantity(String(initialData.inventory.stockQuantity ?? '0'))
        if (initialData.inventory.expiryDate) {
          const date = new Date(initialData.inventory.expiryDate)
          if (!isNaN(date.getTime())) {
            setExpiryDate(date.toISOString().split('T')[0])
          }
        }
      }
    }
  }, [initialData])

  useEffect(() => {
    if (distributors.length > 0 && !distributorId) {
      if (initialData?.product?.distributorId) {
        setDistributorId(initialData.product.distributorId)
      } else {
        setDistributorId(distributors[0]._id)
      }
    }
  }, [distributors, initialData])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const totalCount = existingImages.length + selectedFiles.length + newFiles.length
      if (totalCount > 5) {
        setError('A product can have a maximum of 5 images. Selection blocked.')
        e.target.value = ''
        return
      }
      setSelectedFiles(prev => [...prev, ...newFiles])
      e.target.value = ''
    }
  }

  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Form validation
    if (!name.trim()) return setError('Product name is required')
    if (!sku.trim()) return setError('SKU is required')
    if (!description.trim()) return setError('Product description is required')
    if (!price || isNaN(Number(price)) || Number(price) < 0) return setError('Valid price (>= 0) is required')
    if (!brand.trim()) return setError('Brand name is required')
    
    const totalImagesCount = existingImages.length + selectedFiles.length
    if (totalImagesCount === 0) return setError('At least one product image is required')
    if (totalImagesCount > 5) return setError('A product can have a maximum of 5 images')
    
    if (!category) return setError('Category is required')
    if (!distributorId) return setError('Distributor is required')
    if (!batchNumber.trim()) return setError('Batch number is required')
    if (!stockQuantity || isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) return setError('Valid stock quantity (>= 0) is required')
    if (!expiryDate) return setError('Expiry date is required')

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('sku', sku.trim().toUpperCase())
      formData.append('description', description.trim())
      formData.append('price', price)
      formData.append('brand', brand.trim())
      
      // Append existing images
      existingImages.forEach(img => {
        formData.append('existingImages', img)
      })

      // Append new files
      selectedFiles.forEach(file => {
        formData.append('images', file)
      })

      formData.append('category', category)
      formData.append('flavourTags', flavourTags)
      formData.append('distributorId', distributorId)
      formData.append('batchNumber', batchNumber.trim())
      formData.append('stockQuantity', stockQuantity)
      formData.append('expiryDate', expiryDate)

      await onSubmit(formData)
    } catch (err: any) {
      console.error('Form submission error:', err)
      const msg = err.response?.data?.error || err.message || 'Error occurred while submitting form.'
      setError(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
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
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition uppercase text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
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
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition resize-none text-zinc-900"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">
                Product Gallery (Max 5 images) *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white file:hover:bg-zinc-800 cursor-pointer"
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-zinc-400">
                Select multiple files at once. Total images (existing + new) must not exceed 5.
              </p>

              {/* Previews Grid */}
              {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* Existing Images */}
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 group">
                      <img
                        src={url}
                        alt={`Existing ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1.5 shadow transition cursor-pointer"
                          title="Remove image"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-zinc-900/80 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Saved
                      </span>
                    </div>
                  ))}

                  {/* Selected Files */}
                  {selectedFiles.map((file, idx) => (
                    <FilePreview
                      key={`new-${idx}`}
                      file={file}
                      onRemove={() => removeSelectedFile(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Flavour Tags (comma-separated)</label>
              <input
                type="text"
                value={flavourTags}
                onChange={e => setFlavourTags(e.target.value)}
                placeholder="Chocolate, Vanilla, Strawberry"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition uppercase text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition text-zinc-900"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-55 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3.5 text-sm font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting || loadingDistributors}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 text-amber-400" />
                  {submitButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  if (!preview) return null

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 group">
      <img
        src={preview}
        alt={file.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1.5 shadow transition cursor-pointer"
          title="Remove file"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <span className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
        New
      </span>
    </div>
  )
}
