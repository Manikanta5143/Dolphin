const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getTrendingEvents,
  getUpcomingEvents,
  getEventsByType,
  searchEvents,
  getEventStats,
  trackShare,
  getShareStats
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/trending', getTrendingEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/type/:type', getEventsByType);
router.get('/search', searchEvents);
router.get('/stats', getEventStats);
router.post('/share', trackShare);
router.get('/:id/shares', getShareStats);
router.get('/:id', getEvent);

// Protected routes (Admin only)
router.post('/', protect, authorize('ADMIN'), createEvent);
router.put('/:id', protect, authorize('ADMIN'), updateEvent);
router.delete('/:id', protect, authorize('ADMIN'), deleteEvent);

module.exports = router; 