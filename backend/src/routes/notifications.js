const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  updateNotificationPreferences,
  getNotificationPreferences,
  trackNotificationInteraction,
  cleanupExpiredNotifications,
  getNotificationStats
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllAsRead);
router.put('/preferences', updateNotificationPreferences);
router.get('/preferences', getNotificationPreferences);
router.post('/:id/track', trackNotificationInteraction);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/', authorize('ADMIN'), createNotification);
router.delete('/cleanup', authorize('ADMIN'), cleanupExpiredNotifications);
router.get('/stats', authorize('ADMIN'), getNotificationStats);

module.exports = router;
