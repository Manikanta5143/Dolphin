const express = require('express');
const {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder,
  getReminder,
  markReminderSent,
  trackReminderInteraction,
  getActiveReminders,
  getRetryableReminders,
  cleanupExpiredReminders,
  getReminderStats
} = require('../controllers/reminderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', getUserReminders);
router.get('/:id', getReminder);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);
router.post('/:id/track', trackReminderInteraction);

// Admin routes
router.put('/:id/mark-sent', authorize('ADMIN'), markReminderSent);
router.get('/admin/active', authorize('ADMIN'), getActiveReminders);
router.get('/admin/retryable', authorize('ADMIN'), getRetryableReminders);
router.delete('/admin/cleanup', authorize('ADMIN'), cleanupExpiredReminders);
router.get('/admin/stats', authorize('ADMIN'), getReminderStats);

module.exports = router;
