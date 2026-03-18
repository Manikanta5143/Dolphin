import React, { useEffect } from 'react';
import { XMarkIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const AchievementModal = ({ 
  achievement, 
  isOpen, 
  onClose,
  points = 0,
  level = 'Beginner'
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !achievement) return null;

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

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'rare':
        return 'shadow-blue-500/50';
      case 'epic':
        return 'shadow-purple-500/50';
      case 'legendary':
        return 'shadow-orange-500/50';
      default:
        return 'shadow-gray-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Achievement Content */}
          <div className="px-6 py-8 text-center">
            {/* Celebration Animation */}
            <div className="mb-6">
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-6xl shadow-lg ${getRarityGlow(achievement.rarity)}`}>
                {achievement.icon}
              </div>
              
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{
                      left: `${20 + i * 10}%`,
                      top: '20%',
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Achievement Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Achievement Unlocked!
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {achievement.name}
            </h3>

            {/* Achievement Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {achievement.description}
            </p>

            {/* Achievement Metadata */}
            <div className="flex justify-center space-x-2 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                +{achievement.points} points
              </span>
            </div>

            {/* Points and Level Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 dark:text-white">
                    <StarIcon className="w-5 h-5 text-yellow-500" />
                    <span>{points}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Points</div>
                </div>
                
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {level}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Current Level</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Awesome!
              </button>
              <button
                onClick={() => {
                  // Navigate to achievements page
                  window.location.href = '/achievements';
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;
