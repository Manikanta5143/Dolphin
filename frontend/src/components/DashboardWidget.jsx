import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  BookmarkIcon, 
  SparklesIcon, 
  FireIcon, 
  TrophyIcon, 
  BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import LoadingSkeleton from './LoadingSkeleton';

const DashboardWidget = ({ 
  title, 
  icon, 
  children, 
  loading = false, 
  error = null,
  onRefresh = null,
  className = "",
  variant = 'default'
}) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'stats':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700';
      case 'recommendations':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700';
      case 'trending':
        return 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700';
      case 'achievements':
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700';
      case 'leaderboard':
        return 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'chart':
        return ChartBarIcon;
      case 'bookmark':
        return BookmarkIcon;
      case 'sparkles':
        return SparklesIcon;
      case 'fire':
        return FireIcon;
      case 'trophy':
        return TrophyIcon;
      case 'bell':
        return BellIcon;
      default:
        return ChartBarIcon;
    }
  };

  const IconComponent = getIconComponent(icon);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border p-6 ${getVariantStyles(variant)} ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <LoadingSkeleton variant="text" lines={3} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border p-6 ${getVariantStyles(variant)} ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-6 h-6 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border p-6 ${getVariantStyles(variant)} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardWidget;
