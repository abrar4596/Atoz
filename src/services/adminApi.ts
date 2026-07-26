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

export async function createProduct(payload: FormData) {
  const response = await apiClient.post('/admin/products', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateProduct(id: string, payload: FormData) {
  const response = await apiClient.put(`/admin/products/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function fetchDistributors() {
  const response = await apiClient.get('/admin/distributors')
  return response.data
}

export async function fetchProductPreview(id: string) {
  const response = await apiClient.get(`/admin/products/${id}`)
  return response.data
}

export async function fetchAdminOrders() {
  const response = await apiClient.get('/admin/orders')
  return response.data
}

export async function updateAdminOrderStatus(id: string, status: string) {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, { status })
  return response.data
}



