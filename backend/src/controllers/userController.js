const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get user's bookmarked events
// @route   GET /api/users/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookmarks')
      .sort({ 'bookmarks.date': 1 });

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Bookmark an event
// @route   POST /api/users/bookmarks/:eventId
// @access  Private
const addBookmark = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if already bookmarked
    const user = await User.findById(req.user._id);
    if (user.bookmarks.includes(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Event already bookmarked'
      });
    }

    // Add bookmark
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { bookmarks: eventId } }
    );

    // Add user to event's bookmarkedBy array
    await Event.findByIdAndUpdate(
      eventId,
      { $push: { bookmarkedBy: req.user._id } }
    );

    res.json({
      success: true,
      message: 'Event bookmarked successfully'
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/users/bookmarks/:eventId
// @access  Private
const removeBookmark = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Remove bookmark
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { bookmarks: eventId } }
    );

    // Remove user from event's bookmarkedBy array
    await Event.findByIdAndUpdate(
      eventId,
      { $pull: { bookmarkedBy: req.user._id } }
    );

    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Check if event is bookmarked
// @route   GET /api/users/bookmarks/:eventId/check
// @access  Private
const checkBookmark = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user._id);
    const isBookmarked = user.bookmarks.includes(eventId);

    res.json({
      success: true,
      data: {
        isBookmarked
      }
    });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark
}; 