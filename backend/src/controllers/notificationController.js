const Notification = require('../models/Notification');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false, type, category, priority } = req.query;
    const userId = req.user._id;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
      type,
      category,
      priority
    };

    const notifications = await Notification.getUserNotifications(userId, options);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read'
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
};

// @desc    Create notification (Admin only)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, data, priority, category } = req.body;

    // Validate required fields
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Type, title, and message are required'
      });
    }

    // If userId is provided, create notification for specific user
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const notification = await Notification.createNotification({
        userId,
        type,
        title,
        message,
        data: data || {},
        priority: priority || 'medium',
        category: category || 'engagement'
      });

      res.status(201).json({
        success: true,
        data: notification,
        message: 'Notification created successfully'
      });
    } else {
      // Create notification for all users (broadcast)
      const users = await User.find({}, '_id');
      const notifications = [];

      for (const user of users) {
        const notification = await Notification.createNotification({
          userId: user._id,
          type,
          title,
          message,
          data: data || {},
          priority: priority || 'medium',
          category: category || 'system'
        });
        notifications.push(notification);
      }

      res.status(201).json({
        success: true,
        data: notifications,
        message: `Notifications created for ${notifications.length} users`
      });
    }
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, push, reminderTiming, newEventNotifications, achievementNotifications, communityNotifications } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update notification preferences
    if (email !== undefined) user.notificationPreferences.email = email;
    if (push !== undefined) user.notificationPreferences.push = push;
    if (reminderTiming) user.notificationPreferences.reminderTiming = reminderTiming;
    if (newEventNotifications !== undefined) user.notificationPreferences.newEventNotifications = newEventNotifications;
    if (achievementNotifications !== undefined) user.notificationPreferences.achievementNotifications = achievementNotifications;
    if (communityNotifications !== undefined) user.notificationPreferences.communityNotifications = communityNotifications;

    await user.save();

    res.json({
      success: true,
      data: user.notificationPreferences,
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification preferences'
    });
  }
};

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
const getNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('notificationPreferences');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.notificationPreferences
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notification preferences'
    });
  }
};

// @desc    Track notification interaction
// @route   POST /api/notifications/:id/track
// @access  Private
const trackNotificationInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, platform } = req.body;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    // Track different types of interactions
    switch (action) {
      case 'email_opened':
        await notification.markEmailOpened();
        break;
      case 'email_clicked':
        await notification.markEmailOpened();
        break;
      case 'push_clicked':
        await notification.markPushClicked();
        break;
      case 'in_app_clicked':
        await notification.markAsRead();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    console.error('Track notification interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction'
    });
  }
};

// @desc    Clean up expired notifications (Admin only)
// @route   DELETE /api/notifications/cleanup
// @access  Private/Admin
const cleanupExpiredNotifications = async (req, res) => {
  try {
    const result = await Notification.cleanExpiredNotifications();

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired notifications`
    });
  } catch (error) {
    console.error('Cleanup expired notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired notifications'
    });
  }
};

// @desc    Get notification statistics (Admin only)
// @route   GET /api/notifications/stats
// @access  Private/Admin
const getNotificationStats = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (timeframe) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
    }

    const stats = await Notification.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          unreadNotifications: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          readNotifications: { $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] } },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead'
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              isRead: '$isRead'
            }
          }
        }
      }
    ]);

    // Process type and priority statistics
    const typeStats = {};
    const priorityStats = {};

    if (stats.length > 0) {
      stats[0].byType.forEach(item => {
        if (!typeStats[item.type]) {
          typeStats[item.type] = { total: 0, read: 0, unread: 0 };
        }
        typeStats[item.type].total++;
        if (item.isRead) {
          typeStats[item.type].read++;
        } else {
          typeStats[item.type].unread++;
        }
      });

      stats[0].byPriority.forEach(item => {
        if (!priorityStats[item.priority]) {
          priorityStats[item.priority] = { total: 0, read: 0, unread: 0 };
        }
        priorityStats[item.priority].total++;
        if (item.isRead) {
          priorityStats[item.priority].read++;
        } else {
          priorityStats[item.priority].unread++;
        }
      });

      delete stats[0].byType;
      delete stats[0].byPriority;
      stats[0].typeStats = typeStats;
      stats[0].priorityStats = priorityStats;
    }

    res.json({
      success: true,
      data: stats[0] || {
        totalNotifications: 0,
        unreadNotifications: 0,
        readNotifications: 0,
        typeStats: {},
        priorityStats: {}
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notification statistics'
    });
  }
};

module.exports = {
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
};
