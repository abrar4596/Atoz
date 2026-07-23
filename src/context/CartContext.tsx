'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/components/storefront/ProductCard'

export interface CartItem {
  product: Product
  quantity: number
  selectedFlavour: string
  fulfillmentMethod: 'pickup' | 'shipping'
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, selectedFlavour: string) => void
  removeFromCart: (productId: string, selectedFlavour: string) => void
  updateQuantity: (productId: string, selectedFlavour: string, quantity: number) => void
  updateFulfillmentMethod: (productId: string, selectedFlavour: string, method: 'pickup' | 'shipping') => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleCart: () => void
  subtotal: number
  estimatedTax: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // 1. Load cart items from localStorage on mount (hydration safe)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('atoz_cart')
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // 2. Persist cart items to localStorage on state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('atoz_cart', JSON.stringify(cartItems))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [cartItems, isHydrated])

  const addToCart = (product: Product, selectedFlavour: string) => {
    setCartItems((prevItems) => {
      // Find if item already exists in cart with same product and flavour
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id && item.selectedFlavour === selectedFlavour
      )

      const stock = product.inventory?.totalStock ?? 0
      // If out of stock locally, fallback fulfillment method is shipping
      const initialFulfillment: 'pickup' | 'shipping' = stock > 0 ? 'pickup' : 'shipping'

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += 1
        return newItems
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            product,
            quantity: 1,
            selectedFlavour,
            fulfillmentMethod: initialFulfillment,
          },
        ]
      }
    })
    setIsOpen(true) // Automatically open drawer when item is added
  }

  const removeFromCart = (productId: string, selectedFlavour: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product._id === productId && item.selectedFlavour === selectedFlavour)
      )
    )
  }

  const updateQuantity = (productId: string, selectedFlavour: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedFlavour)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId && item.selectedFlavour === selectedFlavour
          ? { ...item, quantity }
          : item
      )
    )
  }

  const updateFulfillmentMethod = (
    productId: string,
    selectedFlavour: string,
    method: 'pickup' | 'shipping'
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId && item.selectedFlavour === selectedFlavour) {
          const stock = item.product.inventory?.totalStock ?? 0
          // Force shipping if local store is out of stock
          const finalMethod = stock <= 0 ? 'shipping' : method
          return { ...item, fulfillmentMethod: finalMethod }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleCart = () => {
    setIsOpen((prev) => !prev)
  }

  // Dynamic cost calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const estimatedTax = subtotal * 0.08 // 8% sales tax rate placeholder
  const total = subtotal + estimatedTax

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateFulfillmentMethod,
        clearCart,
        isOpen,
        setIsOpen,
        toggleCart,
        subtotal,
        estimatedTax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
