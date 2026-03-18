const Share = require('../models/Share');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Share event
// @route   POST /api/share
// @access  Private
const shareEvent = async (req, res) => {
  try {
    const { eventId, platform, customMessage, hashtags, mentions } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!eventId || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Event ID and platform are required'
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

    // Create share
    const shareData = {
      eventId,
      sharedBy: userId,
      platform,
      shareData: {
        customMessage: customMessage || `Check out this event: ${event.title}`,
        hashtags: hashtags || [],
        mentions: mentions || []
      },
      context: {
        source: 'event_detail',
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    };

    const share = await Share.createShare(shareData);

    // Update event engagement metrics
    await event.incrementShare();

    // Update user activity
    const user = await User.findById(userId);
    if (user) {
      await user.updateActivity('share', eventId);
    }

    // Create notification for successful share
    await Notification.createNotification({
      userId,
      type: 'community_update',
      title: 'Event Shared',
      message: `You've successfully shared "${event.title}" on ${platform}.`,
      data: { eventId, shareId: share._id, platform },
      priority: 'low',
      category: 'social'
    });

    res.status(201).json({
      success: true,
      data: share,
      message: 'Event shared successfully'
    });
  } catch (error) {
    console.error('Share event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to share event'
    });
  }
};

// @desc    Get user shares
// @route   GET /api/share/user
// @access  Private
const getUserShares = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, platform } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      platform
    };

    const shares = await Share.getUserShares(userId, options);

    res.json({
      success: true,
      data: shares,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user shares error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user shares'
    });
  }
};

// @desc    Get event shares
// @route   GET /api/share/event/:eventId
// @access  Private
const getEventShares = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20, platform, includeAnalytics = false } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      platform,
      includeAnalytics: includeAnalytics === 'true'
    };

    const shares = await Share.getEventShares(eventId, options);

    res.json({
      success: true,
      data: shares,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get event shares error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event shares'
    });
  }
};

// @desc    Track share click
// @route   GET /api/share/track/:shareToken
// @access  Public
const trackShareClick = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const { converted = false } = req.query;

    const clickData = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer,
      converted: converted === 'true'
    };

    const share = await Share.trackClick(shareToken, clickData);

    // Redirect to the actual event page
    res.redirect(`${process.env.FRONTEND_URL}/events/${share.eventId}`);
  } catch (error) {
    console.error('Track share click error:', error);
    // Redirect to home page if share not found
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
};

// @desc    Get share details
// @route   GET /api/share/:id
// @access  Private
const getShare = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const share = await Share.findOne({ _id: id, sharedBy: userId })
      .populate('eventId', 'title date location type')
      .populate('sharedBy', 'name email');

    if (!share) {
      return res.status(404).json({
        success: false,
        error: 'Share not found'
      });
    }

    res.json({
      success: true,
      data: share
    });
  } catch (error) {
    console.error('Get share error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch share'
    });
  }
};

// @desc    Update share analytics
// @route   PUT /api/share/:id/analytics
// @access  Private
const updateShareAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { analytics } = req.body;
    const userId = req.user._id;

    const share = await Share.findOne({ _id: id, sharedBy: userId });
    if (!share) {
      return res.status(404).json({
        success: false,
        error: 'Share not found'
      });
    }

    await share.updateAnalytics(analytics);

    res.json({
      success: true,
      data: share,
      message: 'Analytics updated successfully'
    });
  } catch (error) {
    console.error('Update share analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update analytics'
    });
  }
};

// @desc    Delete share
// @route   DELETE /api/share/:id
// @access  Private
const deleteShare = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const share = await Share.findOneAndDelete({ _id: id, sharedBy: userId });
    if (!share) {
      return res.status(404).json({
        success: false,
        error: 'Share not found'
      });
    }

    // Update event share count
    const event = await Event.findById(share.eventId);
    if (event) {
      event.engagement.shareCount = Math.max(0, event.engagement.shareCount - 1);
      await event.save();
    }

    res.json({
      success: true,
      message: 'Share deleted successfully'
    });
  } catch (error) {
    console.error('Delete share error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete share'
    });
  }
};

// @desc    Get share statistics
// @route   GET /api/share/stats
// @access  Private
const getShareStats = async (req, res) => {
  try {
    const { eventId, timeframe = '30d' } = req.query;

    let stats;
    if (eventId) {
      // Get stats for specific event
      stats = await Share.getShareStats(eventId);
    } else {
      // Get platform stats
      stats = await Share.getPlatformStats({ timeframe });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get share stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get share statistics'
    });
  }
};

// @desc    Get trending shares (Admin only)
// @route   GET /api/share/trending
// @access  Private/Admin
const getTrendingShares = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trendingShares = await Share.getTrendingShares(parseInt(limit));

    res.json({
      success: true,
      data: trendingShares
    });
  } catch (error) {
    console.error('Get trending shares error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending shares'
    });
  }
};

// @desc    Cleanup expired shares (Admin only)
// @route   DELETE /api/share/cleanup
// @access  Private/Admin
const cleanupExpiredShares = async (req, res) => {
  try {
    const result = await Share.cleanupExpiredShares();

    res.json({
      success: true,
      message: `Cleaned up ${result.modifiedCount} expired shares`
    });
  } catch (error) {
    console.error('Cleanup expired shares error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired shares'
    });
  }
};

// @desc    Generate shareable link
// @route   POST /api/share/generate-link
// @access  Private
const generateShareableLink = async (req, res) => {
  try {
    const { eventId, platform = 'copy_link' } = req.body;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Create share
    const shareData = {
      eventId,
      sharedBy: userId,
      platform,
      shareData: {
        customMessage: `Check out this event: ${event.title}`
      },
      context: {
        source: 'event_detail',
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    };

    const share = await Share.createShare(shareData);

    res.json({
      success: true,
      data: {
        shareableLink: share.shareData.shareableLink,
        shareToken: share.tracking.shareToken
      },
      message: 'Shareable link generated successfully'
    });
  } catch (error) {
    console.error('Generate shareable link error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate shareable link'
    });
  }
};

module.exports = {
  shareEvent,
  getUserShares,
  getEventShares,
  trackShareClick,
  getShare,
  updateShareAnalytics,
  deleteShare,
  getShareStats,
  getTrendingShares,
  cleanupExpiredShares,
  generateShareableLink
};
