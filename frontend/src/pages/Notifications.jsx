import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../context/NotificationContext';
import NotificationItem from '../components/NotificationItem';
import NotificationPreferences from '../components/NotificationPreferences';
import toast from 'react-hot-toast';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    initialized,
    fetchNotifications,
    markAllAsRead,
    deleteNotification
  } = useNotification();

  // Fallback state for when context is stuck
  const [fallbackMode, setFallbackMode] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    console.log('Notifications page mounted, fetching notifications...');
    fetchNotifications({ limit: 50 });

    // Set a timeout to enable fallback mode if stuck
    const timeoutId = setTimeout(() => {
      if (!initialized && !loading) {
        console.log('Notifications page timeout - enabling fallback mode');
        setFallbackMode(true);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    // Tab filter
    if (activeTab === 'unread' && notification.isRead) return false;

    // Search filter
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType !== 'all' && notification.type !== filterType) return false;

    // Priority filter
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;

    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_reminder':
        return <CalendarIcon className="text-blue-500 w-5 h-5" />;
      case 'achievement_unlocked':
        return <TrophyIcon className="text-yellow-500 w-5 h-5" />;
      case 'community_update':
        return <UserGroupIcon className="text-green-500 w-5 h-5" />;
      case 'new_event':
        return <InformationCircleIcon className="text-purple-500 w-5 h-5" />;
      case 'event_updated':
        return <ExclamationTriangleIcon className="text-orange-500 w-5 h-5" />;
      case 'event_cancelled':
        return <ExclamationTriangleIcon className="text-red-500 w-5 h-5" />;
      case 'system_update':
        return <InformationCircleIcon className="text-gray-500 w-5 h-5" />;
      default:
        return <InformationCircleIcon className="text-gray-500 w-5 h-5" />;
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n._id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
      setSelectedNotifications([]);
      setShowBulkActions(false);
      toast.success('Selected notifications deleted successfully');
    } catch (error) {
      toast.error('Failed to delete notifications');
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      const unreadSelected = selectedNotifications.filter(id =>
        !notifications.find(n => n._id === id)?.isRead
      );

      await Promise.all(unreadSelected.map(id =>
        fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
      ));

      setSelectedNotifications([]);
      setShowBulkActions(false);
      toast.success('Selected notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Fallback mode for when context is stuck
  if (fallbackMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Notifications Service Unavailable</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The notifications service is currently unavailable. This might be due to network issues or server problems.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setFallbackMode(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading notifications...</h3>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch your notifications.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error loading notifications</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => fetchNotifications()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="px-4 py-2 text-sm font-medium text-white dark:text-gray-300 bg-blue-600 dark:bg-gray-800 border border-blue-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Notification Preferences
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preferences Panel */}
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <NotificationPreferences />
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="all">All Types</option>
              <option value="event_reminder">Event Reminders</option>
              <option value="achievement_unlocked">Achievements</option>
              <option value="community_update">Community</option>
              <option value="new_event">New Events</option>
              <option value="system_update">System</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Bulk Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-3 py-2 text-sm font-medium text-white dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <FunnelIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-white dark:text-white-300">
                      Select All ({selectedNotifications.length} selected)
                    </span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkMarkAsRead}
                    disabled={selectedNotifications.length === 0}
                    className="px-3 py-1 text-sm font-medium text-white dark:text-white bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckIcon className="h-3 w-3 inline mr-1" />
                    Mark Read
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedNotifications.length === 0}
                    className="px-3 py-1 text-sm font-medium text-white dark:text-white bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TrashIcon className="h-3 w-3 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                All Notifications ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'unread'
                  ? 'border-blue-500 text-blue-600 dark:text-wblue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                Unread ({unreadCount})
              </button>
            </nav>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeTab === 'unread'
                    ? 'You have no unread notifications.'
                    : 'You have no notifications yet.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, ease: "easeOut" }}
                  transition={{ duration: 0.2 }}

                  className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] backdrop-blur-md border border-gray-500 hover: border-2 hover: border-gray-100   hover: shadow-lg rounded-xl p-4 shadow-md hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all duration-300"
                >
                  {/* Checkbox for bulk */}
                  {showBulkActions && (
                    <div className="absolute left-3 top-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification._id)}
                        onChange={() => handleSelectNotification(notification._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Notification Content */}
                  <div className={showBulkActions ? 'pl-8' : ''}>
                    <div className="flex items-start justify-between gap-4">

                      {/* LEFT: Icon + Content */}
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div>
                          <h3 className="text-white font-semibold">
                            {notification.title}
                          </h3>

                          <p className="text-gray-400 text-sm mt-1">
                            {notification.message}
                          </p>

                          <span className="text-xs text-gray-500 mt-2 block">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT: Actions */}
                      <div className="flex items-center gap-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => fetch(`/api/notifications/${notification._id}/read`, { method: 'PUT' })}
                            className="text-green-400 hover:text-green-300"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Load More Button */}
        {filteredNotifications.length >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={() => fetchNotifications({ limit: 50, page: Math.floor(notifications.length / 50) + 1 })}
              className="px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Load More Notifications
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
