import React from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import { formatDate } from '../utils/formatters'
import { FaEdit, FaTrash } from 'react-icons/fa'

// I created this book card component for displaying book information in a grid layout
const BookCard = ({ book, onDelete }) => {
  const truncateDescription = (text, maxLength = 150) => {
    if (!text) {
      return ''
    }
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 dark:shadow-gray-700/30 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">
            {book.title}
          </h3>
          <div className="flex space-x-2">
            {onDelete && (
              <button
                onClick={() => onDelete(book.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-1"
                aria-label="Delete book"
              >
                <FaTrash />
              </button>
            )}
            <Link to={`/edit/${book.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 p-1">
              <FaEdit />
            </Link>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          by <span className="font-medium">{book.author}</span>
        </p>
        
        {book.rating && (
          <div className="mb-2">
            <Rating value={book.rating} readonly />
          </div>
        )}
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
          {truncateDescription(book.description)}
        </p>
        
        {book.dateAdded && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Added: {formatDate(book.dateAdded)}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {book.categories?.map((category, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/book/${book.id}`} 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default BookCard