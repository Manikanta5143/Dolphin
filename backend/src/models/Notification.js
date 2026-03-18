const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'event_reminder',
      'new_recommendation', 
      'achievement_unlocked',
      'community_update',
      'new_event',
      'event_updated',
      'event_cancelled',
      'friend_activity',
      'system_update',
      'welcome'
    ]
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    type: Object,
    default: {}
    // Additional data like eventId, achievementId, etc.
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['engagement', 'reminder', 'achievement', 'community', 'system'],
    default: 'engagement'
  },
  // Notification delivery tracking
  delivery: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date
    },
    inApp: {
      delivered: { type: Boolean, default: true },
      deliveredAt: { type: Date, default: Date.now },
      clicked: { type: Boolean, default: false },
      clickedAt: Date
    }
  },
  // Notification scheduling
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiration: 30 days from creation
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  // Action tracking
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    trim: true
  },
  actionText: {
    type: String,
    trim: true
  },
  // Metadata
  metadata: {
    source: { type: String, default: 'system' }, // system, user, admin
    campaignId: String, // For grouped notifications
    templateId: String, // For notification templates
    version: { type: Number, default: 1 }
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ 'delivery.inApp.delivered': 1 });

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.delivery.inApp.clicked = true;
  this.delivery.inApp.clickedAt = new Date();
  return this.save();
};

notificationSchema.methods.markEmailSent = function() {
  this.delivery.email.sent = true;
  this.delivery.email.sentAt = new Date();
  return this.save();
};

notificationSchema.methods.markEmailOpened = function() {
  this.delivery.email.opened = true;
  this.delivery.email.openedAt = new Date();
  return this.save();
};

notificationSchema.methods.markPushSent = function() {
  this.delivery.push.sent = true;
  this.delivery.push.sentAt = new Date();
  return this.save();
};

notificationSchema.methods.markPushClicked = function() {
  this.delivery.push.clicked = true;
  this.delivery.push.clickedAt = new Date();
  return this.save();
};

// Static methods
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    userId, 
    isRead: false,
    expiresAt: { $gt: new Date() }
  });
};

notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type,
    category,
    priority
  } = options;

  const filter = { 
    userId,
    expiresAt: { $gt: new Date() }
  };

  if (unreadOnly) {
    filter.isRead = false;
  }
  
  if (type) {
    filter.type = type;
  }
  
  if (category) {
    filter.category = category;
  }
  
  if (priority) {
    filter.priority = priority;
  }

  return this.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { 
      isRead: true,
      'delivery.inApp.clicked': true,
      'delivery.inApp.clickedAt': new Date()
    }
  );
};

notificationSchema.statics.cleanExpiredNotifications = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

notificationSchema.statics.createNotification = function(notificationData) {
  const notification = new this(notificationData);
  return notification.save();
};

// Pre-save middleware to set expiration date based on type
notificationSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set different expiration times based on notification type
    const expirationDays = {
      'event_reminder': 7,      // 7 days
      'new_recommendation': 14, // 14 days
      'achievement_unlocked': 30, // 30 days
      'community_update': 7,    // 7 days
      'new_event': 14,          // 14 days
      'event_updated': 7,       // 7 days
      'event_cancelled': 7,     // 7 days
      'friend_activity': 3,     // 3 days
      'system_update': 60,      // 60 days
      'welcome': 90             // 90 days
    };

    const days = expirationDays[this.type] || 30;
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
