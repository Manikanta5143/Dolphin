import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import DashboardWidget from '../components/DashboardWidget';
import RecommendedList from '../components/RecommendedList';
import TrendingEvents from '../components/TrendingEvents';
import Leaderboard from '../components/Leaderboard';
import CountdownBadge from '../components/CountdownBadge';
import ShareButton from '../components/ShareButton';
import { 
  StarIcon, 
  TrophyIcon, 
  BookmarkIcon, 
  ShareIcon,
  EyeIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    dashboard, 
    loading, 
    error, 
    fetchDashboard,
    refreshWidget 
  } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

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
            
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchDashboard}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { user: userData, stats, bookmarks, recommendations, trending, achievements, leaderboard } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Here's what's happening with your events and achievements
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Points</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPoints}</p>
        </div>
              <StarIcon className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.level}</p>
                </div>
              <TrophyIcon className="w-8 h-8 text-blue-500" />
                </div>
              </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bookmarks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bookmarkedEvents}</p>
                </div>
              <BookmarkIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.achievementCount}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RecommendedList limit={4} />
            </motion.div>

            {/* Bookmarks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <DashboardWidget
                title="Your Bookmarks"
                icon="bookmark"
                variant="default"
                onRefresh={() => refreshWidget('bookmarks')}
              >
                {bookmarks && bookmarks.length > 0 ? (
                  <div className="space-y-3">
                    {bookmarks.slice(0, 4).map((event) => (
                      <div key={event._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {event.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <CountdownBadge event={event} size="sm" />
                    </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BookmarkIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No bookmarked events yet
                    </p>
                                  </div>
                                )}
              </DashboardWidget>
            </motion.div>
                              </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Trending Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TrendingEvents limit={4} />
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <DashboardWidget
                title="Recent Achievements"
                icon="trophy"
                variant="achievements"
                onRefresh={() => refreshWidget('achievements')}
              >
                {achievements && achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {achievement.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            +{achievement.points} points
                          </p>
                              </div>
                            </div>
                    ))}
                          </div>
                ) : (
                  <div className="text-center py-4">
                    <TrophyIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No achievements yet
                    </p>
                  </div>
                )}
              </DashboardWidget>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Leaderboard limit={5} />
            </motion.div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Dashboard;