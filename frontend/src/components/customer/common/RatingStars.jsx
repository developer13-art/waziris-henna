import React from 'react'

function RatingStars({ rating, size = 'text-base', interactive = false, onChange }) {
  const [hoverRating, setHoverRating] = React.useState(0)

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${size} ${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors ${
            (hoverRating || rating) >= star ? 'text-[#D4AF37]' : 'text-gray-300'
          }`}
          aria-label={`${star} star`}
        >
          <i className="fas fa-star"></i>
        </button>
      ))}
    </div>
  )
}

export default RatingStars