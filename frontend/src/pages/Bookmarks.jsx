import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookmarkIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon,
  TrashIcon,
  ComputerDesktopIcon,
  BriefcaseIcon,
  TrophyIcon,
  CogIcon,
  MicrophoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSkeleton, { EventCardSkeleton } from '../components/LoadingSkeleton';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState({
    events: [],
    hackathons: [],
    internships: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Sample bookmarked data (in real app, this would come from API)
  const sampleBookmarks = {
    events: [
      {
        id: 1,
        title: "Google Developer Student Clubs Solution Challenge 2024",
        type: "HACKATHON",
        date: "2024-04-15",
        deadline: "2024-04-10",
        location: "Global",
        organizer: "Google",
        description: "Build solutions for local community problems using Google technologies.",
        link: "https://developers.google.com/community/gdsc/events/solution-challenge",
        category: "events"
      },
      {
        id: 2,
        title: "React Workshop: Building Modern Web Applications",
        type: "WORKSHOP",
        date: "2024-04-20",
        deadline: "2024-04-15",
        location: "San Francisco, CA",
        organizer: "React Workshop",
        description: "Learn React fundamentals and build a complete web application.",
        link: "https://reactworkshop.dev/",
        category: "events"
      }
    ],
    hackathons: [
      {
        id: 3,
        title: "Microsoft Imagine Cup 2024",
        organizer: "Microsoft",
        date: "2024-05-20",
        deadline: "2024-05-15",
        location: "Seattle, WA",
        mode: "hybrid",
        scope: "international",
        difficulty: "advanced",
        description: "The world's premier student technology competition.",
        link: "https://imaginecup.microsoft.com/",
        category: "hackathons"
      }
    ],
    internships: [
      {
        id: 4,
        title: "Software Engineering Intern",
        company: "Google",
        mode: "hybrid",
        type: "paid",
        duration: "3-6 months",
        deadline: "2024-03-15",
        stipend: "$8000/month",
        location: "Mountain View, CA",
        description: "Join our engineering team to build scalable applications.",
        link: "https://careers.google.com/jobs/results/",
        category: "internships"
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookmarks(sampleBookmarks);
      setLoading(false);
    }, 1000);
  }, []);

  const removeBookmark = async (itemId, category) => {
    try {
      setBookmarks(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== itemId)
      }));
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      HACKATHON: 'bg-red-100 text-red-800',
      CODING_FEST: 'bg-green-100 text-green-800',
      INTERNSHIP: 'bg-blue-100 text-blue-800',
      WORKSHOP: 'bg-purple-100 text-purple-800',
      CONFERENCE: 'bg-yellow-100 text-yellow-800',
      COMPETITION: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      HACKATHON: <ComputerDesktopIcon className="w-5 h-5" />,
      CODING_FEST: <TrophyIcon className="w-5 h-5" />,
      INTERNSHIP: <BriefcaseIcon className="w-5 h-5" />,
      WORKSHOP: <CogIcon className="w-5 h-5" />,
      CONFERENCE: <MicrophoneIcon className="w-5 h-5" />,
      COMPETITION: <StarIcon className="w-5 h-5" />
    };
    return icons[type] || <CalendarIcon className="w-5 h-5" />;
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAllBookmarks = () => {
    return [
      ...bookmarks.events.map(item => ({ ...item, source: 'events' })),
      ...bookmarks.hackathons.map(item => ({ ...item, source: 'hackathons' })),
      ...bookmarks.internships.map(item => ({ ...item, source: 'internships' }))
    ];
  };

  const getFilteredBookmarks = () => {
    if (activeTab === 'all') {
      return getAllBookmarks();
    }
    return bookmarks[activeTab] || [];
  };

  const totalBookmarks = Object.values(bookmarks).reduce((sum, items) => sum + items.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="flex space-x-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            </div>

            {/* Bookmarks Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please login to view your bookmarks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] rounded-lg shadow-md p-6 mb-8 hover: border-border-white hover:border"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3">
              <BookmarkIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-100 dark:text-white">My Bookmarks</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">All your saved opportunities in one place</p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalBookmarks}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookmarks</div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05, ease: "easeOut" }}
          className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 hover: border-border-white hover:border"
        >
          <div className="border-b border-gray-200 dark:border-white">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                All ({totalBookmarks})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'events'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                Events ({bookmarks.events.length})
              </button>
              <button
                onClick={() => setActiveTab('hackathons')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'hackathons'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                Hackathons ({bookmarks.hackathons.length})
              </button>
              <button
                onClick={() => setActiveTab('internships')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'internships'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                Internships ({bookmarks.internships.length})
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Bookmarks Grid */}
        {getFilteredBookmarks().length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookmarks found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'all'
                ? "Start exploring events, hackathons, and internships to bookmark your favorites."
                : `No bookmarked ${activeTab} found. Start exploring ${activeTab} to bookmark your favorites.`
              }
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/events" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Browse Events</a>
              <a href="/hackathons" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Browse Hackathons</a>
              <a href="/internships" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Browse Internships</a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getFilteredBookmarks().map((item, index) => {
              const daysUntilDeadline = getDaysUntilDeadline(item.deadline);
              const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;

              return (
                <motion.div
                  key={`${item.source}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, ease: "easeIn" }}
                  transition={{ duration: 0.1 }}
                  className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-100 hover: border-border-white hover:border hover:shadow-[0_0_50px_rgba(131,212,152,0.35)]"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-blue-600 dark:text-blue-400">
                          {getEventTypeIcon(item.type)}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(item.type)}`}>
                          {item.type?.replace('_', ' ') || item.source}
                        </span>
                      </div>
                      <button
                        onClick={() => removeBookmark(item.id, item.source)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove bookmark"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-100 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Company/Organizer */}
                    <div className="flex items-center text-sm text-gray-400 dark:text-gray-400 mb-2">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      {item.company || item.organizer}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 dark:text-gray-300 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>

                      {item.location && (
                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {item.location}
                        </div>
                      )}

                      {item.deadline && (
                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-400">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          <span className={isUrgent ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            Deadline: {new Date(item.deadline).toLocaleDateString()}
                            {isUrgent && ` (${daysUntilDeadline} days left)`}
                          </span>
                        </div>
                      )}

                      {/* Additional details based on type */}
                      {item.stipend && (
                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-400">
                          <TagIcon className="w-4 h-4 mr-2" />
                          {item.stipend}
                        </div>
                      )}

                      {item.mode && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {item.source === 'internships' ? 'Apply Now' : 'Learn More'}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks; 