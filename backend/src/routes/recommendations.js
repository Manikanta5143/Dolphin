const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getRecommendationExplanation,
  recordFeedback,
  updateWeights,
  clearCache,
  getCacheStats
} = require('../controllers/recommendationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (none for recommendations)

// Protected routes
router.get('/', protect, getRecommendations);
router.get('/explain/:eventId', protect, getRecommendationExplanation);
router.post('/feedback', protect, recordFeedback);

// Admin routes
router.put('/weights', protect, authorize('ADMIN'), updateWeights);
router.delete('/cache', protect, authorize('ADMIN'), clearCache);
router.get('/cache/stats', protect, authorize('ADMIN'), getCacheStats);

module.exports = router;
