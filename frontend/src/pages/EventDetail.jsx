import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { eventService } from '../services/eventService'
import { format } from 'date-fns'
import { 
  FaBookmark, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaTag, 
  FaExternalLinkAlt,
  FaArrowLeft,
  FaUsers,
  FaClock
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const EventDetail = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [event, setEvent] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchEvent()
    }
  }, [id])

  useEffect(() => {
    if (isAuthenticated && event) {
      checkBookmarkStatus()
    }
  }, [isAuthenticated, event])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching event with ID:', id)
      
      const response = await eventService.getEvent(id)
      console.log('Event response:', response)
      
      if (response.success && response.data) {
        setEvent(response.data)
      } else {
        setError('Event not found')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event details')
      toast.error('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const checkBookmarkStatus = async () => {
    try {
      const response = await eventService.checkBookmark(id)
      setIsBookmarked(response.data.isBookmarked)
    } catch (error) {
      console.error('Error checking bookmark status:', error)
      // Check if user has bookmarked this event based on event data
      if (event && user) {
        setIsBookmarked(event.bookmarkedBy?.includes(user._id) || false)
      }
    }
  }

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark events')
      return
    }

    try {
      if (isBookmarked) {
        await eventService.removeBookmark(id)
        setIsBookmarked(false)
        toast.success('Bookmark removed')
      } else {
        await eventService.addBookmark(id)
        setIsBookmarked(true)
        toast.success('Event bookmarked')
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    }
  }

  const getEventTypeColor = (type) => {
    const colors = {
      HACKATHON: 'bg-red-100 text-red-800',
      CODING_FEST: 'bg-green-100 text-green-800',
      INTERNSHIP: 'bg-blue-100 text-blue-800',
      WORKSHOP: 'bg-purple-100 text-purple-800',
      CONFERENCE: 'bg-yellow-100 text-yellow-800',
      COMPETITION: 'bg-indigo-100 text-indigo-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getEventTypeIcon = (type) => {
    const icons = {
      HACKATHON: '💻',
      CODING_FEST: '🏆',
      INTERNSHIP: '💼',
      WORKSHOP: '🔧',
      CONFERENCE: '🎤',
      COMPETITION: '🏅'
    }
    return icons[type] || '📅'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Event not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error === 'Event not found' 
              ? 'The event you\'re looking for doesn\'t exist or may have been removed.'
              : 'There was an error loading the event details.'
            }
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/events" className="btn btn-primary">
              Back to Events
            </Link>
            <Link to="/" className="btn btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{getEventTypeIcon(event.type)}</span>
              <div>
                <span className={`badge ${getEventTypeColor(event.type)}`}>
                  {event.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-400 hover:text-primary-600 hover:bg-gray-50'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <FaBookmark className="w-6 h-6" />
              </button>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FaCalendar className="w-5 h-5 mr-3" />
              <span>{format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="w-5 h-5 mr-3" />
                <span>{event.location}</span>
              </div>
            )}

            {event.deadline && (
              <div className="flex items-center text-gray-600">
                <FaClock className="w-5 h-5 mr-3" />
                <span>Deadline: {format(new Date(event.deadline), 'MMM dd, yyyy')}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <FaUsers className="w-5 h-5 mr-3" />
              <span>{event.bookmarkedBy?.length || 0} bookmarks</span>
            </div>
          </div>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center btn btn-primary"
            >
              <FaExternalLinkAlt className="w-4 h-4 mr-2" />
              Register Now
            </a>
          )}
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>
          
          {event.eligibility && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Eligibility</h3>
              <p className="text-gray-700">{event.eligibility}</p>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Event Actions */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Involved</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1 justify-center"
              >
                <a className="w-4 h-4 mr-5rem" />
                Register for Event
              </a>
            )}
            
            {isAuthenticated && (
              <button
                onClick={toggleBookmark}
                className={`btn flex-1 justify-center ${
                  isBookmarked 
                    ? 'btn-secondary' 
                    : 'btn-outline'
                }`}
              >
                <FaBookmark className="w-4 h-4 mr-2" />
                {isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail 