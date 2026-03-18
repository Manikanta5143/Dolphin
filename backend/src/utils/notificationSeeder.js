const Notification = require('../models/Notification');
const User = require('../models/User');

const createSampleNotifications = async () => {
  try {
    // Get all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      return;
    }

    // Sample notifications data
    const sampleNotifications = [
      {
        type: 'welcome',
        title: 'Welcome to Event Aggregator!',
        message: 'Thanks for joining us! Explore events, hackathons, and internships.',
        priority: 'medium',
        category: 'system',
        data: { welcome: true }
      },
      {
        type: 'new_event',
        title: 'New Tech Conference Available',
        message: 'Check out the latest tech conference happening in your area.',
        priority: 'high',
        category: 'engagement',
        data: { eventType: 'conference' }
      },
      {
        type: 'achievement_unlocked',
        title: 'First Event Bookmarked!',
        message: 'Congratulations! You\'ve bookmarked your first event.',
        priority: 'low',
        category: 'achievement',
        data: { achievement: 'first_bookmark' }
      },
      {
        type: 'community_update',
        title: 'Community Update',
        message: 'New features have been added to the platform. Check them out!',
        priority: 'medium',
        category: 'community',
        data: { update: 'features' }
      },
      {
        type: 'event_reminder',
        title: 'Event Reminder',
        message: 'Don\'t forget about the upcoming hackathon tomorrow!',
        priority: 'high',
        category: 'reminder',
        data: { eventId: 'sample-event-id' }
      }
    ];

    // Create notifications for each user
    const createdNotifications = [];
    
    for (const user of users) {
      for (const notificationData of sampleNotifications) {
        const notification = await Notification.createNotification({
          userId: user._id,
          ...notificationData
        });
        createdNotifications.push(notification);
      }
    }

    console.log(`✅ Created ${createdNotifications.length} sample notifications for ${users.length} users`);
    return createdNotifications;
    
  } catch (error) {
    console.error('Error creating sample notifications:', error);
    throw error;
  }
};

const clearAllNotifications = async () => {
  try {
    const result = await Notification.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} notifications`);
    return result;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
};

module.exports = {
  createSampleNotifications,
  clearAllNotifications
};
