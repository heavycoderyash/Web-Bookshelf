import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"
import { toast } from 'react-toastify'

export const BookContext = createContext(null)

const libraryStorageKey = "web_bookshelf_library_v1"
const ratingsStorageKey = "web_bookshelf_ratings_v1"

const loadFromStorage = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  } catch (error) {
    console.error(`Failed to parse ${key} from localStorage:`, error)
    localStorage.removeItem(key)
    return defaultValue
  }
}

export const BookProvider = ({ children }) => {
  // Here I am using localStorage to store library data
  const [libraryBooks, setLibraryBooks] = useState(() =>
    loadFromStorage(libraryStorageKey, [])
  )

  // Here I am storing user ratings
  const [bookRatings, setBookRatings] = useState(() =>
    loadFromStorage(ratingsStorageKey, {})
  )

  useEffect(() => {
    try {
      localStorage.setItem(libraryStorageKey, JSON.stringify(libraryBooks))
    } catch (error) {
      console.error("Failed to save library to localStorage:", error)
    }
  }, [libraryBooks])

  // Here I am saving the ratings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ratingsStorageKey, JSON.stringify(bookRatings))
    } catch (error) {
      console.error("Failed to save ratings to localStorage:", error)
    }
  }, [bookRatings])

  // Here I am adding book and checking for the duplicates
  const addBookToLibrary = useCallback((book) => {
    if (libraryBooks.some((libBook) => libBook.id === book.id)) {
      toast.info('This book is already in your library')
      return
    }
    
    setLibraryBooks((currentLibrary) => {
      return [...currentLibrary, book]
    })
    toast.success('Book added to your library')
  }, [libraryBooks])

  const removeBookFromLibrary = useCallback((bookId) => {
    setLibraryBooks((currentLibrary) =>
      currentLibrary.filter((book) => book.id !== bookId)
    )
    toast.success('Book removed from your library')
  }, [])

  const isBookInLibrary = useCallback(
    (bookId) => {
      return libraryBooks.some((book) => book.id === bookId);
    },
    [libraryBooks]
  )

  // Here I am validating whether rating is between 1 to 5 and logging it to console to catch any errors
  const rateBook = useCallback((bookId, rating) => {
    if (rating < 1 || rating > 5) {
      console.error('Rating must be between 1 and 5')
      return
    }
    
    setBookRatings((currentRatings) => ({
      ...currentRatings,
      [bookId]: rating,
    }))
    
    toast.success('Rating saved')
  }, [])

  const getBookRating = useCallback(
    (bookId) => {
      return bookRatings[bookId] || 0
    },
    [bookRatings]
  )

  const contextValue = useMemo(
    () => ({
      libraryBooks,
      bookRatings,
      addBookToLibrary,
      removeBookFromLibrary,
      rateBook,
      isBookInLibrary,
      getBookRating,
    }),
    [
      libraryBooks,
      bookRatings,
      addBookToLibrary,
      removeBookFromLibrary,
      rateBook,
      isBookInLibrary,
      getBookRating,
    ]
  )

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  )
}

export default BookProvider
