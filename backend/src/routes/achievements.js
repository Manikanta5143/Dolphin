const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getUserAchievements,
  getLeaderboard,
  awardAchievement,
  checkAchievements,
  getAchievementStats,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAchievements);
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getAchievementStats);

// Protected routes
router.get('/user', protect, getUserAchievements);
router.post('/check', protect, checkAchievements);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createAchievement);
router.put('/:id', protect, authorize('ADMIN'), updateAchievement);
router.delete('/:id', protect, authorize('ADMIN'), deleteAchievement);
router.post('/award', protect, authorize('ADMIN'), awardAchievement);

module.exports = router;
