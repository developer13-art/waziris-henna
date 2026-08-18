import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminJournalPage() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Guides',
    excerpt: '',
    content: '',
    image_url: '',
    author: "Waziri's Henna",
    tags: '',
    is_published: false,
  })

  const fetchArticles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.journal, { params: { per_page: 50 } })
      setArticles(response.data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      toast.error('Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const openCreateModal = () => {
    setEditingArticle(null)
    setFormData({
      title: '',
      category: 'Guides',
      excerpt: '',
      content: '',
      image_url: '',
      author: "Waziri's Henna",
      tags: '',
      is_published: false,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt || '',
      content: article.content || '',
      image_url: article.image_url || '',
      author: article.author || "Waziri's Henna",
      tags: article.tags || '',
      is_published: article.is_published,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingArticle) {
        await api.put(endpoints.journalDetail(editingArticle.id), formData)
        toast.success('Article updated successfully')
      } else {
        await api.post(endpoints.journal, formData)
        toast.success('Article created successfully')
      }
      setIsModalOpen(false)
      fetchArticles()
    } catch (error) {
      console.error('Error saving article:', error)
      toast.error(error.response?.data?.message || 'Failed to save article')
    }
  }

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(endpoints.journalDetail(articleId))
        toast.success('Article deleted successfully')
        fetchArticles()
      } catch (error) {
        console.error('Error deleting article:', error)
        toast.error('Failed to delete article')
      }
    }
  }

  const categories = ['Guides', 'Tutorials', 'Culture', 'Tips', 'Inspiration']

  return (
    <>
      <Helmet>
        <title>Manage Journal | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Journal Management</h2>
          <p className="text-gray-500">Create and manage henna-related articles</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Write Article
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              No articles yet. Click "Write Article" to create your first post.
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        {article.category} • {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {article.excerpt && (
                  <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    <i className="fas fa-eye mr-1"></i>{article.views_count || 0} views
                  </span>
                  <div className="flex-1"></div>
                  <button
                    onClick={() => openEditModal(article)}
                    className="px-4 py-2 bg-[#8B5E3C] text-white text-sm font-semibold rounded-lg hover:bg-[#6B4423] transition-colors"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-trash mr-1"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-playfair text-xl font-semibold">
                  {editingArticle ? 'Edit Article' : 'Write New Article'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block font-semibold text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-sm mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Excerpt</label>
                  <input
                    type="text"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the article..."
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="8"
                    placeholder="Write your article content here..."
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="/hennah/images/journal/..."
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="henna, bridal, care"
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Publish immediately</span>
                </label>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#b8941f] transition-colors"
                >
                  {editingArticle ? 'Update Article' : 'Create Article'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminJournalPage