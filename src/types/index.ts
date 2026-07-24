export interface Distributor {
  _id: string
  name: string
  contactEmail: string
  contactPhone: string
  address: string
}

export interface Product {
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
  distributorId?: string | Distributor
  inventory: {
    totalStock: number
    status: string
    batches?: Array<{
      batchNumber: string
      stockQuantity: number
      expiryDate: string
      status: string
    }>
  }
}

export interface OrderItem {
  productId: string
  name: string
  brand: string
  flavour?: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: 'Pending' | 'Processing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered'
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  _id: string
  name: string
  phone: string
  googleId?: string
  loyaltyPoints: number
  isAdmin: boolean
}
