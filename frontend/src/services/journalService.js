import api, { endpoints } from './api'

export const journalService = {
  async getArticles(params = {}) {
    return await api.get(endpoints.journal, { params })
  },

  async getArticle(articleId) {
    return await api.get(endpoints.journalDetail(articleId))
  },

  async createArticle(articleData) {
    return await api.post(endpoints.journal, articleData)
  },

  async updateArticle(articleId, articleData) {
    return await api.put(endpoints.journalDetail(articleId), articleData)
  },

  async deleteArticle(articleId) {
    return await api.delete(endpoints.journalDetail(articleId))
  },
}