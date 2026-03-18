import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaExclamation, FaInfoCircle, FaTrophy, FaUsers, FaCalendar, FaBell } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationList = ({ onClose }) => {
  const { notifications, loading, fetchNotifications, error, initialized } = useNotification();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    console.log('NotificationList: Fetching notifications...');
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') {
      return !notification.isRead;
    }
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_reminder':
        return <FaCalendar className="text-blue-500" />;
      case 'achievement_unlocked':
        return <FaTrophy className="text-yellow-500" />;
      case 'community_update':
        return <FaUsers className="text-green-500" />;
      case 'new_event':
        return <FaInfoCircle className="text-purple-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  if (!initialized) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <FaExclamation className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">Error loading notifications</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => fetchNotifications()}
            className="text-sm text-white hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="divide-y divide-gray-900">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <FaBell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'unread' ? 'You have no unread notifications.' : 'You have no notifications yet.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              icon={getNotificationIcon(notification.type)}
              onClose={onClose}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              // Navigate to full notifications page
              window.location.href = '/notifications';
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
