const express = require('express');
const {
  shareEvent,
  getUserShares,
  getEventShares,
  trackShareClick,
  getShare,
  updateShareAnalytics,
  deleteShare,
  getShareStats,
  getTrendingShares,
  cleanupExpiredShares,
  generateShareableLink
} = require('../controllers/shareController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/track/:shareToken', trackShareClick);

// Protected routes
router.use(protect);

// User routes
router.post('/', shareEvent);
router.get('/user', getUserShares);
router.get('/event/:eventId', getEventShares);
router.get('/:id', getShare);
router.put('/:id/analytics', updateShareAnalytics);
router.delete('/:id', deleteShare);
router.get('/stats', getShareStats);
router.post('/generate-link', generateShareableLink);

// Admin routes
router.get('/trending', authorize('ADMIN'), getTrendingShares);
router.delete('/cleanup', authorize('ADMIN'), cleanupExpiredShares);

module.exports = router;
