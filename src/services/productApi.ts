import { apiClient } from './apiClient'

export interface FetchProductsParams {
  category?: string
  brand?: string
  localAvailability?: boolean
}

export async function fetchProducts(params?: FetchProductsParams) {
  const response = await apiClient.get('/products', {
    params: {
      category: params?.category,
      brand: params?.brand,
      localAvailability: params?.localAvailability ? 'true' : undefined,
    },
  })
  return response.data
}

export async function fetchProductById(id: string) {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}
