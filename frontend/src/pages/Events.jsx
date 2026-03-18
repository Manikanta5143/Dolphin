import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { eventService } from '../services/eventService'
import { format } from 'date-fns'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BookmarkIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  FireIcon,
  EyeIcon,
  UserGroupIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import LoadingSkeleton, { EventCardSkeleton } from '../components/LoadingSkeleton'

const Events = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    tags: searchParams.get('tags') || ''
  })
  const [appliedFilters, setAppliedFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    tags: searchParams.get('tags') || ''
  })

  useEffect(() => {
    console.log('Events page mounted, fetching events...')
    fetchEvents()
  }, [appliedFilters, pagination.page])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = {
        search: appliedFilters.search,
        type: appliedFilters.type,
        dateFrom: appliedFilters.dateFrom,
        dateTo: appliedFilters.dateTo,
        tags: appliedFilters.tags,
        page: pagination.page,
        limit: pagination.limit
      }
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })
      
      console.log('Fetching events with params:', params)
      const response = await eventService.getEvents(params)
      console.log('Events response:', response)
      
      if (response && response.success) {
        setEvents(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
        console.log('Events loaded successfully:', response.data?.length || 0, 'events')
      } else {
        console.error('API returned error:', response?.error)
        toast.error(response?.error || 'Failed to load events')
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load events'
      toast.error(errorMessage)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleSearch = () => {
    setAppliedFilters(filters)
    
    // Update URL params
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      type: '',
      dateFrom: '',
      dateTo: '',
      tags: ''
    }
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setSearchParams({})
  }

  const toggleBookmark = async (eventId) => {
    if (!user) {
      toast.error('Please login to bookmark events')
      return
    }

    try {
      const event = events.find(e => e._id === eventId || e.id === eventId)
      if (!event) {
        toast.error('Event not found')
        return
      }

      const isCurrentlyBookmarked = event.isBookmarked || event.bookmarkedBy?.includes(user._id)
      
      if (isCurrentlyBookmarked) {
        await eventService.removeBookmark(eventId)
        setEvents(prev => prev.map(e => 
          (e._id === eventId || e.id === eventId) ? { ...e, isBookmarked: false } : e
        ))
        toast.success('Bookmark removed')
      } else {
        await eventService.addBookmark(eventId)
        setEvents(prev => prev.map(e => 
          (e._id === eventId || e.id === eventId) ? { ...e, isBookmarked: true } : e
        ))
        toast.success('Event bookmarked')
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    }
  }

  const getEventTypeColor = (type) => {
    const colors = {
      HACKATHON: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      CODING_FEST: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      INTERNSHIP: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      WORKSHOP: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      CONFERENCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      COMPETITION: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      MEETUP: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      WEBINAR: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      BOOTCAMP: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      SCHOLARSHIP: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      JOB_FAIR: 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300',
      NETWORKING: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
      TECH_TALK: 'bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300',
      STARTUP_PITCH: 'bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-300',
      RESEARCH_OPPORTUNITY: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
      VOLUNTEER: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      MENTORSHIP: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-300',
      CAREER_FAIR: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300',
      ALUMNI_EVENT: 'bg-stone-100 text-stone-800 dark:bg-stone-900/20 dark:text-stone-300',
      STUDY_GROUP: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-300'
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  const getEventTypeIcon = (type) => {
    const icons = {
      HACKATHON: '💻',
      CODING_FEST: '🏆',
      INTERNSHIP: '💼',
      WORKSHOP: '🔧',
      CONFERENCE: '🎤',
      COMPETITION: '🏅',
      MEETUP: '👥',
      WEBINAR: '📹',
      BOOTCAMP: '🚀',
      SCHOLARSHIP: '🎓',
      JOB_FAIR: '💼',
      NETWORKING: '🤝',
      TECH_TALK: '🎯',
      STARTUP_PITCH: '💡',
      RESEARCH_OPPORTUNITY: '🔬',
      VOLUNTEER: '❤️',
      MENTORSHIP: '🎯',
      CAREER_FAIR: '🏢',
      ALUMNI_EVENT: '🎓',
      STUDY_GROUP: '📚'
    }
    return icons[type] || '📅'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4" />
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6" />
              </div>
            </div>
            
            {/* Filters Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
              </div>
            </div>
            
            {/* Events Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover amazing opportunities for college students
          </p>
        </motion.div>

        {/* Quick Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { type: '', label: 'All Events', icon: '🌟' },
              { type: 'HACKATHON', label: 'Hackathons', icon: '💻' },
              { type: 'INTERNSHIP', label: 'Internships', icon: '💼' },
              { type: 'WORKSHOP', label: 'Workshops', icon: '🔧' },
              { type: 'CONFERENCE', label: 'Conferences', icon: '🎤' },
              { type: 'COMPETITION', label: 'Competitions', icon: '🏅' },
              { type: 'MEETUP', label: 'Meetups', icon: '👥' },
              { type: 'WEBINAR', label: 'Webinars', icon: '📹' }
            ].map((filter) => (
              <button
                key={filter.type}
                onClick={() => {
                  const newFilters = { ...filters, type: filter.type }
                  setFilters(newFilters)
                  setAppliedFilters(newFilters)
                  const params = new URLSearchParams()
                  Object.entries(newFilters).forEach(([k, v]) => {
                    if (v) params.set(k, v)
                  })
                  setSearchParams(params)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  appliedFilters.type === filter.type
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Types</option>
                <option value="HACKATHON">💻 Hackathon</option>
                <option value="CODING_FEST">🏆 Coding Fest</option>
                <option value="INTERNSHIP">💼 Internship</option>
                <option value="WORKSHOP">🔧 Workshop</option>
                <option value="CONFERENCE">🎤 Conference</option>
                <option value="COMPETITION">🏅 Competition</option>
                <option value="MEETUP">👥 Meetup</option>
                <option value="WEBINAR">📹 Webinar</option>
                <option value="BOOTCAMP">🚀 Bootcamp</option>
                <option value="SCHOLARSHIP">🎓 Scholarship</option>
                <option value="JOB_FAIR">💼 Job Fair</option>
                <option value="NETWORKING">🤝 Networking</option>
                <option value="TECH_TALK">🎯 Tech Talk</option>
                <option value="STARTUP_PITCH">💡 Startup Pitch</option>
                <option value="RESEARCH_OPPORTUNITY">🔬 Research Opportunity</option>
                <option value="VOLUNTEER">❤️ Volunteer</option>
                <option value="MENTORSHIP">🎯 Mentorship</option>
                <option value="CAREER_FAIR">🏢 Career Fair</option>
                <option value="ALUMNI_EVENT">🎓 Alumni Event</option>
                <option value="STUDY_GROUP">📚 Study Group</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              Search Events
            </button>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id || event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  {user && (
                    <button 
                      onClick={() => toggleBookmark(event._id || event.id)}
                      className={`text-gray-400 hover:text-blue-600 transition-colors ${
                        event.isBookmarked || event.bookmarkedBy?.includes(user._id) ? 'text-blue-600' : ''
                      }`}
                    >
                      <BookmarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  )}

                  {event.deadline && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <TagIcon className="w-4 h-4 mr-2" />
                      Deadline: {format(new Date(event.deadline), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>

                {/* Engagement Stats */}
                {event.engagement && (
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <EyeIcon className="w-3 h-3 mr-1" />
                        {event.engagement.viewCount || 0}
                      </div>
                      <div className="flex items-center">
                        <BookmarkIcon className="w-3 h-3 mr-1" />
                        {event.engagement.bookmarkCount || 0}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-3 h-3 mr-1" />
                        {event.engagement.rsvpCount || 0}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ShareIcon className="w-3 h-3 mr-1" />
                      {event.engagement.shareCount || 0}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Link
                    to={`/events/${event._id || event.id}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    View Details →
                  </Link>
                  
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Register
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {events.length > 0 && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center items-center space-x-2 mt-8"
          >
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}

        {events.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or check back later for new opportunities.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Events 