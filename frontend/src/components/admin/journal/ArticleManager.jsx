import React, { useState, useEffect } from 'react'
import ArticleTable from './ArticleTable'
import ArticleForm from './ArticleForm'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function ArticleManager() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.journal, { params: { per_page: 100 } })
      setArticles(response.data || [])
    } catch (error) {
      toast.error('Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return (
    <div>
      <button onClick={() => { setEditingArticle(null); setShowForm(true) }}
        className="mb-4 px-4 py-2 bg-[#D4AF37] text-white rounded-full font-semibold text-sm">
        <i className="fas fa-plus mr-1"></i> Write Article
      </button>
      {showForm && (
        <ArticleForm
          article={editingArticle}
          onSave={async (formData) => {
            try {
              if (editingArticle) {
                await api.put(endpoints.journalDetail(editingArticle.id), formData)
              } else {
                await api.post(endpoints.journal, formData)
              }
              toast.success('Article saved')
              setShowForm(false)
              fetchArticles()
            } catch (error) {
              toast.error('Failed to save article')
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {!showForm && (
        <ArticleTable
          articles={articles}
          isLoading={isLoading}
          onEdit={(article) => { setEditingArticle(article); setShowForm(true) }}
          onDelete={async (id) => {
            if (window.confirm('Delete this article?')) {
              await api.delete(endpoints.journalDetail(id))
              toast.success('Article deleted')
              fetchArticles()
            }
          }}
        />
      )}
    </div>
  )
}

export default ArticleManager