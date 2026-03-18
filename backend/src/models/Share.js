const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  platform: {
    type: String,
    required: [true, 'Sharing platform is required'],
    enum: ['twitter', 'facebook', 'linkedin', 'whatsapp', 'email', 'copy_link', 'direct'],
    index: true
  },
  // Share details
  shareData: {
    shareableLink: {
      type: String,
      required: true,
      trim: true
    },
    shortUrl: String, // Shortened URL for analytics
    customMessage: {
      type: String,
      maxlength: [280, 'Custom message cannot exceed 280 characters']
    },
    hashtags: [String],
    mentions: [String]
  },
  // Share tracking
  tracking: {
    shareToken: {
      type: String,
      unique: true,
      required: true
    },
    clickCount: { type: Number, default: 0 },
    uniqueClicks: { type: Number, default: 0 },
    conversionCount: { type: Number, default: 0 }, // Users who signed up after clicking
    lastClicked: Date,
    clickHistory: [{
      clickedAt: Date,
      ipAddress: String,
      userAgent: String,
      referrer: String,
      converted: { type: Boolean, default: false }
    }]
  },
  // Share analytics
  analytics: {
    impressions: { type: Number, default: 0 },
    engagement: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      retweets: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },
    demographics: {
      countries: [String],
      cities: [String],
      devices: [String],
      browsers: [String]
    }
  },
  // Share status and metadata
  status: {
    type: String,
    enum: ['active', 'expired', 'disabled'],
    default: 'active',
    index: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiration: 1 year from creation
      return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
  },
  // Share context
  context: {
    source: { 
      type: String, 
      default: 'event_detail',
      enum: ['event_detail', 'dashboard', 'email', 'notification', 'bookmark']
    },
    campaign: String, // Marketing campaign ID
    referrer: String, // How user found the share option
    device: String, // mobile, desktop, tablet
    location: String // User's location when sharing
  },
  // Share metadata
  metadata: {
    version: { type: Number, default: 1 },
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
shareSchema.index({ eventId: 1, sharedBy: 1 });
shareSchema.index({ sharedBy: 1, createdAt: -1 });
shareSchema.index({ platform: 1, createdAt: -1 });
shareSchema.index({ 'tracking.shareToken': 1 }, { unique: true });
shareSchema.index({ status: 1, expiresAt: 1 });
shareSchema.index({ createdAt: -1 });

// Instance methods
shareSchema.methods.incrementClicks = function(clickData = {}) {
  this.tracking.clickCount += 1;
  this.tracking.lastClicked = new Date();
  
  // Add to click history
  this.tracking.clickHistory.push({
    clickedAt: new Date(),
    ipAddress: clickData.ipAddress,
    userAgent: clickData.userAgent,
    referrer: clickData.referrer,
    converted: clickData.converted || false
  });
  
  // Track unique clicks (simple IP-based tracking)
  const uniqueIPs = new Set(this.tracking.clickHistory.map(click => click.ipAddress));
  this.tracking.uniqueClicks = uniqueIPs.size;
  
  // Update conversion count
  if (clickData.converted) {
    this.tracking.conversionCount += 1;
  }
  
  // Keep only last 100 click records to prevent document size issues
  if (this.tracking.clickHistory.length > 100) {
    this.tracking.clickHistory = this.tracking.clickHistory.slice(-100);
  }
  
  return this.save();
};

shareSchema.methods.updateAnalytics = function(analyticsData) {
  if (analyticsData.impressions) {
    this.analytics.impressions += analyticsData.impressions;
  }
  
  if (analyticsData.engagement) {
    Object.keys(analyticsData.engagement).forEach(key => {
      if (this.analytics.engagement[key] !== undefined) {
        this.analytics.engagement[key] += analyticsData.engagement[key];
      }
    });
  }
  
  if (analyticsData.demographics) {
    // Add new demographic data
    Object.keys(analyticsData.demographics).forEach(key => {
      if (this.analytics.demographics[key]) {
        const newData = analyticsData.demographics[key];
        const existingData = this.analytics.demographics[key];
        
        // Merge arrays and keep unique values
        this.analytics.demographics[key] = [...new Set([...existingData, ...newData])];
      }
    });
  }
  
  return this.save();
};

shareSchema.methods.isExpired = function() {
  return this.expiresAt < new Date() || this.status === 'expired';
};

shareSchema.methods.getClickThroughRate = function() {
  if (this.analytics.impressions === 0) return 0;
  return Math.round((this.tracking.clickCount / this.analytics.impressions) * 100);
};

shareSchema.methods.getConversionRate = function() {
  if (this.tracking.clickCount === 0) return 0;
  return Math.round((this.tracking.conversionCount / this.tracking.clickCount) * 100);
};

// Static methods
shareSchema.statics.getEventShares = function(eventId, options = {}) {
  const { 
    platform, 
    page = 1, 
    limit = 20,
    includeAnalytics = false 
  } = options;
  
  const filter = { eventId, status: 'active' };
  
  if (platform) {
    filter.platform = platform;
  }
  
  let query = this.find(filter)
    .populate('sharedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  if (!includeAnalytics) {
    query = query.select('-analytics -tracking.clickHistory');
  }
  
  return query;
};

shareSchema.statics.getUserShares = function(userId, options = {}) {
  const { 
    platform, 
    page = 1, 
    limit = 20 
  } = options;
  
  const filter = { sharedBy: userId };
  
  if (platform) {
    filter.platform = platform;
  }
  
  return this.find(filter)
    .populate('eventId', 'title date location type')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

shareSchema.statics.getShareStats = function(eventId) {
  return this.aggregate([
    { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: null,
        totalShares: { $sum: 1 },
        totalClicks: { $sum: '$tracking.clickCount' },
        totalUniqueClicks: { $sum: '$tracking.uniqueClicks' },
        totalConversions: { $sum: '$tracking.conversionCount' },
        platformStats: {
          $push: {
            platform: '$platform',
            shares: 1,
            clicks: '$tracking.clickCount'
          }
        }
      }
    }
  ]);
};

shareSchema.statics.getPlatformStats = function(options = {}) {
  const { timeframe = '30d' } = options;
  
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
  
  return this.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$platform',
        totalShares: { $sum: 1 },
        totalClicks: { $sum: '$tracking.clickCount' },
        totalUniqueClicks: { $sum: '$tracking.uniqueClicks' },
        totalConversions: { $sum: '$tracking.conversionCount' },
        avgClicksPerShare: { $avg: '$tracking.clickCount' }
      }
    },
    { $sort: { totalShares: -1 } }
  ]);
};

