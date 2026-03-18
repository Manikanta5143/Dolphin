import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch notifications
  const fetchNotifications = async (options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications(options);
      if (response.success) {
        setNotifications(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch notifications');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      const response = await notificationService.getPreferences();
      if (response.success) {
        setPreferences(response.data || {
          email: true,
          push: true,
          reminderTiming: '1day',
          newEventNotifications: true,
          achievementNotifications: true,
          communityNotifications: true
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Set default preferences if fetch fails
      setPreferences({
        email: true,
        push: true,
        reminderTiming: '1day',
        newEventNotifications: true,
        achievementNotifications: true,
        communityNotifications: true
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.filter(notification => notification._id !== notificationId)
        );
        // Check if the deleted notification was unread
        const deletedNotification = notifications.find(n => n._id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences) => {
    try {
      const response = await notificationService.updatePreferences(newPreferences);
      if (response.success) {
        setPreferences(response.data);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  // Track interaction
  const trackInteraction = async (notificationId, action, platform) => {
    try {
      await notificationService.trackInteraction(notificationId, { action, platform });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Initialize data only when user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!initialized) {
        console.log('Notification context timeout - marking as initialized');
        setInitialized(true);
      }
    }, 10000); // 10 second timeout
    
    if (token && !initialized) {
      const initializeData = async () => {
        try {
          console.log('Initializing notification data...');
          await Promise.all([
            fetchNotifications(),
            fetchUnreadCount(),
            fetchPreferences()
          ]);
          setInitialized(true);
          clearTimeout(timeoutId);
        } catch (error) {
          console.error('Error initializing notification data:', error);
          setInitialized(true); // Mark as initialized even if there's an error
          clearTimeout(timeoutId);
        }
      };
      initializeData();
    } else if (!token) {
      // If no token, mark as initialized to avoid infinite loading
      console.log('No token found - marking as initialized');
      setInitialized(true);
      clearTimeout(timeoutId);
    }
    
    return () => clearTimeout(timeoutId);
  }, []); // Remove initialized from dependencies to prevent infinite loop

  // Set up real-time updates (if using Socket.IO)
  useEffect(() => {
    // This would be implemented with Socket.IO in a real app
    // const socket = io();
    // socket.on('newNotification', addNotification);
    // return () => socket.disconnect();
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    preferences,
    error,
    initialized,
    fetchNotifications,
    fetchUnreadCount,
    fetchPreferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    trackInteraction,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
