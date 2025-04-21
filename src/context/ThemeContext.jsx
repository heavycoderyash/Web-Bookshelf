import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext(null)
const storageKey = 'web_bookshelf_theme'
export const ThemeProvider = ({ children }) => {
  // I am initializing the theme state based on user preference
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey)
      if (savedTheme) {
        return savedTheme
      }
      // I am checking if the user prefers dark mode or light mode
      const prefersDarkMode = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches

      return prefersDarkMode ? 'dark' : 'light'
    } catch (err) {
      console.error("Theme load error:", err)
      return 'light'
    }
  })
  // I am applying the theme whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, currentTheme)
      const htmlElement = document.documentElement

      if (currentTheme === 'dark') {
        htmlElement.classList.add('dark')
        document.body.style.backgroundColor = '#111827'
        document.body.style.color = '#f9fafb'
      } else {
        htmlElement.classList.remove('dark')
        document.body.style.backgroundColor = '#f9fafb'
        document.body.style.color = '#111827'
      }
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }, [currentTheme])

  // I created this function to toggle between light and dark themes
  function switchTheme() {
    setCurrentTheme(theme => {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem(storageKey, newTheme)
        const htmlElement = document.documentElement

        if (newTheme === 'dark') {
          htmlElement.classList.add('dark')
          document.body.style.backgroundColor = '#111827'
          document.body.style.color = '#f9fafb'
        } else {
          htmlElement.classList.remove('dark')
          document.body.style.backgroundColor = '#f9fafb'
          document.body.style.color = '#111827'
        }
      } catch (e) {
        console.error("Failed to apply theme:", e)
      }
      return newTheme
    })
  }

  const themeData = {
    theme: currentTheme,
    toggleTheme: switchTheme,
  }

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  )
} 