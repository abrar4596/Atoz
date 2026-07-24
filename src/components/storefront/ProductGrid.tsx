'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, AlertCircle, RefreshCw, SlidersHorizontal, Package, Check, Store } from 'lucide-react'
import ProductCard, { Product } from './ProductCard'
import { fetchProducts as fetchProductsApi } from '@/services/productApi'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [localPickupOnly, setLocalPickupOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured')

  const categories = ['All', 'Protein', 'Pre-workout', 'Vitamins', 'Accessories']

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchProductsApi()
      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data)
      } else {
        throw new Error('Unexpected data format returned from server.')
      }
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err.message || 'An unexpected error occurred while fetching the catalog.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase()

      const stock = product.inventory?.totalStock ?? 0
      const matchesPickup = !localPickupOnly || stock > 0

      return matchesSearch && matchesCategory && matchesPickup
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price
      }
      if (sortBy === 'price-high') {
        return b.price - a.price
      }
      return 0
    })

  const loadMockData = () => {
    const mockProducts: Product[] = [
      {
        _id: 'mock-1',
        name: '100% Whey Gold Standard Protein',
        sku: 'WHEY-GS-5LB',
        description: 'Premium whey protein isolate for muscle support and recovery.',
        price: 7499,
        brand: 'Optimum Nutrition',
        imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300&auto=format&fit=crop',
        category: 'Protein',
        flavourTags: ['Double Rich Chocolate', 'Extreme Milk Chocolate', 'Vanilla Ice Cream'],
        inventory: {
          totalStock: 12,
          status: 'In_Stock'
        }
      },
      {
        _id: 'mock-2',
        name: 'C4 Original Pre-Workout Powder',
        sku: 'C4-ORIG-30SRV',
        description: 'Explosive energy, heightened focus, and an overwhelming urge to tackle any challenge.',
        price: 3999,
        brand: 'Cellucor',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop',
        category: 'Pre-workout',
        flavourTags: ['Fruit Punch', 'Blue Razz Ice', 'Cherry Limeade'],
        inventory: {
          totalStock: 0,
          status: 'Out_Of_Stock'
        }
      },
      {
        _id: 'mock-3',
        name: 'Daily Multivitamin Pack for Men',
        sku: 'VIT-MEN-30PK',
        description: 'Comprehensive nutritional support tailored specifically for active men.',
        price: 2499,
        brand: 'Animal Pak',
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=300&auto=format&fit=crop',
        category: 'Vitamins',
        flavourTags: [],
        inventory: {
          totalStock: 4,
          status: 'In_Stock'
        }
      },
      {
        _id: 'mock-4',
        name: 'Stainless Steel Shaker Bottle 24oz',
        sku: 'SHKER-SS-24',
        description: 'Double-walled vacuum insulated shaker to keep your protein shakes freezing cold.',
        price: 2999,
        brand: 'BlenderBottle',
        imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=300&auto=format&fit=crop',
        category: 'Accessories',
        flavourTags: ['Matte Black', 'Silver Metallic', 'Military Green'],
        inventory: {
          totalStock: 0,
          status: 'Out_Of_Stock'
        }
      },
      {
        _id: 'mock-5',
        name: 'Creatine Monohydrate Pure Powder',
        sku: 'CREA-PURE-500G',
        description: '100% pure micronized creatine monohydrate for strength and muscle power.',
        price: 3499,
        brand: 'MusclePharm',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop',
        category: 'Protein',
        flavourTags: ['Unflavoured'],
        inventory: {
          totalStock: 8,
          status: 'In_Stock'
        }
      }
    ]
    setProducts(mockProducts)
    setError(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-10 text-center md:text-left md:flex md:items-center md:justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center justify-center md:justify-start gap-2">
            AtoZ Supplements Catalog
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Browse authentic health & wellness essentials with real-time local availability.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex justify-center items-center gap-3">
          {error && (
            <button 
              onClick={loadMockData}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 rounded-lg px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 cursor-pointer"
            >
              Load Demo Products
            </button>
          )}
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 transition cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 bg-white dark:bg-zinc-950/40 p-4 sm:p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-xs">
        
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search products by name, brand, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 focus:bg-white dark:bg-zinc-900/50 dark:focus:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setLocalPickupOnly(!localPickupOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                localPickupOnly
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-505 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400'
                  : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-400'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              Pickup In-Store Only
              {localPickupOnly && <Check className="h-3 w-3 ml-0.5" />}
            </button>

            <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 bg-zinc-50/50 dark:bg-zinc-900/50">
              <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-0 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 overflow-x-auto no-scrollbar">
          <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mr-2 whitespace-nowrap">
            Categories:
          </span>
          <div className="flex gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-100/50 hover:bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-4 animate-pulse">
              <div className="aspect-square w-full rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 mb-4" />
              <div className="h-3 w-16 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md mb-2" />
              <div className="h-4 w-3/4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md mb-3" />
              <div className="h-5 w-20 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md mb-4" />
              <div className="mt-auto h-9 w-full bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-red-200 bg-red-50/20 dark:border-red-900/30 dark:bg-red-950/10 max-w-xl mx-auto my-8">
          <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
            Unable to connect to the catalog API
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-6">
            Make sure the backend server is running. {error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={loadMockData}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Use Demo/Mock Catalog
            </button>
          </div>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4 shadow-xs">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-1">
            No supplements found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
            We couldn't find any products matching your search or filters. Try adjusting them.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
              setLocalPickupOnly(false)
            }}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium px-1">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {localPickupOnly && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Store className="h-3.5 w-3.5" /> Filtered by store stock
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
