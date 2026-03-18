import React from 'react';
import { 
  LockClosedIcon, 
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const AchievementCard = ({ 
  achievement, 
  isEarned = false, 
  progress = 0,
  earnedAt = null,
  showProgress = true,
  className = ""
}) => {
  const {
    _id,
    name,
    description,
    icon,
    category,
    rarity,
    difficulty,
    points,
    isSecret,
    showProgress: achievementShowProgress
  } = achievement;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
      case 'uncommon':
        return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'rare':
        return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30';
      case 'epic':
        return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30';
      case 'legendary':
        return 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30';
      case 'hard':
        return 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30';
      case 'expert':
        return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'engagement':
        return '🎯';
      case 'discovery':
        return '🔍';
      case 'community':
        return '👥';
      case 'learning':
        return '📚';
      case 'social':
        return '🦋';
      case 'milestone':
        return '🏆';
      default:
        return '⭐';
    }
  };

  const shouldShowProgress = showProgress && achievementShowProgress && !isEarned;

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 ${className} ${
      isEarned ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
    }`}>
      {/* Achievement Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        {isEarned ? (
          <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircleSolid className="w-3 h-3" />
            <span>Earned</span>
          </div>
        ) : isSecret ? (
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
            <LockClosedIcon className="w-3 h-3" />
            <span>Secret</span>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        {/* Achievement Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              isEarned ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              {isSecret && !isEarned ? '🔒' : icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {isSecret && !isEarned ? 'Secret Achievement' : name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {isSecret && !isEarned ? 'Complete the requirements to reveal this achievement.' : description}
            </p>
          </div>
        </div>

        {/* Achievement Metadata */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(rarity)}`}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>

        {/* Points and Progress */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {points} points
            </span>
          </div>
          
          {isEarned && earnedAt && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-3 h-3" />
              <span>Earned {new Date(earnedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {shouldShowProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Achievement Status */}
        {isEarned && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircleSolid className="w-4 h-4" />
            <span className="text-sm font-medium">Achievement Unlocked!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;