const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Achievement name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required'],
    default: '🏆'
  },
  category: {
    type: String,
    required: [true, 'Achievement category is required'],
    enum: ['engagement', 'discovery', 'community', 'learning', 'social', 'milestone'],
    index: true
  },
  // Points and rewards
  points: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  // Achievement requirements
  requirements: {
    type: Object,
    required: [true, 'Achievement requirements are required']
    // Example structure:
    // {
    //   action: 'bookmark_events',
    //   count: 10,
    //   timeframe: 'all_time', // all_time, daily, weekly, monthly
    //   conditions: {
    //     eventTypes: ['HACKATHON', 'WORKSHOP'],
    //     minDuration: 30 // in days
    //   }
    // }
  },
  // Achievement metadata
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'easy',
    index: true
  },
  // Achievement status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  // Achievement visibility and display
  displayOrder: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  // Achievement statistics
  stats: {
    totalEarned: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }, // percentage
    averageTimeToEarn: { type: Number, default: 0 }, // in days
    lastEarned: Date
  },
  // Achievement prerequisites
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  // Achievement rewards (future feature)
  rewards: {
    badge: String,
    title: String,
    specialAccess: [String],
    discountCode: String,
    customMessage: String
  },
  // Achievement metadata
  metadata: {
    version: { type: Number, default: 1 },
    createdBy: { type: String, default: 'system' }, // system, admin
    tags: [String],
    relatedEventTypes: [String],
    estimatedTimeToComplete: Number, // in days
    tips: [String]
  }
}, {
  timestamps: true
});

// Indexes for better performance
achievementSchema.index({ category: 1, isActive: 1 });
achievementSchema.index({ rarity: 1, isActive: 1 });
achievementSchema.index({ difficulty: 1, isActive: 1 });
achievementSchema.index({ points: -1 });
achievementSchema.index({ 'stats.totalEarned': -1 });
achievementSchema.index({ displayOrder: 1 });

// Instance methods
achievementSchema.methods.incrementEarned = function() {
  this.stats.totalEarned += 1;
  this.stats.lastEarned = new Date();
  this.updateSuccessRate();
  return this.save();
};

achievementSchema.methods.incrementAttempts = function() {
  this.stats.totalAttempts += 1;
  this.updateSuccessRate();
  return this.save();
};

achievementSchema.methods.updateSuccessRate = function() {
  if (this.stats.totalAttempts > 0) {
    this.stats.successRate = Math.round((this.stats.totalEarned / this.stats.totalAttempts) * 100);
  }
};

achievementSchema.methods.canBeEarned = function() {
  return this.isActive && !this.isSecret;
};

achievementSchema.methods.getProgress = function(userStats) {
  if (!this.showProgress) {
    return null;
  }
  
  const requirements = this.requirements;
  let progress = 0;
  
  switch (requirements.action) {
    case 'bookmark_events':
      progress = Math.min((userStats.bookmarkedEvents || 0) / requirements.count * 100, 100);
      break;
    case 'attend_events':
      progress = Math.min((userStats.attendedEvents || 0) / requirements.count * 100, 100);
      break;
    case 'share_events':
      progress = Math.min((userStats.sharedEvents || 0) / requirements.count * 100, 100);
      break;
    case 'complete_profile':
      progress = userStats.profileCompletion || 0;
      break;
    case 'login_streak':
      progress = Math.min((userStats.loginStreak || 0) / requirements.count * 100, 100);
      break;
    default:
      progress = 0;
  }
  
  return Math.round(progress);
};

// Static methods
achievementSchema.statics.getByCategory = function(category, options = {}) {
  const { includeSecret = false, activeOnly = true } = options;
  
  const filter = { category };
  
  if (activeOnly) {
    filter.isActive = true;
  }
  
  if (!includeSecret) {
    filter.isSecret = false;
  }
  
  return this.find(filter)
    .sort({ displayOrder: 1, points: 1 })
    .populate('prerequisites', 'name icon');
};

