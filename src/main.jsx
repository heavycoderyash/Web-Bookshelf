import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 
import { BrowserRouter } from 'react-router-dom'
import { BookProvider } from './context/BookContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ThemeProvider>
        <BookProvider>
          <App />
        </BookProvider>
      </ThemeProvider>
    </BrowserRouter>
)