import React from 'react'

function ReviewsList({ reviews, onApprove, onReject, onFeature, onDelete }) {
  if (reviews.length === 0) {
    return <div className="text-center py-10 text-gray-500">No reviews found</div>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                {review.customer_name?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="font-semibold">{review.customer_name}</p>
                <p className="text-xs text-gray-500">{review.review_type}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              review.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {review.status}
            </span>
          </div>
          <div className="text-[#D4AF37] mb-2">
            {Array.from({ length: review.rating }).map((_, i) => <i key={i} className="fas fa-star"></i>)}
          </div>
          <p className="text-gray-600 mb-4">{review.comment}</p>
          <div className="flex gap-2">
            {onApprove && review.status !== 'Approved' && (
              <button onClick={() => onApprove(review.id)} className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg">Approve</button>
            )}
            {onReject && review.status !== 'Rejected' && (
              <button onClick={() => onReject(review.id)} className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg">Reject</button>
            )}
            {onFeature && (
              <button onClick={() => onFeature(review)} className="px-3 py-1.5 bg-[#D4AF37] text-[#222] text-xs rounded-lg">
                {review.is_featured ? 'Unfeature' : 'Feature'}
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(review.id)} className="px-3 py-1.5 bg-gray-200 text-xs rounded-lg">Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewsList