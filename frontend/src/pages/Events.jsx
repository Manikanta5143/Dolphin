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


const SAMPLE_EVENTS = [
  {
    "_id": "sample-1",
    "title": "Global Tech Summit 2026",
    "organizer": "Tech Innovators Inc.",
    "date": "2026-04-29T14:04:39.938Z",
    "location": "San Francisco, CA",
    "mode": "hybrid",
    "type": "CONFERENCE",
    "tags": [
      "Tech",
      "AI",
      "Networking"
    ],
    "description": "Join industry leaders for a three-day conference on the future of artificial intelligence and machine learning. Features keynote speakers from top tech companies.",
    "link": "https://example.com/register"
  },
  {
    "_id": "sample-2",
    "title": "Web3 Development Workshop",
    "organizer": "Blockchain Foundation",
    "date": "2026-05-06T14:04:39.938Z",
    "location": "Online",
    "mode": "online",
    "type": "WORKSHOP",
    "tags": [
      "Web3",
      "Blockchain",
      "Solidity"
    ],
    "description": "Hands-on workshop covering smart contract development using Solidity and Hardhat. Perfect for intermediate developers.",
    "link": "https://example.com/register"
  },
  {
    "_id": "sample-3",
    "title": "Student Startup Pitch",
    "organizer": "University Ventures",
    "date": "2026-05-14T14:04:39.938Z",
    "location": "New York, NY",
    "mode": "offline",
    "type": "STARTUP_PITCH",
    "tags": [
      "Startup",
      "Pitch",
      "Venture Capital"
    ],
    "description": "Pitch your startup idea to top VC firms and angel investors. Great networking opportunity and potential seed funding!",
    "link": "https://example.com/register"
  },
  {
    "_id": "hackathon-1",
    "title": "Google Developer Student Clubs Solution Challenge 2024",
    "organizer": "Google",
    "date": "2024-04-15T00:00:00.000Z",
    "location": "Global",
    "mode": "online",
    "type": "HACKATHON",
    "tags": [
      "Google",
      "Student",
      "Innovation",
      "Technology"
    ],
    "description": "Build solutions for local community problems using Google technologies. Win prizes up to $50,000 and mentorship opportunities.",
    "link": "https://developers.google.com/community/gdsc/events/solution-challenge"
  },
  {
    "_id": "hackathon-2",
    "title": "Microsoft Imagine Cup 2024",
    "organizer": "Microsoft",
    "date": "2024-05-20T00:00:00.000Z",
    "location": "Seattle, WA",
    "mode": "hybrid",
    "type": "HACKATHON",
    "tags": [
      "Microsoft",
      "AI",
      "Cloud",
      "Innovation"
    ],
    "description": "The world's premier student technology competition. Build innovative solutions using Microsoft technologies.",
    "link": "https://imaginecup.microsoft.com/"
  },
  {
    "_id": "hackathon-3",
    "title": "Meta Hacker Cup 2024",
    "organizer": "Meta",
    "date": "2024-08-15T00:00:00.000Z",
    "location": "Menlo Park, CA",
    "mode": "offline",
    "type": "HACKATHON",
    "tags": [
      "Meta",
      "Algorithm",
      "Competitive Programming"
    ],
    "description": "Annual programming competition hosted by Meta. Solve algorithmic challenges and compete for prizes.",
    "link": "https://www.facebook.com/hackercup/"
  },
  {
    "_id": "hackathon-4",
    "title": "AWS Build On 2024",
    "organizer": "Amazon Web Services",
    "date": "2024-06-10T00:00:00.000Z",
    "location": "Online",
    "mode": "online",
    "type": "HACKATHON",
    "tags": [
      "AWS",
      "Cloud",
      "Serverless",
      "Innovation"
    ],
    "description": "Build innovative solutions using AWS services. Focus on cloud-native applications and serverless architecture.",
    "link": "https://aws.amazon.com/events/build-on/"
  },
  {
    "_id": "hackathon-5",
    "title": "Devpost Hackathon",
    "organizer": "Devpost",
    "date": "2024-07-20T00:00:00.000Z",
    "location": "Online",
    "mode": "online",
    "type": "HACKATHON",
    "tags": [
      "Devpost",
      "Open Source",
      "Innovation"
    ],
    "description": "Join thousands of developers worldwide in this open hackathon. Build anything you can imagine.",
    "link": "https://devpost.com/hackathons"
  },
  {
    "_id": "hackathon-6",
    "title": "HackerEarth Machine Learning Challenge",
    "organizer": "HackerEarth",
    "date": "2024-05-30T00:00:00.000Z",
    "location": "Online",
    "mode": "online",
    "type": "HACKATHON",
    "tags": [
      "Machine Learning",
      "AI",
      "Data Science"
    ],
    "description": "Solve real-world machine learning problems. Compete with data scientists worldwide.",
    "link": "https://www.hackerearth.com/challenges/"
  },
  {
    "_id": "hackathon-7",
    "title": "MLH Local Hack Day: Build",
    "organizer": "Major League Hacking",
    "date": "2024-04-25T00:00:00.000Z",
    "location": "Local Communities",
    "mode": "offline",
    "type": "HACKATHON",
    "tags": [
      "MLH",
      "Local",
      "Community",
      "Learning"
    ],
    "description": "Join your local developer community for a day of building, learning, and networking.",
    "link": "https://localhackday.mlh.io/"
  },
  {
    "_id": "hackathon-8",
    "title": "AngelHack Global Hackathon Series",
    "organizer": "AngelHack",
    "date": "2024-06-30T00:00:00.000Z",
    "location": "Multiple Cities",
    "mode": "hybrid",
    "type": "HACKATHON",
    "tags": [
      "Startup",
      "Innovation",
      "Pitch",
      "Funding"
    ],
    "description": "Build innovative solutions and pitch to investors. Get funding and mentorship opportunities.",
    "link": "https://angelhack.com/"
  },
  {
    "_id": "hackathon-9",
    "title": "HackMIT 2024",
    "organizer": "MIT",
    "date": "2024-09-15T00:00:00.000Z",
    "location": "Cambridge, MA",
    "mode": "offline",
    "type": "HACKATHON",
    "tags": [
      "MIT",
      "University",
      "Innovation",
      "Technology"
    ],
    "description": "One of the most prestigious university hackathons. Join students from top universities worldwide.",
    "link": "https://hackmit.org/"
  },
  {
    "_id": "hackathon-10",
    "title": "PennApps Hackathon",
    "organizer": "University of Pennsylvania",
    "date": "2024-08-25T00:00:00.000Z",
    "location": "Philadelphia, PA",
    "mode": "offline",
    "type": "HACKATHON",
    "tags": [
      "University",
      "Innovation",
      "Technology",
      "Networking"
    ],
    "description": "America's first student-run college hackathon. Build innovative solutions with students worldwide.",
    "link": "https://pennapps.com/"
  },
  {
    "_id": "internship-1",
    "title": "Software Engineering Intern",
    "organizer": "Google",
    "date": "2024-03-15T00:00:00.000Z",
    "location": "Mountain View, CA",
    "mode": "hybrid",
    "type": "INTERNSHIP",
    "tags": [
      "JavaScript",
      "React",
      "Node.js",
      "Python"
    ],
    "description": "Join our engineering team to build scalable applications that impact billions of users worldwide.",
    "link": "https://careers.google.com/jobs/results/"
  },
  {
    "_id": "internship-2",
    "title": "Data Science Intern",
    "organizer": "Microsoft",
    "date": "2024-02-28T00:00:00.000Z",
    "location": "Remote",
    "mode": "remote",
    "type": "INTERNSHIP",
    "tags": [
      "Python",
      "Machine Learning",
      "SQL",
      "Statistics"
    ],
    "description": "Work on cutting-edge AI and machine learning projects that shape the future of technology.",
    "link": "https://careers.microsoft.com/us/en/search-results"
  },
  {
    "_id": "internship-3",
    "title": "Frontend Development Intern",
    "organizer": "Meta",
    "date": "2024-04-10T00:00:00.000Z",
    "location": "Menlo Park, CA",
    "mode": "hybrid",
    "type": "INTERNSHIP",
    "tags": [
      "React",
      "JavaScript",
      "CSS",
      "TypeScript"
    ],
    "description": "Build user interfaces for products used by billions of people around the world.",
    "link": "https://www.metacareers.com/jobs/"
  },
  {
    "_id": "internship-4",
    "title": "Cloud Engineering Intern",
    "organizer": "Amazon Web Services",
    "date": "2024-03-20T00:00:00.000Z",
    "location": "Remote",
    "mode": "remote",
    "type": "INTERNSHIP",
    "tags": [
      "AWS",
      "Python",
      "Docker",
      "Kubernetes"
    ],
    "description": "Help build and maintain the world's most comprehensive cloud computing platform.",
    "link": "https://www.amazon.jobs/en/teams/internships-for-students"
  },
  {
    "_id": "internship-5",
    "title": "AI Research Intern",
    "organizer": "OpenAI",
    "date": "2024-02-25T00:00:00.000Z",
    "location": "San Francisco, CA",
    "mode": "offline",
    "type": "INTERNSHIP",
    "tags": [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "Research"
    ],
    "description": "Contribute to cutting-edge AI research and help develop the next generation of AI systems.",
    "link": "https://openai.com/careers"
  },
  {
    "_id": "internship-6",
    "title": "Cybersecurity Intern",
    "organizer": "CrowdStrike",
    "date": "2024-04-15T00:00:00.000Z",
    "location": "Sunnyvale, CA",
    "mode": "hybrid",
    "type": "INTERNSHIP",
    "tags": [
      "Cybersecurity",
      "Python",
      "Network Security",
      "Malware Analysis"
    ],
    "description": "Help protect organizations from cyber threats and develop security solutions.",
    "link": "https://www.crowdstrike.com/careers/"
  },
  {
    "_id": "internship-7",
    "title": "Product Management Intern",
    "organizer": "Netflix",
    "date": "2024-03-30T00:00:00.000Z",
    "location": "Los Gatos, CA",
    "mode": "offline",
    "type": "INTERNSHIP",
    "tags": [
      "Product Management",
      "Data Analysis",
      "User Research",
      "Strategy"
    ],
    "description": "Help shape the future of entertainment by working on product strategy and user experience.",
    "link": "https://jobs.netflix.com/"
  },
  {
    "_id": "internship-8",
    "title": "Government Technology Intern",
    "organizer": "U.S. Digital Service",
    "date": "2024-04-20T00:00:00.000Z",
    "location": "Washington, DC",
    "mode": "offline",
    "type": "INTERNSHIP",
    "tags": [
      "Software Development",
      "Public Policy",
      "User-Centered Design"
    ],
    "description": "Help improve government services through technology and design thinking.",
    "link": "https://www.usds.gov/join"
  },
  {
    "_id": "internship-9",
    "title": "NGO Technology Intern",
    "organizer": "UNICEF Innovation",
    "date": "2024-05-10T00:00:00.000Z",
    "location": "Remote",
    "mode": "remote",
    "type": "INTERNSHIP",
    "tags": [
      "Technology",
      "Social Impact",
      "Project Management"
    ],
    "description": "Use technology to create positive social impact and help children worldwide.",
    "link": "https://www.unicef.org/innovation/"
  },
  {
    "_id": "internship-10",
    "title": "Startup Engineering Intern",
    "organizer": "Stripe",
    "date": "2024-03-10T00:00:00.000Z",
    "location": "San Francisco, CA",
    "mode": "hybrid",
    "type": "INTERNSHIP",
    "tags": [
      "Full Stack Development",
      "API Design",
      "Payment Systems"
    ],
    "description": "Help build the economic infrastructure for the internet at a fast-growing fintech company.",
    "link": "https://stripe.com/jobs"
  }
];