shareSchema.statics.getTrendingShares = function(limit = 10) {
  return this.aggregate([
    {
      $group: {
        _id: '$eventId',
        totalShares: { $sum: 1 },
        totalClicks: { $sum: '$tracking.clickCount' },
        shareScore: { $sum: { $add: [{ $multiply: ['$tracking.clickCount', 2] }, 1] } }
      }
    },
    { $sort: { shareScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: '_id',
        as: 'event'
      }
    },
    { $unwind: '$event' },
    {
      $project: {
        eventId: '$_id',
        eventTitle: '$event.title',
        eventDate: '$event.date',
        eventType: '$event.type',
        totalShares: 1,
        totalClicks: 1,
        shareScore: 1
      }
    }
  ]);
};

shareSchema.statics.createShare = function(shareData) {
  // Generate unique share token
  const shareToken = require('crypto').randomBytes(16).toString('hex');
  
  const share = new this({
    ...shareData,
    'tracking.shareToken': shareToken
  });
  
  return share.save();
};

shareSchema.statics.trackClick = function(shareToken, clickData = {}) {
  return this.findOne({ 'tracking.shareToken': shareToken })
    .then(share => {
      if (!share) {
        throw new Error('Share not found');
      }
      
      if (share.isExpired()) {
        throw new Error('Share has expired');
      }
      
      return share.incrementClicks(clickData);
    });
};

shareSchema.statics.cleanupExpiredShares = function() {
  return this.updateMany(
    { expiresAt: { $lt: new Date() } },
    { status: 'expired' }
  );
};

// Pre-save middleware
shareSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate share token if not provided
    if (!this.tracking.shareToken) {
      this.tracking.shareToken = require('crypto').randomBytes(16).toString('hex');
    }
    
    // Generate shareable link if not provided
    if (!this.shareData.shareableLink) {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      this.shareData.shareableLink = `${baseUrl}/shared-event/${this.tracking.shareToken}`;
    }
  }
  next();
});

module.exports = mongoose.model('Share', shareSchema);
