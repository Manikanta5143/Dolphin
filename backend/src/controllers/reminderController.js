const EventReminder = require('../models/EventReminder');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create event reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
  try {
    const { eventId, reminderType, reminderOption } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!eventId || !reminderOption) {
      return res.status(400).json({
        success: false,
        error: 'Event ID and reminder option are required'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if event is in the future
    if (event.date <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot set reminder for past events'
      });
    }

    // Calculate reminder timing based on option
    let reminderTiming;
    const eventDate = new Date(event.date);

    switch (reminderOption) {
      case '1hour':
        reminderTiming = new Date(eventDate.getTime() - 60 * 60 * 1000);
        break;
      case '1day':
        reminderTiming = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1week':
        reminderTiming = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        reminderTiming = new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid reminder option'
        });
    }

    // Check if reminder timing is in the past
    if (reminderTiming <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Reminder time is in the past'
      });
    }

    // Create reminder
    const reminder = await EventReminder.createReminder({
      userId,
      eventId,
      reminderType: reminderType || 'both',
      reminderOption,
      reminderTiming,
      content: {
        subject: `Reminder: ${event.title} is starting soon!`,
        message: `Don't forget! ${event.title} is happening ${reminderOption === '1hour' ? 'in 1 hour' : reminderOption === '1day' ? 'tomorrow' : reminderOption === '1week' ? 'next week' : 'next month'}.`,
        actionText: 'View Event',
        actionUrl: `${process.env.FRONTEND_URL}/events/${eventId}`
      },
      context: {
        source: 'event_detail',
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    // Create notification for the reminder
    await Notification.createNotification({
      userId,
      type: 'event_reminder',
      title: 'Reminder Set',
      message: `You'll be reminded about "${event.title}" ${reminderOption === '1hour' ? '1 hour' : reminderOption === '1day' ? '1 day' : reminderOption === '1week' ? '1 week' : '1 month'} before it starts.`,
      data: { eventId, reminderId: reminder._id },
      priority: 'medium',
      category: 'reminder'
    });

    res.status(201).json({
      success: true,
      data: reminder,
      message: 'Reminder set successfully'
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    if (error.message === 'Reminder already exists for this event') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create reminder'
    });
  }
};

// @desc    Get user reminders
// @route   GET /api/reminders
// @access  Private
const getUserReminders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, status, eventId } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      eventId
    };

    const reminders = await EventReminder.getUserReminders(userId, options);

    res.json({
      success: true,
      data: reminders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminders'
    });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderType, reminderOption, status } = req.body;
    const userId = req.user._id;

    const reminder = await EventReminder.findOne({ _id: id, userId });
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    // Update reminder fields
    if (reminderType) reminder.reminderType = reminderType;
    if (reminderOption) reminder.reminderOption = reminderOption;
    if (status) {
      if (status === 'cancelled') {
        await reminder.cancel();
      } else {
        reminder.status = status;
      }
    }

    await reminder.save();

    res.json({
      success: true,
      data: reminder,
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update reminder'
    });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reminder = await EventReminder.findOneAndDelete({ _id: id, userId });
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete reminder'
    });
  }
};

// @desc    Get reminder details
// @route   GET /api/reminders/:id
// @access  Private
const getReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reminder = await EventReminder.findOne({ _id: id, userId })
      .populate('eventId', 'title date location type')
      .populate('userId', 'name email');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Get reminder error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminder'
    });
  }
};

// @desc    Mark reminder as sent
// @route   PUT /api/reminders/:id/mark-sent
// @access  Private
const markReminderSent = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'both' } = req.body;

    const reminder = await EventReminder.findById(id);
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    await reminder.markAsSent(type);

    res.json({
      success: true,
      message: 'Reminder marked as sent'
    });
  } catch (error) {
    console.error('Mark reminder sent error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark reminder as sent'
    });
  }
};

// @desc    Track reminder interaction
// @route   POST /api/reminders/:id/track
// @access  Private
const trackReminderInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, platform } = req.body;

    const reminder = await EventReminder.findById(id);
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    switch (action) {
      case 'email_opened':
        await reminder.markEmailOpened();
        break;
      case 'email_clicked':
        await reminder.markEmailOpened();
        break;
      case 'push_clicked':
        await reminder.markPushClicked();
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
    console.error('Track reminder interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction'
    });
  }
};

// @desc    Get active reminders for processing (Admin only)
// @route   GET /api/reminders/active
// @access  Private/Admin
const getActiveReminders = async (req, res) => {
  try {
    const reminders = await EventReminder.getActiveReminders();

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error('Get active reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active reminders'
    });
  }
};

// @desc    Get retryable reminders (Admin only)
// @route   GET /api/reminders/retryable
// @access  Private/Admin
const getRetryableReminders = async (req, res) => {
  try {
    const reminders = await EventReminder.getRetryableReminders();

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error('Get retryable reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retryable reminders'
    });
  }
};

// @desc    Cleanup expired reminders (Admin only)
// @route   DELETE /api/reminders/cleanup
// @access  Private/Admin
const cleanupExpiredReminders = async (req, res) => {
  try {
    const result = await EventReminder.cleanupExpiredReminders();

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired reminders`
    });
  } catch (error) {
    console.error('Cleanup expired reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired reminders'
    });
  }
};

// @desc    Get reminder statistics (Admin only)
// @route   GET /api/reminders/stats
// @access  Private/Admin
const getReminderStats = async (req, res) => {
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

    const stats = await EventReminder.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalReminders: { $sum: 1 },
          activeReminders: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          sentReminders: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
          cancelledReminders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          failedReminders: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          emailSent: { $sum: { $cond: [{ $eq: ['$delivery.email.sent', true] }, 1, 0] } },
          emailOpened: { $sum: { $cond: [{ $eq: ['$delivery.email.opened', true] }, 1, 0] } },
          pushSent: { $sum: { $cond: [{ $eq: ['$delivery.push.sent', true] }, 1, 0] } },
          pushClicked: { $sum: { $cond: [{ $eq: ['$delivery.push.clicked', true] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalReminders: 0,
        activeReminders: 0,
        sentReminders: 0,
        cancelledReminders: 0,
        failedReminders: 0,
        emailSent: 0,
        emailOpened: 0,
        pushSent: 0,
        pushClicked: 0
      }
    });
  } catch (error) {
    console.error('Get reminder stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reminder statistics'
    });
  }
};

module.exports = {
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
};
