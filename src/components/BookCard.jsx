import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { BookContext } from '../context/BookContext'
import Rating from './Rating'

// I created this component to display book information in a card format across the app
const BookCard = ({ book }) => {
  const { libraryBooks, addBookToLibrary, removeBookFromLibrary, getBookRating } = useContext(BookContext)

  if (!book || !book.volumeInfo || !book.id) {
    console.warn("Invalid book data passed to BookCard:", book)
    return <div className="border p-2 text-red-600 bg-red-100 rounded-lg text-xs">Invalid book data</div>
  }

  const { title, authors, imageLinks } = book.volumeInfo
  const bookId = book.id

  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail
  const displayAuthors = authors ? authors.join(', ') : 'Author Unknown'

  // I am checking if this book is already in the library to show the correct button
  const isInLibrary = libraryBooks.some(libBook => libBook.id === bookId)
  const rating = getBookRating(bookId)

  // I am stopping event propagation so the link doesn't activate when clicking the button
  const handleLibraryAction = (e, action) => {
    e.preventDefault()
    e.stopPropagation()
    if (action === 'add') {
      addBookToLibrary(book)
    } else if (action === 'remove') {
      removeBookFromLibrary(bookId)
    }
  }

  return (
    <Link to={`/book/${bookId}`} className="group border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
      <div className="relative h-52 w-full overflow-hidden flex justify-center items-center bg-gray-100 dark:bg-gray-700">
        <img
          src={thumbnail}
          alt={`Cover of ${title}`}
          className="object-contain h-full w-auto transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMG_URL }}
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-gray-900 dark:text-white font-bold text-md mb-1 line-clamp-2 group-hover:text-primary" title={title}>{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-xs mb-2 truncate" title={displayAuthors}>{displayAuthors}</p>

        {/* I am only showing ratings if the book has been rated */}
        {rating > 0 && (
          <div className="my-1">
            <Rating rating={rating} readOnly={true} starSize='text-lg' />
          </div>
        )}

        <div className="mt-auto pt-2">
          {isInLibrary ? (
            <button
              onClick={(e) => handleLibraryAction(e, 'remove')}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded text-xs transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              aria-label={`Remove ${title} from library`}
            >
              Remove Book
            </button>
          ) : (
            <button
              onClick={(e) => handleLibraryAction(e, 'add')}
              className="w-full bg-secondary hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-xs transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
              aria-label={`Add ${title} to library`}
            >
              Add to Library
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

export default BookCard