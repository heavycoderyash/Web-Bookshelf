import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { searchBooks } from '../api/googleBooks'
import BookCard from '../components/BookCard'
import { ThemeContext } from '../context/ThemeContext'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

const bookCategorises = [
  'bestsellers 2025',
  'classics',
  'science fiction',
  'fantasy',
]

const CATEGORIES = [
  'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
  'Romance', 'Biography', 'History', 'Self-Help', 'Business',
  'Science', 'Technology', 'Art', 'Religion', 'Philosophy',
  'Travel', 'Cooking', 'Health', 'Children', 'Young Adult'
]

function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Fiction')
  const navigate = useNavigate()

  const { theme } = useContext(ThemeContext)
  const darkModeOn = theme === 'dark'

  useEffect(() => {
    let isMounted = true

    async function loadFeaturedBooks() {
      // Here I randomly picked a category for more variety of the books
      const randomIndex = Math.floor(Math.random() * bookCategorises.length)
      const selectedCategory = bookCategorises[randomIndex]

      try {
        setIsLoading(true)
        setFetchError(null)

        console.log(`Fetching books for category: ${selectedCategory}`)
        const result = await searchBooks(selectedCategory)

        if (!isMounted) {
          return
        }

        if (!result?.items?.length) {
          setFetchError('No books found. Try refreshing the page.')
          return
        }

        let booksWithCovers = result.items.filter(book => {
          return book?.volumeInfo?.imageLinks?.thumbnail
        })

        booksWithCovers = booksWithCovers.slice(0, 6)

        setFeaturedBooks(booksWithCovers)
      } catch (err) {
        console.error('Error getting featured books:', err)
        if (isMounted) {
          setFetchError('Failed to load books. Please try again later.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadFeaturedBooks()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    fetchBooksByCategory(selectedCategory)
  }, [selectedCategory])

  const fetchBooksByCategory = async (category) => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=20`)
      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      
      if (data && data.items) {
        setBooks(data.items)
      } else {
        setBooks([])
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      setBooks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  // Here I am using different card styles based on theme
  const cardStyle = darkModeOn
    ? 'text-center p-5 bg-gray-700 rounded-lg shadow-md'
    : 'text-center p-5 bg-white rounded-lg shadow-md'

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 gradient-text">Web Bookshelf</h1>
      
      <Form onSubmit={handleSearch} className="mb-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button type="submit" variant="primary">Search</Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <div className="mb-4">
        <h3 className="mb-3">Explore by Category</h3>
        <Form.Select 
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Form.Select>
      </div>

      <h2 className="mb-4">Popular in {selectedCategory}</h2>
      
      {isLoading ? (
        <Loader />
      ) : (
        <Row>
          {books.length > 0 ? (
            books.map(book => (
              <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <BookCard book={book} />
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">No books found in this category. Try another category.</p>
            </Col>
          )}
        </Row>
      )}

      <section className="animate-slide-in">
        <h2 className="text-adaptive-heading text-2xl font-bold mb-6 text-center border-b pb-2">
          Discover Featured Books
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800 animate-pulse h-80">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && fetchError && (
          <div className="text-center p-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p>{fetchError}</p>
          </div>
        )}

        {!isLoading && !fetchError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      <section className={`grid md:grid-cols-3 gap-6 animate-slide-in py-6 ${darkModeOn ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-8`}>
        <div className={cardStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-adaptive-heading text-xl font-semibold mb-2">Find Any Book</h3>
          <p className="text-adaptive-muted">Search millions of books by title, author, or ISBN</p>
        </div>

        <div className={cardStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-adaptive-heading text-xl font-semibold mb-2">Build Your Library</h3>
          <p className="text-adaptive-muted">Save your favorite books to your personal bookshelf</p>
        </div>

        <div className={cardStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="text-adaptive-heading text-xl font-semibold mb-2">Rate and Remember</h3>
          <p className="text-adaptive-muted">Give your personal rating to books you've read</p>
        </div>
      </section>
    </Container>
  )
}

export default Home