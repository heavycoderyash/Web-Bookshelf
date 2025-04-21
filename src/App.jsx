import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BookDetails from './pages/BookDetails'
import AddBook from './pages/AddBook'
import EditBook from './pages/EditBook'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import NotFound from './pages/NotFound'
import AboutPage from './pages/About'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// I created this main application component to set up routing and global providers
function App() {
  const [darkMode, setDarkMode] = useState(false)

  // I am loading dark mode preference from localStorage when the app mounts
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Here I updated document classes and saved the user preference when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode)
  }

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/add" element={
                <PrivateRoute>
                  <AddBook />
                </PrivateRoute>
              } />
              <Route path="/edit/:id" element={
                <PrivateRoute>
                  <EditBook />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App