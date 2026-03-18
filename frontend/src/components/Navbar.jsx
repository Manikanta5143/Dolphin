import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaBookmark,
  FaUsers,
  FaBell
} from 'react-icons/fa'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/')
  }

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white">
  <span className="text-2xl">🐬</span>
</div>

              <span className="text-3xl font-bold font-[Montserrat] text-gray-900">Dolphin</span>

            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/events" 
              className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-large font-bold transition-colors hover:bg-gray-200"
            >
              Events
            </Link>
            <Link
        to="/hackathons"
        className="block px-3 py-2 rounded-md text-large font-bold text-gray-900 font-bold hover:text-primary-600 hover:bg-gray-200 transition-colors"
      >
        Hackathons
      </Link>
      <Link
        to="/internships"
        className="block px-3 py-2 rounded-md text-base font-bold text-gray-900 font-bold hover:text-primary-600 hover:bg-gray-200 transition-colors"
      >
        Internships
      </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-large font-bold transition-colors hover:bg-gray-200"
              >
                Dashboard
              </Link>
            )}
          



            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-gray-900 text-md font-bold hover:text-primary-600 px-3 py-2 rounded-md  font-bold transition-colors hover:bg-gray-300"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-md font-bold transition-colors"
                  >
                    <FaUser className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/notifications"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaBell className="w-4 h-4 mr-2" />
                      Notifications
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaBookmark className="w-4 h-4 mr-2" />
                      My Bookmarks
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUsers className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to="/events"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Events
            </Link>
            <Link
              to="/hackathons"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Hackathons
            </Link>
            <Link
              to="/internships"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Internships
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="bg-primary-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 