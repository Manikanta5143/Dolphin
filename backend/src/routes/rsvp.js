const express = require('express');
const {
  createRSVP,
  getUserRSVPs,
  getRSVP,
  updateRSVP,
  deleteRSVP,
  checkIn,
  checkOut,
  submitFeedback,
  getEventRSVPs,
  getRSVPStats,
  getUpcomingEvents
} = require('../controllers/rsvpController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', getUserRSVPs);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getRSVP);
router.post('/', createRSVP);
router.put('/:id', updateRSVP);
router.delete('/:id', deleteRSVP);
router.post('/:id/checkin', checkIn);
router.post('/:id/checkout', checkOut);
router.post('/:id/feedback', submitFeedback);

// Admin routes
router.get('/admin/event/:eventId', authorize('ADMIN'), getEventRSVPs);
router.get('/admin/stats', authorize('ADMIN'), getRSVPStats);

module.exports = router;
