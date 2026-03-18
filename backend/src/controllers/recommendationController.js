const recommendationService = require('../services/recommendationService');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get personalized recommendations for a user
 * @route   GET /api/recommendations
 * @access  Private
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 10, excludeBookmarked = true } = req.query;

  const recommendations = await recommendationService.getRecommendations(userId, {
    limit: parseInt(limit),
    excludeBookmarked: excludeBookmarked === 'true'
  });

  res.json({
    success: true,
    count: recommendations.length,
    data: recommendations
  });
});

/**
 * @desc    Get recommendation explanation for a specific event
 * @route   GET /api/recommendations/explain/:eventId
 * @access  Private
 */
const getRecommendationExplanation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  const explanation = await recommendationService.getRecommendationExplanation(userId, eventId);

  res.json({
    success: true,
    data: explanation
  });
});

/**
 * @desc    Record user feedback on recommendations
 * @route   POST /api/recommendations/feedback
 * @access  Private
 */
const recordFeedback = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { eventId, feedback } = req.body;

  if (!eventId || !feedback) {
    return res.status(400).json({
      success: false,
      message: 'Event ID and feedback are required'
    });
  }

  if (!['interested', 'not_interested'].includes(feedback)) {
    return res.status(400).json({
      success: false,
      message: 'Feedback must be either "interested" or "not_interested"'
    });
  }

  await recommendationService.recordFeedback(userId, eventId, feedback);

  res.json({
    success: true,
    message: 'Feedback recorded successfully'
  });
});

/**
 * @desc    Update recommendation weights (admin only)
 * @route   PUT /api/recommendations/weights
 * @access  Private/Admin
 */
const updateWeights = asyncHandler(async (req, res) => {
  const { weights } = req.body;

  if (!weights || typeof weights !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Weights object is required'
    });
  }

  recommendationService.updateWeights(weights);

  res.json({
    success: true,
    message: 'Recommendation weights updated successfully',
    weights: recommendationService.weights
  });
});

/**
 * @desc    Clear recommendation cache (admin only)
 * @route   DELETE /api/recommendations/cache
 * @access  Private/Admin
 */
const clearCache = asyncHandler(async (req, res) => {
  recommendationService.clearCache();

  res.json({
    success: true,
    message: 'Recommendation cache cleared successfully'
  });
});

/**
 * @desc    Get cache statistics (admin only)
 * @route   GET /api/recommendations/cache/stats
 * @access  Private/Admin
 */
const getCacheStats = asyncHandler(async (req, res) => {
  const stats = recommendationService.getCacheStats();

  res.json({
    success: true,
    data: stats
  });
});

module.exports = {
  getRecommendations,
  getRecommendationExplanation,
  recordFeedback,
  updateWeights,
  clearCache,
  getCacheStats
};
