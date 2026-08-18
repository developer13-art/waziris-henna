import React, { useState } from 'react'
import ReviewsList from './ReviewsList'

function ReviewModeration({ reviews }) {
  const [filter, setFilter] = useState('Pending')

  const filteredReviews = reviews.filter(review => 
    filter === 'All' ? true : review.status === filter
  )

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button key={status} onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filter === status ? 'bg-[#8B5E3C] text-white' : 'bg-white text-gray-600'
            }`}>
            {status}
          </button>
        ))}
      </div>
      <ReviewsList reviews={filteredReviews} />
    </div>
  )
}

export default ReviewModeration