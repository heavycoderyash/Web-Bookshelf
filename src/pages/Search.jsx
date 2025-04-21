import React, {useState,useEffect,useCallback,useRef} from 'react'
import { searchBooks } from '../api/googleBooks'
import BookCard from '../components/BookCard'
import { useSearchParams } from 'react-router-dom'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(!!initialQuery)
  const searchInputRef = useRef(null)

  // I am focusing the search input when page loads without a query
  useEffect(() => {
    if (!initialQuery) {
      searchInputRef.current?.focus()
    }
  }, [initialQuery])


  const performSearch = useCallback(async (searchTerm) => {
    const trimmedQuery = searchTerm.trim()
    setQuery(searchTerm)
    setHasSearched(true)

    // I am returning early if the query is empty to avoid unnecessary API calls
    if (!trimmedQuery) {
      setBooks([])
      setError('')
      setSearchParams({})
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    // I am updating the URL to include the search query
    setSearchParams({ q: trimmedQuery }, { replace: true })

    try {
      const data = await searchBooks(trimmedQuery)
      setBooks(data?.items || [])
    } catch (err) {
      console.error("Search failed:", err)
      setError('Failed to fetch books. Check connection or try again.')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [setSearchParams])

   // I am running the search when the component mounts with a query in the URL
   useEffect(() => {
     if (initialQuery !== query || (initialQuery && books.length === 0 && !loading && !error)) {
        performSearch(initialQuery)
     }
   }, [initialQuery])


  const handleInputChange = (event) => {
    setQuery(event.target.value)
    if (error) {
      setError('')
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    performSearch(query)
  }

  // I created this spinner component for better loading state UX
  const Spinner = () => (
    <div className="text-center py-10" aria-live="polite">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary mb-2"></div>
        <p className="text-primary">Searching for books...</p>
    </div>
  )


  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-adaptive-heading text-3xl font-bold mb-6 text-center">Search for Books</h1>

      {/* I am using a form element here for better accesibility and keyboard support */}
      <form onSubmit={handleSearchSubmit} className="mb-8 max-w-xl mx-auto" role="search">
        <div className="flex items-center border-2 border-primary rounded-full overflow-hidden shadow-sm bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
          <input
            ref={searchInputRef} 
            type="search"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter title, author, ISBN..."
            className="w-full px-5 py-3 text-gray-700 dark:text-white focus:outline-none bg-transparent"
            aria-label="Search Books Input"
            disabled={loading} 
          />
          <button
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-3 transition duration-200 disabled:opacity-60 shrink-0"
            disabled={loading}
            aria-label="Submit Search"
          >
            {loading ? '...' : 'Go'} 
          </button>
        </div>
      </form>

      <div aria-live="polite">
         {loading && <Spinner />}
         {error && !loading && (
            <p className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300 p-4 rounded-md max-w-xl mx-auto shadow border border-red-200 dark:border-red-800">{error}</p>
         )}
      </div>

      {!loading && !error && (
        <>
          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {books.map((book) => (
                book.id ? <BookCard key={book.id} book={book} /> : null
              ))}
            </div>
          ) : (
             hasSearched && <p className="text-adaptive-body text-center py-10 text-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow">No books found matching that query.</p>
          )}
        </>
      )}

       {/* I'm showing a different message when the user hasn't searched yet */}
       {!hasSearched && !loading && !initialQuery && (
           <p className="text-center text-blue-700 dark:text-blue-400 py-10 text-md italic">Start typing above to discover books!</p>
       )}

    </div>
  )
}

export default Search