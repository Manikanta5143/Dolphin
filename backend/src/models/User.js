const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['STUDENT', 'ADMIN'],
    default: 'STUDENT'
  },
  interests: [{ type: String }],
  skills: [{ type: String }],
  projects: [
    {
      title: String,
      description: String,
      domain: String,
      technologies: [String],
      link: String
    }
  ],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  // New fields for Phase 2 features
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    reminderTiming: { type: String, default: '1day', enum: ['1day', '1week', '1month'] },
    newEventNotifications: { type: Boolean, default: true },
    achievementNotifications: { type: Boolean, default: true },
    communityNotifications: { type: Boolean, default: true }
  },
  // Gamification fields
  points: { type: Number, default: 0 },
  level: { 
    type: String, 
    default: 'Beginner',
    enum: ['Beginner', 'Explorer', 'Enthusiast', 'Expert', 'Champion', 'Legend']
  },
  achievements: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Achievement' 
  }],
  // Social and profile fields
  socialLinks: {
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    twitter: { type: String, trim: true }
  },
  // User preferences and behavior tracking
  preferences: {
    eventTypes: [{ type: String, enum: ['HACKATHON', 'CODING_FEST', 'INTERNSHIP', 'WORKSHOP', 'CONFERENCE', 'COMPETITION'] }],
    locations: [{ type: String }],
    timePreferences: [{ type: String, enum: ['morning', 'afternoon', 'evening', 'weekend'] }],
    difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  },
  // Activity tracking
  lastActive: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  totalEventsViewed: { type: Number, default: 0 },
  totalEventsBookmarked: { type: Number, default: 0 },
  totalEventsShared: { type: Number, default: 0 },
  // Profile completion tracking
  profileCompletion: {
    basicInfo: { type: Boolean, default: true },
    interests: { type: Boolean, default: false },
    skills: { type: Boolean, default: false },
    projects: { type: Boolean, default: false },
    socialLinks: { type: Boolean, default: false }
  },
  // Recommendation engine data
  recommendationData: {
    interactionHistory: [{
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      action: { type: String, enum: ['view', 'bookmark', 'share', 'rsvp', 'attend'] },
      timestamp: { type: Date, default: Date.now },
      duration: { type: Number, default: 0 } // Time spent viewing in seconds
    }],
    lastRecommendationUpdate: { type: Date, default: Date.now },
    recommendationScore: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update user activity tracking
userSchema.methods.updateActivity = function(action, eventId = null, duration = 0) {
  this.lastActive = new Date();
  
  // Track specific actions
  switch (action) {
    case 'login':
      this.loginCount += 1;
      break;
    case 'view':
      this.totalEventsViewed += 1;
      break;
    case 'bookmark':
      this.totalEventsBookmarked += 1;
      break;
    case 'share':
      this.totalEventsShared += 1;
      break;
  }
  
  // Add to interaction history
  if (eventId && ['view', 'bookmark', 'share', 'rsvp', 'attend'].includes(action)) {
    this.recommendationData.interactionHistory.push({
      eventId,
      action,
      timestamp: new Date(),
      duration
    });
    
    // Keep only last 100 interactions to prevent document size issues
    if (this.recommendationData.interactionHistory.length > 100) {
      this.recommendationData.interactionHistory = this.recommendationData.interactionHistory.slice(-100);
    }
  }
  
  return this.save();
};

// Calculate user level based on points
userSchema.methods.calculateLevel = function() {
  const points = this.points;
  
  if (points >= 1000) return 'Legend';
  if (points >= 500) return 'Champion';
  if (points >= 250) return 'Expert';
  if (points >= 100) return 'Enthusiast';
  if (points >= 50) return 'Explorer';
  return 'Beginner';
};

// Update user level
userSchema.methods.updateLevel = function() {
  const newLevel = this.calculateLevel();
  if (newLevel !== this.level) {
    this.level = newLevel;
    return this.save();
  }
  return Promise.resolve(this);
};

// Add points to user
userSchema.methods.addPoints = function(points, reason = '') {
  this.points += points;
  return this.updateLevel();
};

// Check if user has achievement
userSchema.methods.hasAchievement = function(achievementId) {
  return this.achievements.includes(achievementId);
};

// Calculate profile completion percentage
userSchema.methods.getProfileCompletion = function() {
  const completion = this.profileCompletion;
  const total = Object.keys(completion).length;
  const completed = Object.values(completion).filter(Boolean).length;
  return Math.round((completed / total) * 100);
};

// Update profile completion status
userSchema.methods.updateProfileCompletion = function() {
  const completion = {
    basicInfo: !!(this.name && this.email),
    interests: this.interests && this.interests.length > 0,
    skills: this.skills && this.skills.length > 0,
    projects: this.projects && this.projects.length > 0,
    socialLinks: !!(this.socialLinks.github || this.socialLinks.linkedin || this.socialLinks.portfolio)
  };
  
  this.profileCompletion = completion;
  return this.save();
};

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'recommendationData.interactionHistory.eventId': 1 });
userSchema.index({ points: -1 });
userSchema.index({ level: 1 });
userSchema.index({ lastActive: -1 });

module.exports = mongoose.model('User', userSchema); 