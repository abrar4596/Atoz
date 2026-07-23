import { apiClient } from './apiClient'

export interface OrderCheckoutItem {
  productId: string
  name: string
  brand: string
  flavour?: string
  quantity: number
  price: number
}

export interface CheckoutPayload {
  items: OrderCheckoutItem[]
  totalAmount: number
  status?: string
}

export async function submitCheckout(payload: CheckoutPayload) {
  const response = await apiClient.post('/orders/checkout', payload)
  return response.data
}

export async function fetchHistory() {
  const response = await apiClient.get('/orders/history')
  return response.data
}
