import React from 'react';
import { FaTrophy, FaMedal, FaStar, FaCrown, FaGem } from 'react-icons/fa';

const AchievementDisplay = ({ achievement, showProgress = true, size = 'medium' }) => {
  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return <FaCrown className="text-yellow-500" />;
      case 'epic':
        return <FaGem className="text-purple-500" />;
      case 'rare':
        return <FaStar className="text-blue-500" />;
      case 'uncommon':
        return <FaMedal className="text-green-500" />;
      default:
        return <FaTrophy className="text-yellow-600" />;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'border-yellow-400 bg-yellow-50';
      case 'epic':
        return 'border-purple-400 bg-purple-50';
      case 'rare':
        return 'border-blue-400 bg-blue-50';
      case 'uncommon':
        return 'border-green-400 bg-green-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'w-12 h-12 text-lg';
      case 'large':
        return 'w-24 h-24 text-4xl';
      default:
        return 'w-16 h-16 text-2xl';
    }
  };

  const progressPercentage = achievement.progress || 0;
  const isEarned = achievement.isEarned || progressPercentage === 100;

  return (
    <div className={`relative ${getSizeClasses(size)}`}>
      {/* Achievement Icon */}
      <div className={`
        w-full h-full rounded-full border-2 flex items-center justify-center
        ${isEarned ? getRarityColor(achievement.rarity) : 'border-gray-300 bg-gray-100'}
        ${!isEarned ? 'opacity-50' : ''}
        transition-all duration-300 hover:scale-105
      `}>
        {isEarned ? (
          <span className="text-2xl">{achievement.icon}</span>
        ) : (
          <span className="text-2xl text-gray-400">🔒</span>
        )}
      </div>

      {/* Rarity Indicator */}
      {isEarned && (
        <div className="absolute -top-1 -right-1">
          {getRarityIcon(achievement.rarity)}
        </div>
      )}

      {/* Progress Ring (if not earned and progress is shown) */}
      {!isEarned && showProgress && progressPercentage > 0 && (
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
            className="text-blue-500 transition-all duration-500"
          />
        </svg>
      )}

      {/* Progress Text (for small size) */}
      {size === 'small' && !isEarned && showProgress && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AchievementDisplay;
