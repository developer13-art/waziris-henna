import api, { endpoints } from './api'

export const productService = {
  async getProducts(params = {}) {
    return await api.get(endpoints.products, { params })
  },

  async getProduct(productId) {
    return await api.get(endpoints.productDetail(productId))
  },

  async createProduct(productData) {
    return await api.post(endpoints.products, productData)
  },

  async updateProduct(productId, productData) {
    return await api.put(endpoints.productDetail(productId), productData)
  },

  async deleteProduct(productId) {
    return await api.delete(endpoints.productDetail(productId))
  },

  async adjustInventory(productId, inventoryData) {
    return await api.post(endpoints.productInventory(productId), inventoryData)
  },

  async getInventoryHistory(productId) {
    return await api.get(endpoints.productInventory(productId))
  },
}