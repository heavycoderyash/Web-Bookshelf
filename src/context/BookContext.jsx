import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"

export const BookContext = createContext(null)

// I'm versioning the storage keys to allow for future schema changes
const libraryStorageKey = "web_bookshelf_library_v1"
const ratingsStorageKey = "web_bookshelf_ratings_v1"

// I created this helper to safely load data from localStorage with error handling
const loadFromStorage = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  } catch (error) {
    console.error(`Failed to parse ${key} from localStorage:`, error)
    localStorage.removeItem(key)
    return defaultValue
  }
};

export const BookProvider = ({ children }) => {
  // I'm using a function for initial state to avoid unnecessary localStorage calls on every render
  const [libraryBooks, setLibraryBooks] = useState(() =>
    loadFromStorage(libraryStorageKey, [])
  )
  const [bookRatings, setBookRatings] = useState(() =>
    loadFromStorage(ratingsStorageKey, {})
  )

  // I am storing library changes to localStorage whenever the state updates
  useEffect(() => {
    try {
      localStorage.setItem(libraryStorageKey, JSON.stringify(libraryBooks))
    } catch (error) {
      console.error("Failed to save library to localStorage:", error)
    }
  }, [libraryBooks])

  useEffect(() => {
    try {
      localStorage.setItem(ratingsStorageKey, JSON.stringify(bookRatings))
    } catch (error) {
      console.error("Failed to save ratings to localStorage:", error)
    }
  }, [bookRatings])

  // I am using useCallback for all these functions to prevent unnecesary rerenders
  const addBookToLibrary = useCallback((book) => {
    setLibraryBooks((currentLibrary) => {
      if (!currentLibrary.some((libBook) => libBook.id === book.id)) {
        return [...currentLibrary, book]
      }
      console.log(`Book "${book?.volumeInfo?.title}" already in library.`)
      return currentLibrary
    })
  }, [])

  const removeBookFromLibrary = useCallback((bookId) => {
    setLibraryBooks((currentLibrary) =>
      currentLibrary.filter((book) => book.id !== bookId)
    )
  }, [])

  const rateBook = useCallback((bookId, rating) => {
    setBookRatings((currentRatings) => ({
      ...currentRatings,
      [bookId]: rating,
    }))
  }, [])

  const isBookInLibrary = useCallback(
    (bookId) => {
      return libraryBooks.some((book) => book.id === bookId);
    },
    [libraryBooks]
  );

  const getBookRating = useCallback(
    (bookId) => {
      return bookRatings[bookId] || 0
    },
    [bookRatings]
  );

  // I am using useMemo to optimize context rerenders
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
