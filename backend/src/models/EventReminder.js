const mongoose = require('mongoose');

const eventReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true
  },
  reminderType: {
    type: String,
    enum: ['email', 'push', 'both'],
    default: 'both',
    required: true
  },
  reminderTiming: {
    type: Date,
    required: [true, 'Reminder timing is required'],
    index: true
  },
  // Predefined reminder options
  reminderOption: {
    type: String,
    enum: ['1hour', '1day', '1week', '1month', 'custom'],
    default: '1day'
  },
  // Reminder status
  status: {
    type: String,
    enum: ['active', 'sent', 'cancelled', 'failed'],
    default: 'active'
  },
  // Delivery tracking
  delivery: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date,
      error: String
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date,
      error: String
    }
  },
  // Reminder content
  content: {
    subject: String,
    message: String,
    actionText: { type: String, default: 'View Event' },
    actionUrl: String
  },
  // Metadata
  metadata: {
    createdBy: { type: String, default: 'user' }, // user, system, admin
    source: { type: String, default: 'event_detail' }, // event_detail, dashboard, bookmark
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  // Scheduling
  scheduledJobId: String, // For cron job tracking
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  nextRetryAt: Date
}, {
  timestamps: true
});

// Compound indexes for better performance
eventReminderSchema.index({ userId: 1, eventId: 1 }, { unique: true });
eventReminderSchema.index({ userId: 1, status: 1 });
eventReminderSchema.index({ eventId: 1, status: 1 });
eventReminderSchema.index({ reminderTiming: 1, status: 1 });
eventReminderSchema.index({ status: 1, reminderTiming: 1 });

// Instance methods
eventReminderSchema.methods.markAsSent = function(type = 'both') {
  const now = new Date();
  
  if (type === 'email' || type === 'both') {
    this.delivery.email.sent = true;
    this.delivery.email.sentAt = now;
  }
  
  if (type === 'push' || type === 'both') {
    this.delivery.push.sent = true;
    this.delivery.push.sentAt = now;
  }
  
  // Mark as sent if both delivery methods are sent
  if (this.delivery.email.sent && this.delivery.push.sent) {
    this.status = 'sent';
  }
  
  return this.save();
};

eventReminderSchema.methods.markEmailDelivered = function() {
  this.delivery.email.delivered = true;
  this.delivery.email.deliveredAt = new Date();
  return this.save();
};

eventReminderSchema.methods.markEmailOpened = function() {
  this.delivery.email.opened = true;
  this.delivery.email.openedAt = new Date();
  return this.save();
};

eventReminderSchema.methods.markPushDelivered = function() {
  this.delivery.push.delivered = true;
  this.delivery.push.deliveredAt = new Date();
  return this.save();
};

eventReminderSchema.methods.markPushClicked = function() {
  this.delivery.push.clicked = true;
  this.delivery.push.clickedAt = new Date();
  return this.save();
};

eventReminderSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

eventReminderSchema.methods.fail = function(error, type = 'both') {
  this.retryCount += 1;
  
  if (type === 'email' || type === 'both') {
    this.delivery.email.error = error;
  }
  
  if (type === 'push' || type === 'both') {
    this.delivery.push.error = error;
  }
  
  // Set next retry time (exponential backoff)
  if (this.retryCount < this.maxRetries) {
    const retryDelay = Math.pow(2, this.retryCount) * 60 * 1000; // 2, 4, 8 minutes
    this.nextRetryAt = new Date(Date.now() + retryDelay);
  } else {
    this.status = 'failed';
  }
  
  return this.save();
};

eventReminderSchema.methods.isOverdue = function() {
  return this.reminderTiming < new Date() && this.status === 'active';
};

eventReminderSchema.methods.canRetry = function() {
  return this.retryCount < this.maxRetries && this.status !== 'failed';
};

// Static methods
eventReminderSchema.statics.getActiveReminders = function() {
  return this.find({ 
    status: 'active',
    reminderTiming: { $lte: new Date() }
  }).populate('userId eventId');
};

eventReminderSchema.statics.getRetryableReminders = function() {
  return this.find({
    status: 'active',
    retryCount: { $lt: 3 },
    $or: [
      { nextRetryAt: { $lte: new Date() } },
      { nextRetryAt: { $exists: false } }
    ]
  }).populate('userId eventId');
};

eventReminderSchema.statics.getUserReminders = function(userId, options = {}) {
  const { page = 1, limit = 20, status, eventId } = options;
  
  const filter = { userId };
  
  if (status) {
    filter.status = status;
  }
  
  if (eventId) {
    filter.eventId = eventId;
  }
  
  return this.find(filter)
    .populate('eventId', 'title date location type')
    .sort({ reminderTiming: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

eventReminderSchema.statics.createReminder = function(reminderData) {
  // Check if reminder already exists
  return this.findOne({
    userId: reminderData.userId,
    eventId: reminderData.eventId
  }).then(existingReminder => {
    if (existingReminder) {
      throw new Error('Reminder already exists for this event');
    }
    
    return this.create(reminderData);
  });
};

eventReminderSchema.statics.cleanupExpiredReminders = function() {
  // Delete reminders older than 30 days that are sent or failed
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return this.deleteMany({
    createdAt: { $lt: thirtyDaysAgo },
    status: { $in: ['sent', 'failed', 'cancelled'] }
  });
};

// Pre-save middleware to calculate reminder timing
eventReminderSchema.pre('save', function(next) {
  if (this.isNew && this.eventId) {
    // This will be populated with actual event date
    // The reminder timing should be set based on the event date and reminder option
    // This will be handled in the service layer
  }
  next();
});

// Pre-save middleware to generate content if not provided
eventReminderSchema.pre('save', function(next) {
  if (this.isNew && !this.content.subject) {
    // Default content will be generated based on event data
    // This will be handled in the service layer when event is populated
  }
  next();
});

module.exports = mongoose.model('EventReminder', eventReminderSchema);
