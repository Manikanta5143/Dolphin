const User = require('../models/User');
const Event = require('../models/Event');
const Achievement = require('../models/Achievement');
const asyncHandler = require('express-async-handler');
/**
 * @desc    Get personalized dashboard data
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId).populate('bookmarks');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's bookmarked events (upcoming)
    const bookmarkedEvents = await Event.find({
      _id: { $in: user.bookmarks },
      isActive: true,
      status: 'published',
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(6);

    // Get personalized recommendations
    const recommendations = await getRecommendations(userId, { limit: 6 });
    
    // Get trending events
    const trendingEvents = await Event.getTrendingEvents(6);
    
    // Get upcoming events
    const upcomingEvents = await Event.getUpcomingEvents(6);
    
    // Get user's recent achievements
    const recentAchievements = await Achievement.find({
      _id: { $in: user.achievements }
    })
    .sort({ createdAt: -1 })
    .limit(3);

    // Get upcoming reminders (mock data - in real app, this would come from reminders service)
    const upcomingReminders = await getUpcomingReminders(userId);

    // Get user stats
    const userStats = {
      totalPoints: user.points,
      level: user.level,
      achievementCount: user.achievements.length,
      bookmarkedEvents: user.totalEventsBookmarked,
      sharedEvents: user.totalEventsShared,
      viewedEvents: user.totalEventsViewed,
      profileCompletion: user.getProfileCompletion()
    };

    // Get leaderboard data (top 5)
    const leaderboard = await getLeaderboardData(5);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          points: user.points,
          profileCompletion: user.getProfileCompletion()
        },
        bookmarks: bookmarkedEvents,
        recommendations: recommendations.data || [],
        trending: trendingEvents,
        upcoming: upcomingEvents,
        achievements: recentAchievements,
        reminders: upcomingReminders,
        stats: userStats,
        leaderboard
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

/**
 * @desc    Get dashboard widgets data
 * @route   GET /api/dashboard/widgets
 * @access  Private
 */
const getDashboardWidgets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { widgets = [] } = req.query;
  
  const results = {};
  
  try {
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Process requested widgets
    for (const widget of widgets) {
      switch (widget) {
        case 'stats':
          results.stats = {
            totalPoints: user.points,
            level: user.level,
            achievementCount: user.achievements.length,
            bookmarkedEvents: user.totalEventsBookmarked,
            sharedEvents: user.totalEventsShared,
            viewedEvents: user.totalEventsViewed,
            profileCompletion: user.getProfileCompletion()
          };
          break;
          
        case 'bookmarks':
          const bookmarkedEvents = await Event.find({
            _id: { $in: user.bookmarks },
            isActive: true,
            status: 'published',
            date: { $gte: new Date() }
          })
          .sort({ date: 1 })
          .limit(6);
          results.bookmarks = bookmarkedEvents;
          break;
          
        case 'recommendations':
          const recommendations = await getRecommendations(userId, { limit: 6 });
          results.recommendations = recommendations.data || [];
          break;
          
        case 'trending':
          const trendingEvents = await Event.getTrendingEvents(6);
          results.trending = trendingEvents;
          break;
          
        case 'achievements':
          const recentAchievements = await Achievement.find({
            _id: { $in: user.achievements }
          })
          .sort({ createdAt: -1 })
          .limit(3);
          results.achievements = recentAchievements;
          break;
          
        case 'leaderboard':
          const leaderboard = await getLeaderboardData(5);
          results.leaderboard = leaderboard;
          break;
      }
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Dashboard widgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard widgets'
    });
  }
});

// Helper functions
async function getRecommendations(userId, options = {}) {
  try {
    // This would use the recommendation service
    // For now, return mock data
    const events = await Event.find({
      isActive: true,
      status: 'published',
      date: { $gte: new Date() }
    })
    .sort({ 'engagement.trendingScore': -1 })
    .limit(options.limit || 6);
    
    return {
      data: events.map(event => ({
        event,
        score: Math.random(),
        reasons: ['Matches your interests', 'Similar to bookmarked events'],
        breakdown: {
          tagMatch: 0.4,
          bookmarkSimilarity: 0.3,
          recency: 0.2,
          trending: 0.1
        }
      }))
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { data: [] };
  }
}

async function getUpcomingReminders(userId) {
  // Mock data - in real app, this would come from reminders service
  return [
    {
      id: '1',
      eventId: 'event1',
      eventTitle: 'Tech Conference 2024',
      reminderTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      type: 'event_reminder'
    },
    {
      id: '2',
      eventId: 'event2',
      eventTitle: 'Hackathon Registration',
      reminderTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      type: 'deadline_reminder'
    }
  ];
}

async function getLeaderboardData(limit = 5) {
  try {
    const leaderboard = await User.find({
      role: 'STUDENT'
    })
    .select('name email points level achievements totalEventsBookmarked totalEventsShared lastActive')
    .sort({ points: -1, lastActive: -1 })
    .limit(limit);
    
    return leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      email: user.email,
      points: user.points,
      level: user.level,
      achievementCount: user.achievements.length,
      bookmarkedEvents: user.totalEventsBookmarked,
      sharedEvents: user.totalEventsShared,
      lastActive: user.lastActive
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

module.exports = {
  getDashboard,
  getDashboardWidgets
};
