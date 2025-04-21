import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import BookDetails from './pages/BookDetails'
import MyLibrary from './pages/MyLibrary'
import { ThemeContext } from './context/ThemeContext'

function App() {
  const { theme } = useContext(ThemeContext)

  const appName = "Web-Bookshelf"
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col min-h-screen" style={{
      backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
      color: theme === 'dark' ? '#f9fafb' : '#111827',
      transition: 'background-color 0.2s, color 0.2s'
    }}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/library" element={<MyLibrary />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900 dark:border-t dark:border-gray-700 text-white text-center p-3 mt-auto text-sm transition-colors duration-200">
        WEB-DEVELOPMENT PROJECT(Term-3)
      </footer>
    </div>
  )
}

export default App