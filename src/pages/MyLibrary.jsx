import React, { useContext } from 'react'
import { BookContext } from '../context/BookContext'
import BookCard from '../components/BookCard'
import { Link } from 'react-router-dom'

const MyLibrary = () => {
  const { libraryBooks } = useContext(BookContext)

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-adaptive-heading text-3xl font-bold mb-8 text-center border-b dark:border-gray-700 pb-3">My Saved Books</h1>

      {libraryBooks.length === 0 ? (
        <div className="text-center text-adaptive-body py-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-xl mb-4 font-semibold text-adaptive-heading">Your Bookshelf is Empty</p>
          <p className="mb-6 text-adaptive-muted">Search for books and add them to your library!</p>
          <Link
            to="/search"
            className="inline-block bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Find Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {libraryBooks.map((book) => (
            book?.id ? <BookCard key={book.id} book={book} /> : null
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLibrary