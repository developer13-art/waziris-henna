import api, { endpoints } from './api'

export const designService = {
  async getDesigns(params = {}) {
    return await api.get(endpoints.designs, { params })
  },

  async getDesign(designId) {
    return await api.get(endpoints.designDetail(designId))
  },

  async getSimilarDesigns(designId) {
    return await api.get(endpoints.similarDesigns(designId))
  },

  async createDesign(designData) {
    return await api.post(endpoints.designs, designData)
  },

  async updateDesign(designId, designData) {
    return await api.put(endpoints.designDetail(designId), designData)
  },

  async deleteDesign(designId) {
    return await api.delete(endpoints.designDetail(designId))
  },

  async getCategories() {
    return await api.get(endpoints.categories)
  },

  async createCategory(categoryData) {
    return await api.post(endpoints.categories, categoryData)
  },

  async updateCategory(categoryId, categoryData) {
    return await api.put(endpoints.categoryDetail(categoryId), categoryData)
  },
}