achievementSchema.statics.getAvailableAchievements = function(userId, userStats) {
  return this.find({ 
    isActive: true,
    isSecret: false 
  }).then(achievements => {
    return achievements.filter(achievement => {
      // Check if user already has this achievement
      if (userStats.earnedAchievements && userStats.earnedAchievements.includes(achievement._id)) {
        return false;
      }
      
      // Check prerequisites
      if (achievement.prerequisites.length > 0) {
        const hasPrerequisites = achievement.prerequisites.every(prereq => 
          userStats.earnedAchievements && userStats.earnedAchievements.includes(prereq._id)
        );
        if (!hasPrerequisites) {
          return false;
        }
      }
      
      return true;
    });
  });
};

achievementSchema.statics.checkAchievements = function(userId, action, userStats) {
  return this.getAvailableAchievements(userId, userStats).then(achievements => {
    const earnedAchievements = [];
    
    achievements.forEach(achievement => {
      if (this.checkAchievementRequirements(achievement, action, userStats)) {
        earnedAchievements.push(achievement);
      }
    });
    
    return earnedAchievements;
  });
};

achievementSchema.statics.checkAchievementRequirements = function(achievement, action, userStats) {
  const requirements = achievement.requirements;
  
  if (requirements.action !== action) {
    return false;
  }
  
  switch (action) {
    case 'bookmark_events':
      return (userStats.bookmarkedEvents || 0) >= requirements.count;
    
    case 'attend_events':
      return (userStats.attendedEvents || 0) >= requirements.count;
    
    case 'share_events':
      return (userStats.sharedEvents || 0) >= requirements.count;
    
    case 'complete_profile':
      return (userStats.profileCompletion || 0) >= requirements.percentage;
    
    case 'login_streak':
      return (userStats.loginStreak || 0) >= requirements.count;
    
    case 'view_events':
      return (userStats.viewedEvents || 0) >= requirements.count;
    
    case 'earn_points':
      return (userStats.totalPoints || 0) >= requirements.count;
    
    default:
      return false;
  }
};

achievementSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'stats.totalEarned': -1 })
    .limit(limit);
};

achievementSchema.statics.getRareAchievements = function() {
  return this.find({ 
    rarity: { $in: ['rare', 'epic', 'legendary'] },
    isActive: true 
  }).sort({ rarity: 1, points: -1 });
};

achievementSchema.statics.createDefaultAchievements = function() {
  const defaultAchievements = [
    {
      name: 'First Steps',
      description: 'Bookmark your first event',
      icon: '🎯',
      category: 'engagement',
      points: 10,
      rarity: 'common',
      requirements: { action: 'bookmark_events', count: 1 },
      displayOrder: 1
    },
    {
      name: 'Event Explorer',
      description: 'Bookmark 10 events',
      icon: '🗺️',
      category: 'discovery',
      points: 25,
      rarity: 'uncommon',
      requirements: { action: 'bookmark_events', count: 10 },
      displayOrder: 2
    },
    {
      name: 'Social Butterfly',
      description: 'Share 5 events',
      icon: '🦋',
      category: 'social',
      points: 30,
      rarity: 'uncommon',
      requirements: { action: 'share_events', count: 5 },
      displayOrder: 3
    },
    {
      name: 'Profile Master',
      description: 'Complete your profile 100%',
      icon: '⭐',
      category: 'engagement',
      points: 50,
      rarity: 'rare',
      requirements: { action: 'complete_profile', percentage: 100 },
      displayOrder: 4
    },
    {
      name: 'Event Attendee',
      description: 'Attend your first event',
      icon: '🎉',
      category: 'community',
      points: 75,
      rarity: 'uncommon',
      requirements: { action: 'attend_events', count: 1 },
      displayOrder: 5
    }
  ];
  
  return this.insertMany(defaultAchievements, { ordered: false });
};

// Pre-save middleware
achievementSchema.pre('save', function(next) {
  // Ensure requirements object has required fields
  if (!this.requirements.action || !this.requirements.count) {
    return next(new Error('Achievement requirements must include action and count'));
  }
  
  // Set default display order if not provided
  if (this.displayOrder === 0 && this.isNew) {
    this.displayOrder = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Achievement', achievementSchema);
