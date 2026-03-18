const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['going', 'maybe', 'not_going'],
    required: [true, 'RSVP status is required'],
    index: true
  },
  // RSVP details
  details: {
    guestCount: {
      type: Number,
      default: 1,
      min: 1,
      max: 10 // Reasonable limit for most events
    },
    dietaryRestrictions: [String],
    accessibilityNeeds: [String],
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  // Registration information
  registration: {
    registrationId: String, // External registration ID if applicable
    registrationUrl: String,
    registrationStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'waitlist'],
      default: 'pending'
    },
    registrationDate: Date,
    confirmationCode: String,
    ticketType: String,
    cost: {
      amount: Number,
      currency: { type: String, default: 'USD' },
      paid: { type: Boolean, default: false },
      paymentMethod: String,
      paymentDate: Date
    }
  },
  // Attendance tracking
  attendance: {
    checkedIn: { type: Boolean, default: false },
    checkedInAt: Date,
    checkedOut: { type: Boolean, default: false },
    checkedOutAt: Date,
    attendanceDuration: Number, // in minutes
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date
    }
  },
  // Communication preferences
  communication: {
    receiveUpdates: { type: Boolean, default: true },
    receiveReminders: { type: Boolean, default: true },
    receiveFollowUp: { type: Boolean, default: true },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'sms', 'push', 'none'],
      default: 'email'
    }
  },
  // Status history for tracking changes
  statusHistory: [{
    status: { type: String, enum: ['going', 'maybe', 'not_going'] },
    changedAt: { type: Date, default: Date.now },
    reason: String,
    changedBy: { type: String, default: 'user' } // user, admin, system
  }],
  // Metadata
  metadata: {
    source: { type: String, default: 'event_detail' }, // event_detail, dashboard, email, etc.
    campaignId: String, // For tracking marketing campaigns
    referrer: String, // How user found the event
    device: String, // mobile, desktop, tablet
    ipAddress: String
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });
rsvpSchema.index({ eventId: 1, status: 1 });
rsvpSchema.index({ userId: 1, status: 1 });
rsvpSchema.index({ 'registration.registrationStatus': 1 });
rsvpSchema.index({ createdAt: -1 });
rsvpSchema.index({ 'attendance.checkedIn': 1 });

// Instance methods
rsvpSchema.methods.updateStatus = function(newStatus, reason = '', changedBy = 'user') {
  // Add to status history
  this.statusHistory.push({
    status: this.status,
    changedAt: new Date(),
    reason: reason || 'Status updated',
    changedBy
  });
  
  // Update current status
  this.status = newStatus;
  
  return this.save();
};

rsvpSchema.methods.checkIn = function() {
  this.attendance.checkedIn = true;
  this.attendance.checkedInAt = new Date();
  return this.save();
};

rsvpSchema.methods.checkOut = function() {
  this.attendance.checkedOut = true;
  this.attendance.checkedOutAt = new Date();
  
  // Calculate attendance duration
  if (this.attendance.checkedInAt) {
    const duration = this.attendance.checkedOutAt - this.attendance.checkedInAt;
    this.attendance.attendanceDuration = Math.round(duration / (1000 * 60)); // Convert to minutes
  }
  
  return this.save();
};

rsvpSchema.methods.submitFeedback = function(rating, comment = '') {
  this.attendance.feedback = {
    rating,
    comment,
    submittedAt: new Date()
  };
  return this.save();
};

rsvpSchema.methods.cancel = function(reason = '') {
  return this.updateStatus('not_going', reason, 'user');
};

rsvpSchema.methods.isAttending = function() {
  return this.status === 'going' && this.attendance.checkedIn;
};

rsvpSchema.methods.hasFeedback = function() {
  return this.attendance.feedback && this.attendance.feedback.rating;
};

// Static methods
rsvpSchema.statics.getEventRSVPs = function(eventId, options = {}) {
  const { 
    status, 
    page = 1, 
    limit = 50,
    includeFeedback = false 
  } = options;
  
  const filter = { eventId };
  
  if (status) {
    filter.status = status;
  }
  
  let query = this.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  if (!includeFeedback) {
    query = query.select('-attendance.feedback');
  }
  
  return query;
};

rsvpSchema.statics.getUserRSVPs = function(userId, options = {}) {
  const { 
    status, 
    page = 1, 
    limit = 20,
    upcoming = false 
  } = options;
  
  const filter = { userId };
  
  if (status) {
    filter.status = status;
  }
  
  let query = this.find(filter)
    .populate('eventId', 'title date location type')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  if (upcoming) {
    query = query.populate({
      path: 'eventId',
      match: { date: { $gte: new Date() } }
    });
  }
  
  return query;
};

rsvpSchema.statics.getRSVPStats = function(eventId) {
  return this.aggregate([
    { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgGuestCount: { $avg: '$details.guestCount' }
      }
    }
  ]);
};

rsvpSchema.statics.getAttendanceStats = function(eventId) {
  return this.aggregate([
    { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: null,
        totalRSVPs: { $sum: 1 },
        totalAttendees: { 
          $sum: { 
            $cond: [{ $eq: ['$attendance.checkedIn', true] }, 1, 0] 
          } 
        },
        avgAttendanceDuration: { 
          $avg: '$attendance.attendanceDuration' 
        },
        avgRating: { 
          $avg: '$attendance.feedback.rating' 
        }
      }
    }
  ]);
};

rsvpSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalRSVPs: { $sum: 1 },
        eventsAttended: { 
          $sum: { 
            $cond: [{ $eq: ['$attendance.checkedIn', true] }, 1, 0] 
          } 
        },
        avgRating: { 
          $avg: '$attendance.feedback.rating' 
        }
      }
    }
  ]);
};

rsvpSchema.statics.createOrUpdateRSVP = function(rsvpData) {
  return this.findOneAndUpdate(
    { userId: rsvpData.userId, eventId: rsvpData.eventId },
    rsvpData,
    { 
      upsert: true, 
      new: true,
      runValidators: true 
    }
  );
};

rsvpSchema.statics.getUpcomingEvents = function(userId, limit = 10) {
  return this.find({ 
    userId, 
    status: 'going' 
  })
  .populate({
    path: 'eventId',
    match: { 
      date: { $gte: new Date() },
      isActive: true 
    }
  })
  .sort({ 'eventId.date': 1 })
  .limit(limit);
};

// Pre-save middleware to add initial status to history
rsvpSchema.pre('save', function(next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      reason: 'Initial RSVP',
      changedBy: 'user'
    });
  }
  next();
});

module.exports = mongoose.model('RSVP', rsvpSchema);
