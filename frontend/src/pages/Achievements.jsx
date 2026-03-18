import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAchievements } from '../context/AchievementContext';
import AchievementCard from '../components/AchievementCard';
import AchievementModal from '../components/AchievementModal';
import LoadingSkeleton, { EventCardSkeleton } from '../components/LoadingSkeleton';
import { 
  TrophyIcon, 
  StarIcon, 
  FunnelIcon,
  XMarkIcon,
  ChartBarIcon,
  FireIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Achievements = () => {
  const { 
    achievements, 
    userAchievements, 
    userStats, 
    loading, 
    error, 
    fetchUserAchievements,
    newAchievements,
    clearNewAchievements
  } = useAchievements();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAchievement, setModalAchievement] = useState(null);

  useEffect(() => {
    fetchUserAchievements();
  }, []);

  // Show achievement modal when new achievements are earned
  useEffect(() => {
    if (newAchievements.length > 0) {
      setModalAchievement(newAchievements[0]);
      setShowModal(true);
    }
  }, [newAchievements]);

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAchievement(null);
    clearNewAchievements();
  };

  const categories = ['all', 'engagement', 'discovery', 'community', 'learning', 'social', 'milestone'];
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
  const difficulties = ['all', 'easy', 'medium', 'hard', 'expert'];

  const filteredAchievements = userAchievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) return false;
    if (selectedDifficulty !== 'all' && achievement.difficulty !== selectedDifficulty) return false;
    if (showEarnedOnly && !achievement.isEarned) return false;
    return true;
  });

  const earnedCount = userAchievements.filter(a => a.isEarned).length;
  const totalCount = userAchievements.length;

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
            
            {/* Stats Grid Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center">
                      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2" />
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Filters Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Achievements Grid Skeleton */}
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
              Error Loading Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchUserAchievements}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Achievements
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Track your progress and unlock rewards for your engagement
          </p>
          
          {/* User Stats */}
          {userStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <StarIcon className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.totalPoints}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <AcademicCapIcon className="w-6 h-6 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.level}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrophyIcon className="w-6 h-6 text-purple-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {earnedCount}/{totalCount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <ChartBarIcon className="w-6 h-6 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((earnedCount / totalCount) * 100)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                </div>
              </div>
            </motion.div>
          )}
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
              onClick={() => {
                setSelectedCategory('all');
                setSelectedRarity('all');
                setSelectedDifficulty('all');
                setShowEarnedOnly(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rarity
              </label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Earned Only Filter */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showEarnedOnly}
                  onChange={(e) => setShowEarnedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Earned Only
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <AchievementCard
                achievement={achievement}
                isEarned={achievement.isEarned}
                progress={achievement.progress}
                earnedAt={achievement.earnedAt}
                showProgress={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center py-16"
          >
            <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or start earning achievements!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedRarity('all');
                setSelectedDifficulty('all');
                setShowEarnedOnly(false);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={modalAchievement}
        isOpen={showModal}
        onClose={handleCloseModal}
        points={userStats?.totalPoints || 0}
        level={userStats?.level || 'Beginner'}
      />
    </div>
  );
};

export default Achievements;
