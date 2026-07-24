'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Trash2,
  Pencil,
  PlusCircle,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  PackageCheck,
  Tag,
  DollarSign,
  Eye
} from 'lucide-react'
import { apiClient } from '@/services/apiClient'
import { fetchProducts } from '@/services/productApi'
import { formatCurrency } from '@/lib/utils'

interface ProductInventory {
  totalStock: number
  status: 'In_Stock' | 'Low_Stock' | 'Out_Of_Stock'
}

interface Product {
  _id: string
  name: string
  sku: string
  brand: string
  price: number
  category: string
  imageUrl?: string
  imageUrls?: string[]
  inventory?: ProductInventory
}

interface ToastMessage {
  message: string
  type: 'success' | 'error'
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Fetch all products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetchProducts()
        if (res.success && res.data) {
          setProducts(res.data)
        } else {
          showToast(res.error || 'Failed to fetch catalog items', 'error')
        }
      } catch (err: any) {
        console.error('Error fetching catalog:', err)
        const msg = err.response?.data?.error || err.message || 'Unable to connect to products catalog API'
        showToast(msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(current => current?.message === message ? null : current)
    }, 4500)
  }

  // Handle product deletion confirmation
  const handleConfirmDelete = async () => {
    if (!selectedProductToDelete) return

    try {
      setIsDeleting(true)
      const productId = selectedProductToDelete._id

      // Send DELETE request via Axios
      const res = await apiClient.delete('/admin/products/' + productId)

      if (res.data?.success) {
        // Close modal
        setSelectedProductToDelete(null)
        showToast(res.data.message || 'Product deleted successfully', 'success')
        
        // Immediately update the local React state (filter out the deleted product)
        setProducts(currentProducts => currentProducts.filter(p => p._id !== productId))
      } else {
        throw new Error(res.data?.error || 'Failed to delete product')
      }
    } catch (err: any) {
      console.error('Deletion error:', err)
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred during deletion.'
      showToast(errorMsg, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter products by search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // List of distinct categories for filtering
  const categories = ['All', 'Protein', 'Pre-workout', 'Vitamins', 'Accessories']

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-55 flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl transition-all duration-300 transform translate-y-0 animate-slide-in ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          )}
          <p className="text-sm font-semibold">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-3 text-zinc-400 hover:text-zinc-600 transition p-0.5 rounded-full hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin Control</p>
          <h1 className="mt-2 text-3xl font-bold">Product Catalog Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            View, audit, search, and delete active supplement SKUs and inventory records in the database.
          </p>
        </div>
        <Link
          href="/admin/catalog/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 py-3.5 text-sm font-semibold transition shadow-md self-start md:self-center"
        >
          <PlusCircle className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, SKU or brand..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-650"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 self-stretch sm:self-auto justify-end">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition ${
                categoryFilter === cat
                  ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-zinc-500 text-sm">Loading product catalog database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 rounded-3xl border border-dashed border-zinc-200 bg-white p-6 shadow-sm text-center">
          <PackageCheck className="h-12 w-12 text-zinc-300" />
          <h3 className="text-lg font-bold text-zinc-800">No products found</h3>
          <p className="text-sm text-zinc-500 max-w-sm">
            {searchQuery || categoryFilter !== 'All'
              ? 'Try modifying your search query or category filters to find products.'
              : 'The product catalog is currently empty. Get started by adding a product.'}
          </p>
          {(searchQuery || categoryFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('All')
              }}
              className="mt-2 text-sm font-semibold text-amber-600 hover:text-amber-500 underline transition"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-xs">Product Details</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-xs">SKU</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-xs">Category</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-xs">Stock Level</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredProducts.map(product => {
                  const stock = product.inventory?.totalStock ?? 0
                  const isLow = stock > 0 && stock < 3
                  const isOut = stock === 0

                  return (
                    <tr key={product._id} className="text-zinc-700 hover:bg-zinc-50/50 transition">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/catalog/${product._id}`}
                          className="flex items-center gap-4 group/item cursor-pointer"
                        >
                          <img
                            src={product.imageUrls?.[0] || product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl object-cover border border-zinc-200 bg-zinc-50 flex-shrink-0 group-hover/item:border-zinc-850 transition"
                            onError={e => {
                              ;(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=120'
                            }}
                          />
                          <div>
                            <div className="font-bold text-zinc-950 leading-snug group-hover/item:text-amber-500 transition-colors duration-200">{product.name}</div>
                            <div className="text-xs text-zinc-500 font-semibold">{product.brand}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-bold text-zinc-600">{product.sku}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-800">
                          <Tag className="h-3 w-3" />
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-950">{stock}</span>
                          {isOut ? (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              Out
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              Low
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              OK
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-zinc-900">{formatCurrency(product.price)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/catalog/${product._id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 hover:border-zinc-800 hover:bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Link>
                          <Link
                            href={`/admin/catalog/${product._id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 hover:border-amber-500 hover:bg-amber-50 px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-amber-600 transition cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSelectedProductToDelete(product)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 hover:border-rose-200 hover:bg-rose-55 px-3 py-2 text-xs font-semibold text-zinc-650 hover:text-rose-650 transition cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Safety Confirmation Modal */}
      {selectedProductToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-8">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl animate-scale-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600 font-semibold">Critical Guard</p>
                <h3 className="mt-2 text-xl font-bold text-zinc-950">Delete Product</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isDeleting) setSelectedProductToDelete(null)
                }}
                className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 transition"
                disabled={isDeleting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-zinc-950">"{selectedProductToDelete.name}"</span>?
              </p>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 flex gap-3 shadow-inner">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  This will perform a cascading cleanup and permanently remove the product details and all linked inventory batches. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedProductToDelete(null)}
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[130px] shadow-md shadow-rose-200"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
