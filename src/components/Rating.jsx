import React, { useState } from 'react'

// I created this reusable rating component that works both as an interactive element and a display-only view
const Rating = ({ rating: initialRating = 0, onRate, readOnly = false, starSize = 'text-2xl' }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const currentRating = initialRating

  // I am tracking mouse hover to give visual feedback before the user actually clicks
  const handleMouseOver = (index) => {
    if (!readOnly) {
      setHoverRating(index)
    }
  }
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }
  const handleClick = (index) => {
    if (!readOnly && onRate) {
      onRate(index)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {/* I am mapping over 5 stars and stylling them based on rating state */}
      {[1, 2, 3, 4, 5].map((index) => {
        const displayRating = hoverRating > 0 ? hoverRating : currentRating
        const isFilled = index <= displayRating
        const starLabel = readOnly ? `${currentRating} star rating` : `Rate ${index} star${index !== 1 ? 's' : ''}`

        return (
          <button
            key={index}
            type="button"
            className={`inline-block p-0 bg-transparent border-none ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${starSize} ${isFilled ? 'text-yellow-400' : 'text-gray-300'
              } ${!readOnly ? 'hover:text-yellow-500 transform hover:scale-110 transition-all duration-150 focus:outline-none focus:text-yellow-500' : ''}`}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            title={starLabel}
            aria-label={starLabel}
            disabled={readOnly}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

export default Rating