import React, { createContext, useContext, useState, useEffect } from 'react';
import { reminderService } from '../services/reminderService';
import toast from 'react-hot-toast';

const ReminderContext = createContext();

export const useReminder = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminder must be used within a ReminderProvider');
  }
  return context;
};

export const ReminderProvider = ({ children }) => {
  const [userReminders, setUserReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user reminders
  const fetchUserReminders = async (options = {}) => {
    try {
      setLoading(true);
      const response = await reminderService.getUserReminders(options);
      if (response.success) {
        setUserReminders(response.data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create reminder
  const createReminder = async (reminderData) => {
    try {
      const response = await reminderService.createReminder(reminderData);
      if (response.success) {
        setUserReminders(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  };

  // Update reminder
  const updateReminder = async (reminderId, updateData) => {
    try {
      const response = await reminderService.updateReminder(reminderId, updateData);
      if (response.success) {
        setUserReminders(prev => 
          prev.map(reminder => 
            reminder._id === reminderId 
              ? { ...reminder, ...response.data }
              : reminder
          )
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  };

  // Delete reminder
  const deleteReminder = async (reminderId) => {
    try {
      const response = await reminderService.deleteReminder(reminderId);
      if (response.success) {
        setUserReminders(prev => 
          prev.filter(reminder => reminder._id !== reminderId)
        );
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  };

  // Get reminder details
  const getReminder = async (reminderId) => {
    try {
      const response = await reminderService.getReminder(reminderId);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching reminder:', error);
      throw error;
    }
  };

  // Track reminder interaction
  const trackInteraction = async (reminderId, action, platform) => {
    try {
      await reminderService.trackInteraction(reminderId, { action, platform });
    } catch (error) {
      console.error('Error tracking reminder interaction:', error);
    }
  };

  // Check if user has reminder for event
  const hasReminderForEvent = (eventId) => {
    return userReminders.some(reminder => 
      reminder.eventId === eventId && reminder.status === 'active'
    );
  };

  // Get reminder for specific event
  const getReminderForEvent = (eventId) => {
    return userReminders.find(reminder => 
      reminder.eventId === eventId && reminder.status === 'active'
    );
  };

  // Initialize data
  useEffect(() => {
    fetchUserReminders();
  }, []);

  const value = {
    userReminders,
    loading,
    fetchUserReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    getReminder,
    trackInteraction,
    hasReminderForEvent,
    getReminderForEvent
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};
