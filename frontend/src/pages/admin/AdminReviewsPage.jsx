import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Pending')

  const fetchReviews = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.reviews)
      setReviews(response.data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleUpdateStatus = async (reviewId, status) => {
    try {
      await api.put(endpoints.reviewDetail(reviewId), { status })
      toast.success(`Review ${status.toLowerCase()} successfully`)
      fetchReviews()
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error('Failed to update review')
    }
  }

  const handleToggleFeatured = async (review) => {
    try {
      await api.put(endpoints.reviewDetail(review.id), { is_featured: !review.is_featured })
      toast.success('Review featured status updated')
      fetchReviews()
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error('Failed to update review')
    }
  }

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(endpoints.reviewDetail(reviewId))
        toast.success('Review deleted successfully')
        fetchReviews()
      } catch (error) {
        console.error('Error deleting review:', error)
        toast.error('Failed to delete review')
      }
    }
  }

  const filteredReviews = reviews.filter(review => 
    statusFilter === 'All' ? true : review.status === statusFilter
  )

  return (
    <>
      <Helmet>
        <title>Manage Reviews | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reviews Management</h2>
        <p className="text-gray-500">Moderate and manage customer reviews</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              statusFilter === status
                ? 'bg-[#8B5E3C] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              No reviews found
            </div>
          ) : (
            filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#8B5E3C] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      {review.customer_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-semibold">{review.customer_name}</p>
                      <p className="text-xs text-gray-500">{review.review_type} • {new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      review.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {review.status}
                    </span>
                    {review.is_featured && (
                      <span className="px-3 py-1 bg-[#D4AF37] text-[#222] text-xs font-semibold rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[#D4AF37] mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>

                {review.title && (
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                )}
                <p className="text-gray-600 mb-4">{review.comment}</p>

                <div className="flex gap-2">
                  {review.status !== 'Approved' && (
                    <button
                      onClick={() => handleUpdateStatus(review.id, 'Approved')}
                      className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <i className="fas fa-check mr-1"></i> Approve
                    </button>
                  )}
                  {review.status !== 'Rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(review.id, 'Rejected')}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-times mr-1"></i> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleFeatured(review)}
                    className="px-4 py-2 bg-[#D4AF37] text-[#222] text-sm font-semibold rounded-lg hover:bg-[#b8941f] transition-colors"
                  >
                    <i className="fas fa-star mr-1"></i>
                    {review.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <i className="fas fa-trash mr-1"></i> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </>
  )
}

export default AdminReviewsPage