import { apiClient } from './apiClient'

export async function fetchAlerts() {
  const response = await apiClient.get('/admin/inventory')
  return response.data
}

export async function sendPurchaseOrder(productId: string) {
  const response = await apiClient.post('/admin/reorder', { productId })
  return response.data
}

export async function fetchStats() {
  const response = await apiClient.get('/admin/stats')
  return response.data
}

export async function createProduct(payload: any) {
  const response = await apiClient.post('/admin/products', payload)
  return response.data
}

export async function fetchDistributors() {
  const response = await apiClient.get('/admin/distributors')
  return response.data
}

