import axios from "axios"

const apiBaseURL = "https://www.googleapis.com/books/v1/volumes"
const apiKey = "AIzaSyBaw29k24bi6qoPlb66K4Cnfp6FPya67DE"

export const searchBooks = async (query) => {
  if (!query || !query.trim()) {
    console.log("Search query is empty, returning empty results.")
    return { items: [] }
  }
  try {
    const response = await axios.get(
      `${apiBaseURL}?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=24`
    )
    return { items: response.data?.items || [] }
  } catch (error) {
    console.error(
      "Error fetching books:",
      error.response ? error.response.data : error.message
    )
    return { items: [] }
  }
}

export const getBookById = async (bookId) => {
  if (!bookId) {
    console.warn("getBookById called without bookId")
    return null
  }
  try {
    const response = await axios.get(`${apiBaseURL}/${bookId}?key=${apiKey}`)
    return response.data
  } catch (error) {
    console.error(
      `Error fetching book details for ID ${bookId}:`,
      error.response ? error.response.data : error.message
    )
    return null;
  }
}
