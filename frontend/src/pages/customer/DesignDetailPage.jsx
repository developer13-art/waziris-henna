import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { useFavorites } from '../../context/FavoritesContext'
import { toast } from 'react-toastify'

function DesignDetailPage() {
  const { slug } = useParams()
  const [design, setDesign] = useState(null)
  const [similarDesigns, setSimilarDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    fetchDesign()
  }, [slug])

  const fetchDesign = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`${endpoints.designs}/${slug}`)
      setDesign(response.data)
      
      // Fetch similar designs
      const similarRes = await api.get(`${endpoints.designs}/${response.data.id}/similar`)
      setSimilarDesigns(similarRes.data || [])
    } catch (error) {
      console.error('Error fetching design:', error)
      toast.error('Failed to load design')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />
  if (!design) return <div className="text-center py-20">Design not found</div>

  return (
    <>
      <Helmet>
        <title>{design.title} | Waziri's Henna</title>
        <meta name="description" content={design.description?.substring(0, 160)} />
      </Helmet>

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <img
                src={design.image_url}
                alt={design.title}
                className="rounded-3xl shadow-2xl border-4 border-white w-full h-[500px] object-cover"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <span className="section-tag">{design.category_name || 'Design'}</span>
                <h1 className="font-playfair text-4xl font-bold mt-3">{design.title}</h1>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {design.style && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{design.style}</span>}
                {design.occasion && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{design.occasion}</span>}
                {design.body_area && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{design.body_area}</span>}
                <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#8B5E3C] rounded-full text-sm">{design.complexity}</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{design.description}</p>

              {design.price && (
                <p className="text-[#8B5E3C] font-bold text-2xl">
                  ₦{parseFloat(design.price).toLocaleString()}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span><i className="fas fa-eye mr-1"></i>{design.views_count || 0} views</span>
                <span><i className="fas fa-heart mr-1"></i>{design.saves_count || 0} saves</span>
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  to={`/booking?design=${design.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
                >
                  <i className="fas fa-calendar-check"></i> Book This Design
                </Link>
                <button
                  onClick={() => toggleFavorite(design)}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#D4AF37] text-[#8B5E3C] font-semibold rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors"
                >
                  <i className={`${isFavorite(design.id) ? 'fas text-red-500' : 'far'} fa-heart`}></i>
                  {isFavorite(design.id) ? 'Saved' : 'Save Design'}
                </button>
              </div>
            </motion.div>
          </div>

          {similarDesigns.length > 0 && (
            <div className="mt-20">
              <h2 className="font-playfair text-2xl font-bold mb-8">Similar Designs</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarDesigns.map((similar) => (
                  <Link key={similar.id} to={`/designs/${similar.slug}`} className="group">
                    <img
                      src={similar.image_url}
                      alt={similar.title}
                      className="rounded-2xl h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="font-semibold mt-3">{similar.title}</h3>
                    <p className="text-sm text-gray-500">{similar.style}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default DesignDetailPage