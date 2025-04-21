import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../api/googleBooks';
import { BookContext } from '../context/BookContext';
import Rating from '../components/Rating';

// I used this as a backup image for missing cover images
const defaultImgURL = 'https://via.placeholder.com/200x300.png?text=No+Image';

const BookDetails = () => {
  const { id: bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const {
      addBookToLibrary,
      removeBookFromLibrary,
      rateBook,
      getBookRating,
      isBookInLibrary,
    } = useContext(BookContext)

  useEffect(() => {
    if (!bookId) {
       setError("Invalid Book ID provided in URL.")
       setLoading(false)
       return
    }

    let isMounted = true

    const fetchDetails = async () => {
      setLoading(true)
      setError('')
      setBook(null)
      try {
        const data = await getBookById(bookId)
        if (isMounted) { 
            if (data) {
              setBook(data);
            } else {
              setError(`Book with ID ${bookId} not found.`)
            }
        }
      } catch (err) {
        console.error("Error fetching book details:", err)
        if (isMounted) {
            setError('Failed to fetch book details. Network error or API issue.')
        }
      } finally {
         if (isMounted) {
            setLoading(false)
         }
      }
    }

    fetchDetails()

    return () => {
        isMounted = false
    }
  }, [bookId])
  const bookIsInLibrary = isBookInLibrary(bookId)
  const currentRating = getBookRating(bookId)

  const handleRatingChange = (newRating) => {
      if(book) {
        rateBook(book.id, newRating)
      }
  }

  const handleLibraryAction = () => {
    if (!book) {
      return
    }
    if (bookIsInLibrary) {
      removeBookFromLibrary(book.id)
    } else {
      addBookToLibrary(book)
    }
  }

    const LoadingSkeleton = () => (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg animate-pulse border dark:border-gray-700">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="md:w-1/3 lg:w-1/4">
                    <div className="w-full max-w-[200px] h-72 bg-gray-300 dark:bg-gray-600 rounded shadow-md mb-5 mx-auto"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-5 w-full"></div>
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-3 mx-auto"></div>
                        <div className="flex justify-center space-x-1 h-8">
                           <div className="w-8 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                           <div className="w-8 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                           <div className="w-8 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                           <div className="w-8 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                           <div className="w-8 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                 <div className="md:w-2/3 lg:w-3/4 space-y-4">
                     <div className="h-9 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                     <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                     </div>
                     <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mt-6 mb-2 pt-1 border-b dark:border-gray-700"></div>
                     <div className="space-y-2">
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                     </div>
                 </div>
            </div>
        </div>
    )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
       <div className="text-center text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow border border-red-200 dark:border-red-800">
           <p className="font-semibold text-lg mb-2">Error Loading Book</p>
           <p className="text-sm">{error}</p>
           <button onClick={() => navigate('/search')} className="mt-4 bg-primary text-white py-2 px-5 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Return to Search
            </button>
       </div>
    )
  }

  if (!book || !book.volumeInfo) {
     return <p className="text-adaptive-body text-center py-10">Book data seems to be missing or incomplete.</p>
  }

  const { title, subtitle, authors, publisher, publishedDate, description, imageLinks, pageCount, categories, averageRating, ratingsCount, industryIdentifiers } = book.volumeInfo
  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail || defaultImgURL
  const isbn13 = industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
  const isbn10 = industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier
  const displayAuthors = authors?.join(', ') || 'N/A'

  // Here I formated the dates for better readability
  const displayPublished = publishedDate ? new Date(publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'
  const displayPublisher = publisher || 'N/A'
  const displayPageCount = pageCount || 'N/A'
  const displayCategories = categories?.join(', ') || 'N/A'
  const cleanDescription = description ? description.replace(/<[^>]*>?/gm, '') : 'No description available.'

  return (
    <article className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
       <button
         onClick={() => navigate(-1)}
         className="mb-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded inline-flex items-center transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
         aria-label="Go back to previous page"
       >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
       </button>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Here I made the sidebar sticky on desktop for better reading experience of the user*/}
        <aside className="md:w-1/3 lg:w-1/4 flex-shrink-0 text-center md:sticky md:top-24">
          <img
            src={thumbnail}
            alt={`Cover art for ${title}`}
            className="w-full max-w-[200px] lg:max-w-[240px] mx-auto h-auto object-contain rounded shadow-lg mb-5 border border-gray-200 dark:border-gray-700"
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImgURL }}
          />
          <button
            onClick={handleLibraryAction}
            className={`w-full font-bold py-2.5 px-4 rounded transition duration-200 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                bookIsInLibrary
                ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
            }`}
            aria-live="polite" 
            >
            {bookIsInLibrary ? 'Remove from Library' : 'Add to Library'}
          </button>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
             <h3 className="text-md font-semibold mb-2 text-blue-800 dark:text-blue-300">Your Rating</h3>
             <div className="flex justify-center">
                <Rating rating={currentRating} onRate={handleRatingChange} starSize="text-3xl" />
             </div>
          </div>
        </aside>

        <section className="md:w-2/3 lg:w-3/4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold mb-1">{title}</h1>
          {subtitle && <h2 className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-3">{subtitle}</h2>}
          <p className="text-gray-800 dark:text-gray-200 text-md mb-6">by <span className="font-medium text-gray-900 dark:text-white">{displayAuthors}</span></p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-800 dark:text-gray-200 mb-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <p><strong className="text-gray-700 dark:text-gray-300">Publisher:</strong> {displayPublisher}</p>
            <p><strong className="text-gray-700 dark:text-gray-300">Published:</strong> {displayPublished}</p>
            <p><strong className="text-gray-700 dark:text-gray-300">Pages:</strong> {displayPageCount}</p>
            <p><strong className="text-gray-700 dark:text-gray-300">Categories:</strong> {displayCategories}</p>
            {isbn13 && <p className="sm:col-span-1"><strong className="text-gray-700 dark:text-gray-300">ISBN-13:</strong> {isbn13}</p>}
            {isbn10 && <p className="sm:col-span-1"><strong className="text-gray-700 dark:text-gray-300">ISBN-10:</strong> {isbn10}</p>}
            {averageRating && (
                 <p className="sm:col-span-2"><strong className="text-gray-700 dark:text-gray-300">Avg. Google Rating:</strong> {averageRating} ★ ({ratingsCount || 0} reviews)</p>
             )}
          </div>

          <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-2">Description</h2>
          <div className="text-emerald-600 max-w-none leading-relaxed whitespace-pre-wrap bg-transparent">
              {cleanDescription}
          </div>

        </section>
      </div>
    </article>
  )
}

export default BookDetails