import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { ThemeContext } from '../context/ThemeContext'

function Navbar() {
  const { theme } = useContext(ThemeContext)

  const navLinkActiveStyle = "text-white bg-primary px-3 py-2 rounded-md text-sm font-medium shadow-md"
  const navLinkStyle = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 dark:border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white text-2xl font-semibold hover:text-blue-300 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <span>Web-Bookshelf</span>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? navLinkActiveStyle : navLinkStyle}
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) => isActive ? navLinkActiveStyle : navLinkStyle}
            >
              Search
            </NavLink>

            <NavLink
              to="/library"
              className={({ isActive }) => isActive ? navLinkActiveStyle : navLinkStyle}
            >
              My Library
            </NavLink>

            <div className="ml-2 border-l border-gray-700 pl-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar