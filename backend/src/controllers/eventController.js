const Event = require('../models/Event');

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const {
      type,
      search,
      tags,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const filter = { isActive: true };

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('bookmarkedBy', '_id');

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('bookmarkedBy', '_id');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      date,
      location,
      link,
      tags,
      eligibility,
      deadline
    } = req.body;

    // Validation
    if (!title || !description || !type || !date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, description, type and date'
      });
    }

    const event = await Event.create({
      title,
      description,
      type,
      date: new Date(date),
      location,
      link,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      eligibility,
      deadline: deadline ? new Date(deadline) : null
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      date,
      location,
      link,
      tags,
      eligibility,
      deadline,
      isActive
    } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        type,
        date: date ? new Date(date) : undefined,
        location,
        link,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
        eligibility,
        deadline: deadline ? new Date(deadline) : undefined,
        isActive
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get trending events
// @route   GET /api/events/trending
// @access  Public
const getTrendingEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const events = await Event.getTrendingEvents(parseInt(limit));
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get trending events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const events = await Event.getUpcomingEvents(parseInt(limit));
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get events by type
// @route   GET /api/events/type/:type
// @access  Public
const getEventsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 20, upcoming = true } = req.query;
    
    const events = await Event.getEventsByType(type, {
      page: parseInt(page),
      limit: parseInt(limit),
      upcoming: upcoming === 'true'
    });
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events by type error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
const searchEvents = async (req, res) => {
  try {
    const { 
      q: query, 
      page = 1, 
      limit = 20, 
      type, 
      location, 
      upcoming = true 
    } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const events = await Event.searchEvents(query, {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      location,
      upcoming: upcoming === 'true'
    });
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get event statistics
// @route   GET /api/events/stats
// @access  Public
const getEventStats = async (req, res) => {
  try {
    const stats = await Event.getEventStats();
    
    res.json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Track event share
// @route   POST /api/events/share
// @access  Public
const trackShare = async (req, res) => {
  try {
    const { eventId, platform, metadata = {} } = req.body;
    
    if (!eventId || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and platform are required'
      });
    }
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Increment share count
    await event.incrementShare();
    
    // Log share for analytics (optional)
    // You could store this in a separate analytics collection
    console.log(`Event ${eventId} shared on ${platform}`, {
      eventId,
      platform,
      metadata,
      timestamp: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    res.json({
      success: true,
      message: 'Share tracked successfully',
      data: {
        eventId,
        platform,
        shareCount: event.engagement.shareCount
      }
    });
  } catch (error) {
    console.error('Track share error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get event share statistics
// @route   GET /api/events/:id/shares
// @access  Public
const getShareStats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        eventId: event._id,
        shareCount: event.engagement.shareCount,
        viewCount: event.engagement.viewCount,
        bookmarkCount: event.engagement.bookmarkCount,
        rsvpCount: event.engagement.rsvpCount
      }
    });
  } catch (error) {
    console.error('Get share stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getTrendingEvents,
  getUpcomingEvents,
  getEventsByType,
  searchEvents,
  getEventStats,
  trackShare,
  getShareStats
}; 