import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Heroicons
import {
  RocketLaunchIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  UserGroupIcon,
  StarIcon,
  TrophyIcon,
  BriefcaseIcon,
  CogIcon,
  FireIcon,
  EyeIcon,
  ShareIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  HeartIcon,
  LightBulbIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BeakerIcon,
  CodeBracketIcon,
  PresentationChartLineIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

// React Icons
import {
  FaSearch,
  FaBookmark,
  FaRocket,
  FaLaptopCode,
  FaGraduationCap,
  FaUsers,
  FaCode,
  FaTrophy,
  FaHeart,
  FaLightbulb,
  FaChartLine,
  FaGlobe,
  FaFlask,
  FaUserPlus,
  FaBuilding,
  FaDollarSign,
  FaPlay,
  FaCheckCircle
} from 'react-icons/fa'

import { useAuth } from '../context/AuthContext'
import RecommendedList from '../components/RecommendedList'
import TrendingEvents from '../components/TrendingEvents'
import CategoryTrendingEvents from '../components/CategoryTrendingEvents'
import MAANGInternships from '../components/MAANGInternships'
import SDERecommendations from '../components/SDERecommendations'

const Home = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeUsers: 0,
    successStories: 0,
    partnerships: 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalEvents: 1247,
        activeUsers: 15420,
        successStories: 892,
        partnerships: 156
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const eventTypes = [
    { type: 'HACKATHON', icon: '💻', label: 'Hackathons', count: 234, color: 'from-red-500 to-pink-500' },
    { type: 'INTERNSHIP', icon: '💼', label: 'Internships', count: 189, color: 'from-blue-500 to-cyan-500' },
    { type: 'WORKSHOP', icon: '🔧', label: 'Workshops', count: 156, color: 'from-purple-500 to-violet-500' },
    { type: 'CONFERENCE', icon: '🎤', label: 'Conferences', count: 98, color: 'from-yellow-500 to-orange-500' },
    { type: 'COMPETITION', icon: '🏅', label: 'Competitions', count: 145, color: 'from-green-500 to-emerald-500' },
    { type: 'MEETUP', icon: '👥', label: 'Meetups', count: 203, color: 'from-indigo-500 to-blue-500' }
  ]

  const features = [
    { icon: FaSearch, title: 'Smart Discovery', description: 'AI-powered recommendations based on your interests and skills', color: 'text-blue-600' },
    { icon: FaBookmark, title: 'Personal Dashboard', description: 'Track your progress, achievements, and upcoming events', color: 'text-green-600' },
    { icon: FaRocket, title: 'Career Acceleration', description: 'Connect with industry leaders and accelerate your career', color: 'text-purple-600' },
    { icon: FaTrophy, title: 'Achievement System', description: 'Earn points and badges for your participation and success', color: 'text-yellow-600' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-800 via-gray-600 to-indigo-800 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-gray-800/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4 mr-2" /> Join 15,000+ Students Already Building Their Future
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-blue-500 to-gray-200 bg-clip-text text-transparent">Opportunity</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              The ultimate platform for college students to discover, participate in, and excel at hackathons, internships, workshops, and career opportunities. Your gateway to tech success starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/events" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl flex items-center">
                  <FaSearch className="mr-2" /> Explore Events <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm flex items-center">
                  <FaRocket className="mr-2" /> Get Started Free
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'Active Events', value: stats.totalEvents, icon: CalendarIcon },
                { label: 'Students', value: stats.activeUsers, icon: UserGroupIcon },
                { label: 'Success Stories', value: stats.successStories, icon: TrophyIcon },
                { label: 'Partners', value: stats.partnerships, icon: BuildingOfficeIcon }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 mr-2" /> <span className="text-3xl font-bold">{stat.value.toLocaleString()}</span>
                  </div>
                  <p className="text-blue-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Event Types */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Different <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From competitive hackathons to career-launching internships, find the perfect opportunity for your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((eventType, index) => (
              <motion.div key={eventType.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * index }} whileHover={{ scale: 1.05, y: -5 }} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${eventType.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{eventType.icon}</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{eventType.count}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{eventType.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {eventType.type === 'HACKATHON' && 'Build innovative solutions in competitive coding challenges.'}
                    {eventType.type === 'INTERNSHIP' && 'Gain real-world experience with top tech companies.'}
                    {eventType.type === 'WORKSHOP' && 'Learn new skills through hands-on training sessions.'}
                    {eventType.type === 'CONFERENCE' && 'Attend industry conferences and networking events.'}
                    {eventType.type === 'COMPETITION' && 'Participate in coding competitions and win prizes.'}
                    {eventType.type === 'MEETUP' && 'Connect with like-minded developers and professionals.'}
                  </p>
                  
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Personalized Recommendations */}

      {/* Category Trending Events */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <FireIcon className="w-8 h-8 mr-3 text-orange-500" /> Trending by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Top trending events from each category</p>
          </div>
          <CategoryTrendingEvents />
        </div>
      </motion.section>

      {/* MAANG Internships */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <BriefcaseIcon className="w-8 h-8 mr-3 text-blue-500" /> MAANG Internships
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Exclusive opportunities at top tech companies</p>
          </div>
          <MAANGInternships />
        </div>
      </motion.section>

      {/* SDE Recommendations */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <CogIcon className="w-8 h-8 mr-3 text-green-500" /> Recommendations
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Software Engineering internships and hackathons</p>
          </div>
          <SDERecommendations />
        </div>
      </motion.section>

      
      
    </div>
  )
}

export default Home
