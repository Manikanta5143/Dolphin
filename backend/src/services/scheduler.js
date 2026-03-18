const cron = require('node-cron');
const Event = require('../models/Event');

// Clean up expired events (runs daily at 2 AM)
const cleanupExpiredEvents = async () => {
  try {
    console.log('🕐 Running scheduled task: Cleanup expired events');
    
    const result = await Event.updateMany(
      {
        deadline: { $lt: new Date() },
        isActive: true
      },
      {
        isActive: false
      }
    );

    console.log(`✅ Cleaned up ${result.modifiedCount} expired events`);
  } catch (error) {
    console.error('❌ Error in cleanupExpiredEvents:', error);
  }
};

// Update event status based on date (runs every hour)
const updateEventStatus = async () => {
  try {
    console.log('🕐 Running scheduled task: Update event status');
    
    // Mark past events as inactive
    const pastEvents = await Event.updateMany(
      {
        date: { $lt: new Date() },
        isActive: true
      },
      {
        isActive: false
      }
    );

    console.log(`✅ Updated ${pastEvents.modifiedCount} past events to inactive`);
  } catch (error) {
    console.error('❌ Error in updateEventStatus:', error);
  }
};

// Optional: Fetch events from external APIs (runs every 6 hours)
const fetchExternalEvents = async () => {
  try {
    console.log('🕐 Running scheduled task: Fetch external events');
    
    // This is a placeholder for future implementation
    // You can integrate with external APIs like:
    // - Hackathon.com API
    // - Devpost API
    // - Eventbrite API
    // - Custom web scraping
    
    console.log('✅ External events fetch completed (placeholder)');
  } catch (error) {
    console.error('❌ Error in fetchExternalEvents:', error);
  }
};

// Setup all scheduled tasks
const setupScheduledTasks = () => {
  console.log('🚀 Setting up scheduled tasks...');

  // Clean up expired events daily at 2 AM
  cron.schedule('0 2 * * *', cleanupExpiredEvents, {
    scheduled: true,
    timezone: 'UTC'
  });

  // Update event status every hour
  cron.schedule('0 * * * *', updateEventStatus, {
    scheduled: true,
    timezone: 'UTC'
  });

  // Fetch external events every 6 hours
  cron.schedule('0 */6 * * *', fetchExternalEvents, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('✅ Scheduled tasks configured');
};

module.exports = {
  setupScheduledTasks,
  cleanupExpiredEvents,
  updateEventStatus,
  fetchExternalEvents
}; 