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

// Public route for tracking clicks
router.get('/track/:shareToken', trackShareClick);

// All other routes require authentication
router.use(protect);

// User routes
router.get('/user', getUserShares);
router.get('/event/:eventId', getEventShares);
router.get('/stats', getShareStats);
router.get('/:id', getShare);
router.post('/', shareEvent);
router.post('/generate-link', generateShareableLink);
router.put('/:id/analytics', updateShareAnalytics);
router.delete('/:id', deleteShare);

// Admin routes
router.get('/admin/trending', authorize('ADMIN'), getTrendingShares);
router.delete('/admin/cleanup', authorize('ADMIN'), cleanupExpiredShares);

module.exports = router;
