import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function ArticleDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`${endpoints.journal}/${slug}`)
      setArticle(response.data)
    } catch (error) {
      console.error('Error fetching article:', error)
      toast.error('Failed to load article')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />
  if (!article) return <div className="text-center py-20">Article not found</div>

  return (
    <>
      <Helmet>
        <title>{article.title} | Waziri's Henna Journal</title>
        <meta name="description" content={article.excerpt || article.title} />
      </Helmet>

      <section className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/journal" className="text-[#8B5E3C] font-semibold hover:text-[#D4AF37] mb-6 inline-block">
            <i className="fas fa-arrow-left mr-2"></i> Back to Journal
          </Link>
          
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-72 object-cover"
              />
            )}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#D4AF37] text-[#222] text-xs font-semibold rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(article.published_at || article.created_at).toLocaleDateString('en-NG', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">{article.title}</h1>
              <p className="text-gray-500 mb-6">By {article.author}</p>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                {article.content}
              </div>
              {article.tags && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                  {article.tags.split(',').map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ArticleDetailPage