const Events = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1000,
    total: 0,
    pages: 0
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    mode: searchParams.get('mode') || '',
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
        let fetchedEvents = response.data || [];

        // Fallback to sample events if API has none
        if (fetchedEvents.length === 0) {
          fetchedEvents = SAMPLE_EVENTS;
          // Apply ALL filters manually for sample events
          if (appliedFilters.type) {
            fetchedEvents = fetchedEvents.filter(e => e.type === appliedFilters.type);
          }
          if (appliedFilters.search) {
            const s = appliedFilters.search.toLowerCase();
            fetchedEvents = fetchedEvents.filter(e =>
              e.title?.toLowerCase().includes(s) ||
              e.organizer?.toLowerCase().includes(s) ||
              e.tags?.some(t => t.toLowerCase().includes(s))
            );
          }
          if (appliedFilters.mode) {
            fetchedEvents = fetchedEvents.filter(e => e.mode === appliedFilters.mode);
          }
        } else {
          // Only apply mode filter for real events since backend doesn't support mode natively yet
          if (appliedFilters.mode) {
            fetchedEvents = fetchedEvents.filter(e => e.mode === appliedFilters.mode);
          }
        }

        setEvents(fetchedEvents);
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
      mode: '',
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
        window.dispatchEvent(new Event('bookmarkUpdated'))
        toast.success('Bookmark removed')
      } else {
        await eventService.addBookmark(eventId)
        setEvents(prev => prev.map(e =>
          (e._id === eventId || e.id === eventId) ? { ...e, isBookmarked: true } : e
        ))
        window.dispatchEvent(new Event('bookmarkUpdated'))
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
      INTERNSHIP: 'bg-blue-500/20 text-blue-200 border border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300',
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
    return colors[type] || 'bg-white/10 text-gray-200 border border-white/20  '
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
      <div className="relative min-h-screen py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 w-64 bg-white/10 rounded mx-auto mb-4" />
                <div className="h-4 w-96 bg-white/10 rounded mx-auto mb-6" />
              </div>
            </div>

            {/* Filters Skeleton */}
            <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-6 mb-8">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-white/10 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 bg-white/10 rounded" />
                  ))}
                </div>
                <div className="h-10 w-32 bg-white/10 rounded mx-auto" />
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
    <div className="relative min-h-screen py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Events
          </h1>
          <p className="text-lg text-white">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${appliedFilters.type === filter.type
                  ? 'bg-blue-600 text-white shadow-lg border-blue-500 transform scale-105'
                  : 'bg-white/5 text-gray-100 hover:bg-white/10 border-white/10'
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
          className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2 text-blue-400" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-500 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors backdrop-blur-sm"
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

            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">Mode</label>
              <select
                value={filters.mode}
                onChange={(e) => handleFilterChange('mode', e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors backdrop-blur-sm"
              >
                <option value="">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors backdrop-blur-sm [color-scheme:dark]"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors backdrop-blur-sm [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/20 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible"
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id || event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, y: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] backdrop-blur-sm rounded-xl shadow-md 
  border border-white/50 hover:border-white 
  hover:shadow-[0_0_90px_rgba(59,130,246,0.25)] 
  group flex flex-col relative z-0 hover:z-20"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                    {event.mode && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.mode === 'online' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        event.mode === 'hybrid' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                          'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                        {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                      </span>
                    )}
                  </div>
                  {user && (
                    <button
                      onClick={() => toggleBookmark(event._id || event.id)}
                      className={`text-gray-200 hover:text-yellow-500 transition-colors ${event.isBookmarked || event.bookmarkedBy?.includes(user._id) ? 'text-yellow-500' : ''
                        }`}
                    >
                      <BookmarkIcon className={`w-5 h-5 ${event.isBookmarked || event.bookmarkedBy?.includes(user._id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-200 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                {event.organizer && (
                  <p className="text-sm font-medium text-blue-300 mb-2">By {event.organizer}</p>
                )}

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-200">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>

                  {event.location && (
                    <div className="flex items-center text-sm text-gray-200">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  )}

                  {event.deadline && (
                    <div className="flex items-center text-sm text-gray-200">
                      <TagIcon className="w-4 h-4 mr-2" />
                      Deadline: {format(new Date(event.deadline), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>

                {/* Engagement Stats */}
                {event.engagement && (
                  <div className="flex items-center justify-between text-xs text-gray-200 mb-4">
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

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <Link
                    to={`/events/${event._id || event.id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    View Details →
                  </Link>

                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/20 text-white text-sm rounded-lg transition-all duration-300 hover:scale-[1.02]"
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
              className="px-4 py-2 bg-white/10 text-gray-200  rounded-lg hover:bg-gray-300  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className={`px-3 py-2 rounded-lg transition-colors ${pagination.page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-200  hover:bg-gray-300 '
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
              className="px-4 py-2 bg-white/10 text-gray-200  rounded-lg hover:bg-gray-300  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <div className="text-gray-200 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-gray-200 mb-6">Try adjusting your filters or check back later for new opportunities.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/20 text-white rounded-lg transition-all duration-300 hover:scale-[1.02]"
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