const Event = require('../models/Event');
const User = require('../models/User');

class RecommendationService {
  constructor() {
    // Configurable scoring weights
    this.weights = {
      tagMatch: 0.4,
      bookmarkSimilarity: 0.3,
      recency: 0.2,
      trending: 0.1
    };
    
    // Cache for recommendations (in production, use Redis)
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Get personalized recommendations for a user
   * @param {string} userId - User ID
   * @param {Object} options - Options for recommendations
   * @returns {Promise<Array>} Array of recommended events with scores and reasons
   */
  async getRecommendations(userId, options = {}) {
    const { limit = 10, excludeBookmarked = true } = options;
    
    // Check cache first
    const cacheKey = `recommendations_${userId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data.slice(0, limit);
    }

    try {
      const user = await User.findById(userId).populate('bookmarks');
      if (!user) {
        throw new Error('User not found');
      }

      // Get all active events
      const events = await Event.find({
        isActive: true,
        status: 'published',
        date: { $gte: new Date() }
      });

      // Score events
      const scoredEvents = await this.scoreEvents(events, user);
      
      // Sort by score and apply filters
      let recommendations = scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit * 2); // Get more than needed for filtering

      // Exclude bookmarked events if requested
      if (excludeBookmarked) {
        const bookmarkedIds = user.bookmarks.map(b => b._id.toString());
        recommendations = recommendations.filter(
          rec => !bookmarkedIds.includes(rec.event._id.toString())
        );
      }

      // Limit results
      recommendations = recommendations.slice(0, limit);

      // Cache results
      this.cache.set(cacheKey, {
        data: recommendations,
        timestamp: Date.now()
      });

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  /**
   * Score events based on user preferences and behavior
   * @param {Array} events - Array of events to score
   * @param {Object} user - User object with preferences and history
   * @returns {Promise<Array>} Array of events with scores and reasons
   */
  async scoreEvents(events, user) {
    const scoredEvents = [];

    for (const event of events) {
      const score = await this.calculateEventScore(event, user);
      if (score.total > 0) {
        scoredEvents.push({
          event,
          score: score.total,
          reasons: score.reasons,
          breakdown: score.breakdown
        });
      }
    }

    return scoredEvents;
  }

  /**
   * Calculate score for a single event
   * @param {Object} event - Event object
   * @param {Object} user - User object
   * @returns {Promise<Object>} Score breakdown
   */
  async calculateEventScore(event, user) {
    const breakdown = {
      tagMatch: 0,
      bookmarkSimilarity: 0,
      recency: 0,
      trending: 0
    };

    const reasons = [];

    // 1. Tag matching score
    if (user.interests && user.interests.length > 0 && event.tags && event.tags.length > 0) {
      const matchingTags = event.tags.filter(tag => 
        user.interests.some(interest => 
          interest.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(interest.toLowerCase())
        )
      );
      
      if (matchingTags.length > 0) {
        breakdown.tagMatch = (matchingTags.length / event.tags.length) * this.weights.tagMatch;
        reasons.push(`Matches your interests: ${matchingTags.join(', ')}`);
      }
    }

    // 2. Bookmark similarity score
    if (user.bookmarks && user.bookmarks.length > 0) {
      const similarEvents = await this.findSimilarEvents(event, user.bookmarks);
      if (similarEvents.length > 0) {
        breakdown.bookmarkSimilarity = (similarEvents.length / user.bookmarks.length) * this.weights.bookmarkSimilarity;
        reasons.push(`Similar to your bookmarked events`);
      }
    }

    // 3. Recency score (boost for recently added events)
    const daysSinceCreated = (new Date() - event.createdAt) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 7) {
      breakdown.recency = this.weights.recency * (1 - daysSinceCreated / 7);
      reasons.push('Recently added event');
    }

    // 4. Trending score
    if (event.engagement && event.engagement.trendingScore > 0) {
      const normalizedTrending = Math.min(event.engagement.trendingScore / 100, 1);
      breakdown.trending = normalizedTrending * this.weights.trending;
      if (normalizedTrending > 0.5) {
        reasons.push('Trending event');
      }
    }

    // 5. Event type preference
    if (user.preferences && user.preferences.eventTypes && user.preferences.eventTypes.includes(event.type)) {
      breakdown.tagMatch += 0.1; // Small boost for preferred event type
      reasons.push(`Matches your preferred event type: ${event.type}`);
    }

    // 6. Location preference
    if (user.preferences && user.preferences.locations && user.preferences.locations.length > 0) {
      const matchingLocation = user.preferences.locations.some(location =>
        event.location && event.location.toLowerCase().includes(location.toLowerCase())
      );
      if (matchingLocation) {
        breakdown.tagMatch += 0.05; // Small boost for location match
        reasons.push('Matches your location preference');
      }
    }

    const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

    return {
      total,
      breakdown,
      reasons
    };
  }

  /**
   * Find events similar to user's bookmarked events
   * @param {Object} event - Current event
   * @param {Array} bookmarkedEvents - User's bookmarked events
   * @returns {Promise<Array>} Similar events
   */
  async findSimilarEvents(event, bookmarkedEvents) {
    const similarEvents = [];

    for (const bookmarked of bookmarkedEvents) {
      let similarity = 0;

      // Tag similarity
      if (event.tags && bookmarked.tags) {
        const commonTags = event.tags.filter(tag => bookmarked.tags.includes(tag));
        similarity += (commonTags.length / Math.max(event.tags.length, bookmarked.tags.length)) * 0.4;
      }

      // Type similarity
      if (event.type === bookmarked.type) {
        similarity += 0.3;
      }

      // Location similarity
      if (event.location && bookmarked.location) {
        const eventLocation = event.location.toLowerCase();
        const bookmarkedLocation = bookmarked.location.toLowerCase();
        if (eventLocation.includes(bookmarkedLocation) || bookmarkedLocation.includes(eventLocation)) {
          similarity += 0.3;
        }
      }

      if (similarity > 0.3) {
        similarEvents.push({ event: bookmarked, similarity });
      }
    }

    return similarEvents;
  }

  /**
   * Update user's recommendation cache when they perform actions
   * @param {string} userId - User ID
   * @param {string} action - Action performed
   * @param {string} eventId - Event ID (if applicable)
   */
  invalidateUserCache(userId, action = null, eventId = null) {
    const cacheKey = `recommendations_${userId}`;
    this.cache.delete(cacheKey);

    // If it's a bookmark action, also invalidate similar users' caches
    if (action === 'bookmark' && eventId) {
      // In a real implementation, you might want to track which users have similar preferences
      // and invalidate their caches too
    }
  }

  /**
   * Get recommendation explanation for an event
   * @param {string} userId - User ID
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Explanation object
   */
  async getRecommendationExplanation(userId, eventId) {
    try {
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);
      
      if (!user || !event) {
        throw new Error('User or event not found');
      }

      const score = await this.calculateEventScore(event, user);
      
      return {
        eventId,
        score: score.total,
        reasons: score.reasons,
        breakdown: score.breakdown
      };
    } catch (error) {
      console.error('Error getting recommendation explanation:', error);
      throw error;
    }
  }

  /**
   * Record user feedback on recommendations
   * @param {string} userId - User ID
   * @param {string} eventId - Event ID
   * @param {string} feedback - 'interested' or 'not_interested'
   */
  async recordFeedback(userId, eventId, feedback) {
    try {
  const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Add feedback to user's interaction history
      user.recommendationData.interactionHistory.push({
        eventId,
        action: feedback === 'interested' ? 'recommendation_positive' : 'recommendation_negative',
        timestamp: new Date()
      });

      await user.save();

      // Invalidate cache to get fresh recommendations
      this.invalidateUserCache(userId, 'feedback', eventId);

      return { success: true };
    } catch (error) {
      console.error('Error recording feedback:', error);
      throw error;
    }
  }

  /**
   * Update recommendation weights (admin function)
   * @param {Object} newWeights - New weight configuration
   */
  updateWeights(newWeights) {
    this.weights = { ...this.weights, ...newWeights };
  }

  /**
   * Clear all caches (admin function)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics (admin function)
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      expiry: this.cacheExpiry
    };
  }
}

module.exports = new RecommendationService();