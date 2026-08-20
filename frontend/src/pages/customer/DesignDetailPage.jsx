import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import { useFavorites } from '../../context/FavoritesContext'
import { getImageUrl } from '../../utils/imageUrl'
import { toast } from 'react-toastify'

function DesignDetailPage() {
  const { slug } = useParams()
  const [design, setDesign] = useState(null)
  const [similarDesigns, setSimilarDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    fetchDesign()
  }, [slug])

  const fetchDesign = async () => {
    setIsLoading(true)
    setImageError(false)
    try {
      const response = await api.get(`${endpoints.designs}/${slug}`)
      console.log('Design data:', response.data)
      setDesign(response.data)

      if (response.data?.id) {
        try {
          const similarRes = await api.get(endpoints.similarDesigns(response.data.id))
          setSimilarDesigns(Array.isArray(similarRes.data) ? similarRes.data : [])
        } catch (err) {
          console.error('Error fetching similar designs:', err)
          setSimilarDesigns([])
        }
      }
    } catch (error) {
      console.error('Error fetching design:', error)
      toast.error('Failed to load design')
      setDesign(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
      </div>
    )
  }

  if (!design) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'Poppins, sans-serif' }}>
        <i className="fas fa-search" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Design Not Found</h2>
        <Link to="/designs" style={{ color: '#8B5E3C', fontWeight: '600' }}>← Back to Designs</Link>
      </div>
    )
  }

  const designImageUrl = getImageUrl(design.image_url)
  console.log('Design image URL:', designImageUrl)

  return (
    <>
      <Helmet>
        <title>{design.title} | Waziri's Henna</title>
      </Helmet>

      <div style={{ fontFamily: 'Poppins, sans-serif', padding: '120px 20px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <Link to="/designs" style={{ color: '#8B5E3C', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          <i className="fas fa-arrow-left mr-2"></i> Back to Designs
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '30px' }}>
          {/* Image Section */}
          <div>
            {design.image_url && !imageError ? (
              <img
                src={designImageUrl}
                alt={design.title}
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '4px solid #fff',
                  display: 'block'
                }}
                onError={(e) => {
                  console.error('Image failed to load:', designImageUrl)
                  setImageError(true)
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '500px',
                background: '#f9fafb',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <i className="fas fa-image" style={{ fontSize: '60px', color: '#ddd' }}></i>
                <p style={{ color: '#999' }}>No image available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
              {design.title}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {design.style && (
                <span style={{ padding: '4px 12px', background: '#f3f4f6', borderRadius: '50px', fontSize: '13px' }}>
                  {design.style}
                </span>
              )}
              {design.occasion && (
                <span style={{ padding: '4px 12px', background: '#f3f4f6', borderRadius: '50px', fontSize: '13px' }}>
                  {design.occasion}
                </span>
              )}
              {design.body_area && (
                <span style={{ padding: '4px 12px', background: '#f3f4f6', borderRadius: '50px', fontSize: '13px' }}>
                  {design.body_area}
                </span>
              )}
              <span style={{ padding: '4px 12px', background: 'rgba(212, 175, 55, 0.1)', color: '#8B5E3C', borderRadius: '50px', fontSize: '13px' }}>
                {design.complexity}
              </span>
            </div>

            {design.description && (
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '20px' }}>
                {design.description}
              </p>
            )}

            {design.price && (
              <p style={{ fontSize: '28px', color: '#8B5E3C', fontWeight: '700', marginBottom: '20px' }}>
                ₦{parseFloat(design.price).toLocaleString()}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to={`/booking?design=${design.id}`}
                style={{
                  padding: '14px 28px',
                  background: '#D4AF37',
                  color: '#fff',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                <i className="fas fa-calendar-check mr-2"></i> Book This Design
              </Link>
              <button
                onClick={() => toggleFavorite(design)}
                style={{
                  padding: '14px 28px',
                  background: isFavorite(design.id) ? '#ef4444' : '#fff',
                  color: isFavorite(design.id) ? '#fff' : '#8B5E3C',
                  border: `2px solid ${isFavorite(design.id) ? '#ef4444' : '#D4AF37'}`,
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <i className={`${isFavorite(design.id) ? 'fas' : 'far'} fa-heart mr-2`}></i>
                {isFavorite(design.id) ? 'Saved' : 'Save Design'}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Designs */}
        {similarDesigns.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Similar Designs
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {similarDesigns.map((similar) => (
                <Link key={similar.id} to={`/designs/${similar.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {similar.image_url ? (
                    <img
                      src={getImageUrl(similar.image_url)}
                      alt={similar.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '200px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-image" style={{ fontSize: '40px', color: '#ddd' }}></i>
                    </div>
                  )}
                  <p style={{ fontWeight: '600', fontSize: '14px', marginTop: '8px' }}>{similar.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DesignDetailPage