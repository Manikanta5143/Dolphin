const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  organizer: {
    type: String,
    trim: true,
    maxlength: [100, 'Organizer cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please provide an event type'],
    enum: [
      'HACKATHON', 
      'CODING_FEST', 
      'INTERNSHIP', 
      'WORKSHOP', 
      'CONFERENCE', 
      'COMPETITION',
      'MEETUP',
      'WEBINAR',
      'BOOTCAMP',
      'SCHOLARSHIP',
      'JOB_FAIR',
      'NETWORKING',
      'TECH_TALK',
      'STARTUP_PITCH',
      'RESEARCH_OPPORTUNITY',
      'VOLUNTEER',
      'MENTORSHIP',
      'CAREER_FAIR',
      'ALUMNI_EVENT',
      'STUDY_GROUP'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  link: {
    type: String,
    trim: true,
    maxlength: [500, 'Link cannot be more than 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  eligibility: {
    type: String,
    maxlength: [500, 'Eligibility cannot be more than 500 characters']
  },
  deadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // New fields for Phase 2 features
  // Event engagement tracking
  engagement: {
    viewCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    rsvpCount: { type: Number, default: 0 },
    attendanceCount: { type: Number, default: 0 },
    lastViewed: Date,
    trendingScore: { type: Number, default: 0 }
  },
  // Event details enhancement
  details: {
    duration: Number, // in hours
    maxParticipants: Number,
    cost: {
      amount: Number,
      currency: { type: String, default: 'USD' },
      isFree: { type: Boolean, default: true }
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    requirements: [String],
    benefits: [String],
    prizes: [String],
    speakers: [{
      name: String,
      title: String,
      company: String,
      bio: String,
      image: String
    }],
    sponsors: [{
      name: String,
      logo: String,
      website: String
    }]
  },
  // Event media
  media: {
    images: [String], // URLs to event images
    videos: [String], // URLs to event videos
    documents: [String] // URLs to event documents
  },
  // Event status and workflow
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed', 'postponed'],
    default: 'published',
    index: true
  },
  // Event source and submission
  source: {
    type: String,
    enum: ['admin', 'user_submitted', 'api', 'import'],
    default: 'admin'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  // Event analytics
  analytics: {
    uniqueViewers: { type: Number, default: 0 },
    averageViewDuration: { type: Number, default: 0 }, // in seconds
    bounceRate: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    demographics: {
      countries: [String],
      cities: [String],
      ageGroups: [String],
      skillLevels: [String]
    }
  },
  // Event notifications and reminders
  notifications: {
    reminderSent: { type: Boolean, default: false },
    reminderSentAt: Date,
    followUpSent: { type: Boolean, default: false },
    followUpSentAt: Date
  },
  // Event feedback and ratings
  feedback: {
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    ratings: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  // Event metadata
  metadata: {
    version: { type: Number, default: 1 },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modificationHistory: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      changedAt: { type: Date, default: Date.now }
    }],
    tags: [String], // Additional metadata tags
    keywords: [String] // SEO keywords
  }
}, {
  timestamps: true
});

// Create index for search functionality
eventSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  tags: 'text'
});

// Additional indexes for better performance
eventSchema.index({ type: 1, date: 1 });
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ status: 1, isActive: 1 });
eventSchema.index({ 'engagement.trendingScore': -1 });
eventSchema.index({ 'feedback.averageRating': -1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ submittedBy: 1 });
eventSchema.index({ tags: 1 });

// Instance methods
eventSchema.methods.incrementView = function() {
  this.engagement.viewCount += 1;
  this.engagement.lastViewed = new Date();
  this.updateTrendingScore();
  return this.save();
};

eventSchema.methods.incrementBookmark = function() {
  this.engagement.bookmarkCount += 1;
  this.updateTrendingScore();
  return this.save();
};

eventSchema.methods.decrementBookmark = function() {
  this.engagement.bookmarkCount = Math.max(0, this.engagement.bookmarkCount - 1);
  this.updateTrendingScore();
  return this.save();
};

eventSchema.methods.incrementShare = function() {
  this.engagement.shareCount += 1;
  this.updateTrendingScore();
  return this.save();
};

eventSchema.methods.incrementRSVP = function() {
  this.engagement.rsvpCount += 1;
  this.updateTrendingScore();
  return this.save();
};

eventSchema.methods.incrementAttendance = function() {
  this.engagement.attendanceCount += 1;
  this.updateTrendingScore();
  return this.save();
};

