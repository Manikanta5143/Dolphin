const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create or update RSVP
// @route   POST /api/rsvp
// @access  Private
const createRSVP = async (req, res) => {
  try {
    const { eventId, status, details } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!eventId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Event ID and status are required'
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

    // Check if event is in the future
    if (event.date <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot RSVP for past events'
      });
    }

    // Check if event is still accepting RSVPs
    if (event.deadline && event.deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'RSVP deadline has passed'
      });
    }

    // Create or update RSVP
    const rsvpData = {
      userId,
      eventId,
      status,
      details: details || {},
      metadata: {
        source: 'event_detail',
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        ipAddress: req.ip
      }
    };

    const rsvp = await RSVP.createOrUpdateRSVP(rsvpData);

    // Update event engagement metrics
    await event.incrementRSVP();

    // Create notification based on RSVP status
    let notificationMessage;
    switch (status) {
      case 'going':
        notificationMessage = `Great! You're going to "${event.title}". We'll send you a reminder closer to the event.`;
        break;
      case 'maybe':
        notificationMessage = `You've marked "${event.title}" as maybe. We'll send you a reminder to help you decide.`;
        break;
      case 'not_going':
        notificationMessage = `You've marked "${event.title}" as not going. We'll notify you of similar events.`;
        break;
    }

    await Notification.createNotification({
      userId,
      type: 'community_update',
      title: 'RSVP Updated',
      message: notificationMessage,
      data: { eventId, rsvpId: rsvp._id, status },
      priority: 'medium',
      category: 'engagement'
    });

    res.status(201).json({
      success: true,
      data: rsvp,
      message: 'RSVP updated successfully'
    });
  } catch (error) {
    console.error('Create RSVP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create RSVP'
    });
  }
};

// @desc    Get user RSVPs
// @route   GET /api/rsvp
// @access  Private
const getUserRSVPs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, status, upcoming = true } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      upcoming: upcoming === 'true'
    };

    const rsvps = await RSVP.getUserRSVPs(userId, options);

    res.json({
      success: true,
      data: rsvps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user RSVPs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RSVPs'
    });
  }
};

// @desc    Get RSVP details
// @route   GET /api/rsvp/:id
// @access  Private
const getRSVP = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const rsvp = await RSVP.findOne({ _id: id, userId })
      .populate('eventId', 'title date location type')
      .populate('userId', 'name email');

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    res.json({
      success: true,
      data: rsvp
    });
  } catch (error) {
    console.error('Get RSVP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RSVP'
    });
  }
};

// @desc    Update RSVP status
// @route   PUT /api/rsvp/:id
// @access  Private
const updateRSVP = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, details, reason } = req.body;
    const userId = req.user._id;

    const rsvp = await RSVP.findOne({ _id: id, userId });
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    // Update RSVP
    if (status) {
      await rsvp.updateStatus(status, reason);
    }

    if (details) {
      rsvp.details = { ...rsvp.details, ...details };
    }

    await rsvp.save();

    // Get event for notification
    const event = await Event.findById(rsvp.eventId);

    // Create notification for status change
    let notificationMessage;
    switch (status) {
      case 'going':
        notificationMessage = `You've updated your RSVP for "${event.title}" to Going.`;
        break;
      case 'maybe':
        notificationMessage = `You've updated your RSVP for "${event.title}" to Maybe.`;
        break;
      case 'not_going':
        notificationMessage = `You've updated your RSVP for "${event.title}" to Not Going.`;
        break;
    }

    await Notification.createNotification({
      userId,
      type: 'community_update',
      title: 'RSVP Updated',
      message: notificationMessage,
      data: { eventId: rsvp.eventId, rsvpId: rsvp._id, status },
      priority: 'low',
      category: 'engagement'
    });

    res.json({
      success: true,
      data: rsvp,
      message: 'RSVP updated successfully'
    });
  } catch (error) {
    console.error('Update RSVP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update RSVP'
    });
  }
};

// @desc    Delete RSVP
// @route   DELETE /api/rsvp/:id
// @access  Private
const deleteRSVP = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const rsvp = await RSVP.findOneAndDelete({ _id: id, userId });
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    // Update event engagement metrics
    const event = await Event.findById(rsvp.eventId);
    if (event) {
      event.engagement.rsvpCount = Math.max(0, event.engagement.rsvpCount - 1);
      await event.save();
    }

    res.json({
      success: true,
      message: 'RSVP deleted successfully'
    });
  } catch (error) {
    console.error('Delete RSVP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete RSVP'
    });
  }
};

