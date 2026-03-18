const Achievement = require('../models/Achievement');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all achievements
 * @route   GET /api/achievements
 * @access  Public
 */
const getAchievements = asyncHandler(async (req, res) => {
  const { category, rarity, difficulty, activeOnly = true } = req.query;
  
  const filter = {};
  
  if (category) filter.category = category;
  if (rarity) filter.rarity = rarity;
  if (difficulty) filter.difficulty = difficulty;
  if (activeOnly === 'true') filter.isActive = true;
  
  const achievements = await Achievement.find(filter)
    .sort({ displayOrder: 1, points: -1 })
    .populate('prerequisites', 'name icon');
  
  res.json({
    success: true,
    count: achievements.length,
    data: achievements
  });
});

/**
 * @desc    Get user's achievements
 * @route   GET /api/achievements/user
 * @access  Private
 */
const getUserAchievements = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId).populate('achievements');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Get all achievements to show progress
  const allAchievements = await Achievement.find({ isActive: true })
    .sort({ displayOrder: 1, points: -1 });
  
  // Calculate user stats for progress calculation
  const userStats = {
    bookmarkedEvents: user.totalEventsBookmarked,
    attendedEvents: user.totalEventsViewed, // This would be actual attendance in a real app
    sharedEvents: user.totalEventsShared,
    profileCompletion: user.getProfileCompletion(),
    totalPoints: user.points,
    earnedAchievements: user.achievements.map(a => a._id.toString())
  };
  
  // Add progress to each achievement
  const achievementsWithProgress = allAchievements.map(achievement => {
    const userAchievement = user.achievements.find(a => a._id.toString() === achievement._id.toString());
    const progress = achievement.getProgress(userStats);
    const isEarned = !!userAchievement;
    
    return {
      ...achievement.toObject(),
      isEarned,
      progress: isEarned ? 100 : progress,
      earnedAt: userAchievement ? userAchievement.earnedAt : null
    };
  });
  
  res.json({
    success: true,
    data: {
      achievements: achievementsWithProgress,
      userStats: {
        totalPoints: user.points,
        level: user.level,
        earnedCount: user.achievements.length,
        totalCount: allAchievements.length
      }
    }
  });
});

/**
 * @desc    Get leaderboard
 * @route   GET /api/achievements/leaderboard
 * @access  Public
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const { limit = 10, timeframe = 'all' } = req.query;
  
  let dateFilter = {};
  
  if (timeframe !== 'all') {
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = null;
    }
    
    if (startDate) {
      dateFilter = { lastActive: { $gte: startDate } };
    }
  }
  
  const leaderboard = await User.find({
    ...dateFilter,
    role: 'STUDENT' // Only show students on leaderboard
  })
  .select('name email points level achievements totalEventsBookmarked totalEventsShared lastActive')
  .sort({ points: -1, lastActive: -1 })
  .limit(parseInt(limit));
  
  // Add rank to each user
  const rankedLeaderboard = leaderboard.map((user, index) => ({
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
  
  res.json({
    success: true,
    data: {
      leaderboard: rankedLeaderboard,
      timeframe,
      totalUsers: await User.countDocuments({ role: 'STUDENT' })
    }
  });
});

/**
 * @desc    Award achievement to user
 * @route   POST /api/achievements/award
 * @access  Private/Admin
 */
const awardAchievement = asyncHandler(async (req, res) => {
  const { userId, achievementId, reason } = req.body;
  
  if (!userId || !achievementId) {
    return res.status(400).json({
      success: false,
      message: 'User ID and Achievement ID are required'
    });
  }
  
  const user = await User.findById(userId);
  const achievement = await Achievement.findById(achievementId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: 'Achievement not found'
    });
  }
  
  // Check if user already has this achievement
  if (user.hasAchievement(achievementId)) {
    return res.status(400).json({
      success: false,
      message: 'User already has this achievement'
    });
  }
  
  // Award the achievement
  user.achievements.push(achievementId);
  await user.addPoints(achievement.points, `Achievement: ${achievement.name}`);
  
  // Update achievement stats
  await achievement.incrementEarned();
  
  res.json({
    success: true,
    message: 'Achievement awarded successfully',
    data: {
      achievement: {
        id: achievement._id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points
      },
      user: {
        id: user._id,
        name: user.name,
        newPoints: user.points,
        newLevel: user.level
      }
    }
  });
});

/**
 * @desc    Check and award achievements for user action
 * @route   POST /api/achievements/check
 * @access  Private
 */
const checkAchievements = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { action, eventId } = req.body;
  
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Calculate user stats
  const userStats = {
    bookmarkedEvents: user.totalEventsBookmarked,
    attendedEvents: user.totalEventsViewed,
    sharedEvents: user.totalEventsShared,
    profileCompletion: user.getProfileCompletion(),
    totalPoints: user.points,
    earnedAchievements: user.achievements.map(a => a._id.toString())
  };
  
  // Check for new achievements
  const newAchievements = await Achievement.checkAchievements(userId, action, userStats);
  
  const awardedAchievements = [];
  
  for (const achievement of newAchievements) {
    // Award the achievement
    user.achievements.push(achievement._id);
    await user.addPoints(achievement.points, `Achievement: ${achievement.name}`);
    
    // Update achievement stats
    await achievement.incrementEarned();
    
    awardedAchievements.push({
      id: achievement._id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.points,
      rarity: achievement.rarity
    });
  }
  
  await user.save();
  
  res.json({
    success: true,
    data: {
      newAchievements: awardedAchievements,
      totalPoints: user.points,
      level: user.level
    }
  });
});

/**
 * @desc    Get achievement statistics
 * @route   GET /api/achievements/stats
 * @access  Public
 */
const getAchievementStats = asyncHandler(async (req, res) => {
  const stats = await Achievement.aggregate([
    {
      $group: {
        _id: null,
        totalAchievements: { $sum: 1 },
        totalPoints: { $sum: '$points' },
        averagePoints: { $avg: '$points' },
        byCategory: {
          $push: {
            category: '$category',
            points: '$points'
          }
        },
        byRarity: {
          $push: {
            rarity: '$rarity',
            points: '$points'
          }
        }
      }
    }
  ]);
  
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        averagePoints: { $avg: '$points' },
        totalPoints: { $sum: '$points' },
        byLevel: {
          $push: '$level'
        }
      }
    }
  ]);
  
  res.json({
    success: true,
    data: {
      achievements: stats[0] || {},
      users: userStats[0] || {}
    }
  });
});

/**
 * @desc    Create new achievement (Admin only)
 * @route   POST /api/achievements
 * @access  Private/Admin
 */
const createAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.create(req.body);
  
  res.status(201).json({
    success: true,
    data: achievement
  });
});

/**
 * @desc    Update achievement (Admin only)
 * @route   PUT /api/achievements/:id
 * @access  Private/Admin
 */
const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: 'Achievement not found'
    });
  }
  
  res.json({
    success: true,
    data: achievement
  });
});

/**
 * @desc    Delete achievement (Admin only)
 * @route   DELETE /api/achievements/:id
 * @access  Private/Admin
 */
const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);
  
  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: 'Achievement not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Achievement deleted successfully'
  });
});

module.exports = {
  getAchievements,
  getUserAchievements,
  getLeaderboard,
  awardAchievement,
  checkAchievements,
  getAchievementStats,
  createAchievement,
  updateAchievement,
  deleteAchievement
};