eventSchema.methods.updateTrendingScore = function() {
  // Calculate trending score based on recent activity
  const engagement = this.engagement;
  let weights = {
    view: 1,
    bookmark: 3,
    share: 5,
    rsvp: 4,
    attendance: 6
  };
  
  let baseScore = 
    (engagement.viewCount * weights.view) +
    (engagement.bookmarkCount * weights.bookmark) +
    (engagement.shareCount * weights.share) +
    (engagement.rsvpCount * weights.rsvp) +
    (engagement.attendanceCount * weights.attendance);

  // Boost for top companies
  const topCompanies = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'tesla'];
  const hasTopCompany = this.tags?.some(t => topCompanies.includes(t.toLowerCase())) 
                     || (this.organizer && topCompanies.some(c => this.organizer.toLowerCase().includes(c)));
                     
  if (hasTopCompany) {
    baseScore *= 1.5; // 50% boost for top companies to prioritize them
  }

  this.engagement.trendingScore = baseScore;
  return this;
};

eventSchema.methods.addRating = function(userId, rating, comment = '') {
  // Check if user already rated
  const existingRating = this.feedback.ratings.find(r => r.userId.toString() === userId.toString());
  
  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
    existingRating.comment = comment;
    existingRating.createdAt = new Date();
  } else {
    // Add new rating
    this.feedback.ratings.push({
      userId,
      rating,
      comment,
      createdAt: new Date()
    });
    this.feedback.totalRatings += 1;
  }
  
  // Recalculate average rating
  const totalRating = this.feedback.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.feedback.averageRating = Math.round((totalRating / this.feedback.ratings.length) * 10) / 10;
  
  return this.save();
};

eventSchema.methods.isUpcoming = function() {
  return this.date > new Date() && this.status === 'published';
};

eventSchema.methods.isPast = function() {
  return this.date < new Date();
};

eventSchema.methods.isToday = function() {
  const today = new Date();
  const eventDate = new Date(this.date);
  return eventDate.toDateString() === today.toDateString();
};

eventSchema.methods.getDaysUntil = function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

eventSchema.methods.addModificationHistory = function(field, oldValue, newValue, changedBy) {
  this.metadata.modificationHistory.push({
    field,
    oldValue,
    newValue,
    changedBy,
    changedAt: new Date()
  });
  
  // Keep only last 50 modifications
  if (this.metadata.modificationHistory.length > 50) {
    this.metadata.modificationHistory = this.metadata.modificationHistory.slice(-50);
  }
  
  this.metadata.lastModifiedBy = changedBy;
  this.metadata.version += 1;
  
  return this.save();
};

// Static methods
eventSchema.statics.getTrendingEvents = function(limit = 10) {
  return this.find({ 
    isActive: true, 
    status: 'published',
    date: { $gte: new Date() }
  })
  .sort({ 'engagement.trendingScore': -1 })
  .limit(limit);
};

eventSchema.statics.getUpcomingEvents = function(limit = 20) {
  return this.find({ 
    isActive: true, 
    status: 'published',
    date: { $gte: new Date() }
  })
  .sort({ date: 1 })
  .limit(limit);
};

eventSchema.statics.getEventsByType = function(type, options = {}) {
  const { page = 1, limit = 20, upcoming = true } = options;
  
  const filter = { type, isActive: true, status: 'published' };
  
  if (upcoming) {
    filter.date = { $gte: new Date() };
  }
  
  return this.find(filter)
    .sort({ date: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

eventSchema.statics.getEventStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        activeEvents: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        upcomingEvents: { 
          $sum: { 
            $cond: [
              { $and: [{ $eq: ['$isActive', true] }, { $gte: ['$date', new Date()] }] }, 
              1, 
              0
            ] 
          } 
        },
        totalViews: { $sum: '$engagement.viewCount' },
        totalBookmarks: { $sum: '$engagement.bookmarkCount' },
        totalShares: { $sum: '$engagement.shareCount' },
        avgRating: { $avg: '$feedback.averageRating' }
      }
    }
  ]);
};

eventSchema.statics.searchEvents = function(query, options = {}) {
  const { page = 1, limit = 20, type, location, upcoming = true } = options;
  
  const filter = { 
    isActive: true, 
    status: 'published',
    $text: { $search: query }
  };
  
  if (type) {
    filter.type = type;
  }
  
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  
  if (upcoming) {
    filter.date = { $gte: new Date() };
  }
  
  return this.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

// Pre-save middleware
eventSchema.pre('save', function(next) {
  // Update trending score before saving
  this.updateTrendingScore();
  
  // Set default values for new events
  if (this.isNew) {
    if (!this.engagement) {
      this.engagement = {
        viewCount: 0,
        bookmarkCount: 0,
        shareCount: 0,
        rsvpCount: 0,
        attendanceCount: 0,
        trendingScore: 0
      };
    }
    
    if (!this.feedback) {
      this.feedback = {
        averageRating: 0,
        totalRatings: 0,
        ratings: []
      };
    }
  }
  
  next();
});

module.exports = mongoose.model('Event', eventSchema); 