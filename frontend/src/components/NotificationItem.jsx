import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';

const NotificationItem = ({ notification, icon, onClose }) => {
  const { markAsRead, deleteNotification } = useNotification();

  const handleMarkAsRead = async () => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification._id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClick = () => {
    handleMarkAsRead();
    
    // Handle action if available
    if (notification.data?.eventId) {
      window.location.href = `/events/${notification.data.eventId}`;
    } else if (notification.data?.achievementId) {
      window.location.href = `/achievements/${notification.data.achievementId}`;
    }
    
    onClose();
  };

  return (
    <div 
      className={`p-4 bg-blue-600 dark:bg-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-700 ${
        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                !notification.isRead ? 'text-white' : 'text-white'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${
                !notification.isRead ? 'text-white' : 'text-white'
              }`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  title="Mark as read"
                >
                  <FaCheck className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                title="Delete"
              >
                <FaTrash className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Priority indicator */}
          {notification.priority === 'high' && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                High Priority
              </span>
            </div>
          )}

          {/* Action button if available */}
          {notification.actionText && notification.actionUrl && (
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = notification.actionUrl;
                }}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              >
                {notification.actionText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
