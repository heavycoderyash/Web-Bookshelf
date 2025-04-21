import React from 'react'
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'

// I built this rating component for displaying and capturing book ratings
const Rating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }
  
  const starClass = `${sizeClasses[size] || sizeClasses.md} ${readonly ? '' : 'cursor-pointer'}`
  
  // Here I am creating an array of 5 stars
  const stars = [...Array(5)].map((_, index) => {
    const starValue = index + 1
    
    // Here I'm handling stars display (full,half,or empty)
    const renderStar = () => {
      if (value >= starValue) {
        return <FaStar className={`text-yellow-400 ${starClass}`} />
      } else if (value >= starValue - 0.5) {
        return <FaStarHalfAlt className={`text-yellow-400 ${starClass}`} />
      } else {
        return <FaRegStar className={`text-gray-400 ${starClass}`} />
      }
    }
    
    return (
      <span 
        key={index}
        onClick={() => !readonly && onChange && onChange(starValue)}
        onKeyDown={(e) => {
          if (!readonly && onChange && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onChange(starValue)
          }
        }}
        role={readonly ? 'presentation' : 'button'}
        tabIndex={readonly ? -1 : 0}
        aria-label={readonly ? `Rating ${value} out of 5` : `Rate ${starValue} out of 5`}
        className="inline-block"
      >
        {renderStar()}
      </span>
    )
  })
  
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5 stars`}>
      {stars}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {value ? `${value.toFixed(1)}` : 'Rate this book'}
        </span>
      )}
    </div>
  )
}

export default Rating