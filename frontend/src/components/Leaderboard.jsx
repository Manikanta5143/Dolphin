import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { 
  TrophyIcon, 
  StarIcon, 
  UserGroupIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSkeleton from './LoadingSkeleton';

const Leaderboard = ({ 
  title = "Leaderboard", 
  limit = 10,
  timeframe = 'all',
  showTitle = true,
  className = "" 
}) => {
  const { 
    leaderboard, 
    loading, 
    error, 
    fetchLeaderboard 
  } = useAchievements();

  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  useEffect(() => {
    fetchLeaderboard({ 
      limit, 
      timeframe: selectedTimeframe 
    });
  }, [limit, selectedTimeframe]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <TrophyIcon className="w-5 h-5 text-gray-400" />;
      case 3:
        return <TrophyIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 2:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      case 3:
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Legend':
        return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30';
      case 'Champion':
        return 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30';
      case 'Expert':
        return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30';
      case 'Enthusiast':
        return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'Explorer':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
            {title}
          </h2>
        )}
        <LoadingSkeleton variant="list" lines={limit} showAvatar={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchLeaderboard({ limit, timeframe: selectedTimeframe })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <TrophyIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No leaderboard data yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start earning points to appear on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
            {title}
          </h2>
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="yearly">This Year</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {leaderboard.map((user, index) => (
          <div
            key={user.email}
            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getRankColor(user.rank)}`}
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              {getRankIcon(user.rank)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                  {user.level}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-3 h-3" />
                  <span>{user.points} points</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrophyIcon className="w-3 h-3" />
                  <span>{user.achievementCount} achievements</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserGroupIcon className="w-3 h-3" />
                  <span>{user.bookmarkedEvents} bookmarks</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {user.points}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                points
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center pt-4">
        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