// @desc    Check in to event
// @route   POST /api/rsvp/:id/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const rsvp = await RSVP.findOne({ _id: id, userId });
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    // Check if user is going to the event
    if (rsvp.status !== 'going') {
      return res.status(400).json({
        success: false,
        error: 'You must RSVP as "going" to check in'
      });
    }

    // Check if already checked in
    if (rsvp.attendance.checkedIn) {
      return res.status(400).json({
        success: false,
        error: 'Already checked in to this event'
      });
    }

    // Check if event is today or in the past
    const event = await Event.findById(rsvp.eventId);
    if (event.date > new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot check in to future events'
      });
    }

    await rsvp.checkIn();

    // Update event attendance count
    await event.incrementAttendance();

    // Create notification
    await Notification.createNotification({
      userId,
      type: 'community_update',
      title: 'Checked In Successfully',
      message: `You've successfully checked in to "${event.title}". Have a great time!`,
      data: { eventId: rsvp.eventId, rsvpId: rsvp._id },
      priority: 'medium',
      category: 'engagement'
    });

    res.json({
      success: true,
      data: rsvp,
      message: 'Checked in successfully'
    });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check in'
    });
  }
};

// @desc    Check out of event
// @route   POST /api/rsvp/:id/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const rsvp = await RSVP.findOne({ _id: id, userId });
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    // Check if checked in
    if (!rsvp.attendance.checkedIn) {
      return res.status(400).json({
        success: false,
        error: 'You must check in before checking out'
      });
    }

    // Check if already checked out
    if (rsvp.attendance.checkedOut) {
      return res.status(400).json({
        success: false,
        error: 'Already checked out of this event'
      });
    }

    await rsvp.checkOut();

    res.json({
      success: true,
      data: rsvp,
      message: 'Checked out successfully'
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check out'
    });
  }
};

// @desc    Submit event feedback
// @route   POST /api/rsvp/:id/feedback
// @access  Private
const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const rsvp = await RSVP.findOne({ _id: id, userId });
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }

    // Check if user attended the event
    if (!rsvp.attendance.checkedIn) {
      return res.status(400).json({
        success: false,
        error: 'You must attend the event to submit feedback'
      });
    }

    await rsvp.submitFeedback(rating, comment);

    // Update event rating
    const event = await Event.findById(rsvp.eventId);
    if (event) {
      await event.addRating(userId, rating, comment);
    }

    res.json({
      success: true,
      data: rsvp,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
};

// @desc    Get event RSVPs (Admin only)
// @route   GET /api/rsvp/event/:eventId
// @access  Private/Admin
const getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 50, status, includeFeedback = false } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      includeFeedback: includeFeedback === 'true'
    };

    const rsvps = await RSVP.getEventRSVPs(eventId, options);

    res.json({
      success: true,
      data: rsvps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get event RSVPs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event RSVPs'
    });
  }
};

// @desc    Get RSVP statistics (Admin only)
// @route   GET /api/rsvp/stats
// @access  Private/Admin
const getRSVPStats = async (req, res) => {
  try {
    const { eventId } = req.query;

    let stats;
    if (eventId) {
      // Get stats for specific event
      stats = await RSVP.getRSVPStats(eventId);
    } else {
      // Get overall stats
      stats = await RSVP.aggregate([
        {
          $group: {
            _id: null,
            totalRSVPs: { $sum: 1 },
            goingRSVPs: { $sum: { $cond: [{ $eq: ['$status', 'going'] }, 1, 0] } },
            maybeRSVPs: { $sum: { $cond: [{ $eq: ['$status', 'maybe'] }, 1, 0] } },
            notGoingRSVPs: { $sum: { $cond: [{ $eq: ['$status', 'not_going'] }, 1, 0] } },
            totalAttendees: { $sum: { $cond: [{ $eq: ['$attendance.checkedIn', true] }, 1, 0] } },
            avgAttendanceDuration: { $avg: '$attendance.attendanceDuration' },
            avgRating: { $avg: '$attendance.feedback.rating' }
          }
        }
      ]);
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get RSVP stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get RSVP statistics'
    });
  }
};

// @desc    Get upcoming events for user
// @route   GET /api/rsvp/upcoming
// @access  Private
const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const events = await RSVP.getUpcomingEvents(userId, parseInt(limit));

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming events'
    });
  }
};

module.exports = {
  createRSVP,
  getUserRSVPs,
  getRSVP,
  updateRSVP,
  deleteRSVP,
  checkIn,
  checkOut,
  submitFeedback,
  getEventRSVPs,
  getRSVPStats,
  getUpcomingEvents
};
