import React, { useState, useEffect } from 'react';
import { ClockIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CountdownTimer = ({ 
  event, 
  onExpired = null,
  showActions = true,
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const deadline = event.deadline ? new Date(event.deadline) : eventDate;
      
      const diff = deadline - now;
      
      if (diff <= 0) {
        setIsExpired(true);
        if (onExpired) onExpired();
        return null;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds, total: diff };
    };

    const updateTimeLeft = () => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
    };

    // Update immediately
    updateTimeLeft();
    
    // Update every second
    const interval = setInterval(updateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [event.date, event.deadline, onExpired]);

  const getUrgencyLevel = (timeLeft) => {
    if (!timeLeft) return 'expired';
    
    const totalHours = timeLeft.total / (1000 * 60 * 60);
    
    if (totalHours <= 1) return 'critical';
    if (totalHours <= 24) return 'urgent';
    if (totalHours <= 72) return 'soon';
    return 'normal';
  };

  const getUrgencyStyles = (urgency) => {
    switch (urgency) {
      case 'critical':
        return {
          container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          text: 'text-red-900 dark:text-red-100',
          accent: 'text-red-600 dark:text-red-300',
          glow: 'shadow-red-500/25'
        };
      case 'urgent':
        return {
          container: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
          text: 'text-orange-900 dark:text-orange-100',
          accent: 'text-orange-600 dark:text-orange-300',
          glow: 'shadow-orange-500/25'
        };
      case 'soon':
        return {
          container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-900 dark:text-yellow-100',
          accent: 'text-yellow-600 dark:text-yellow-300',
          glow: 'shadow-yellow-500/25'
        };
      case 'expired':
        return {
          container: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          accent: 'text-gray-500 dark:text-gray-400',
          glow: ''
        };
      default:
        return {
          container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          text: 'text-green-900 dark:text-green-100',
          accent: 'text-green-600 dark:text-green-300',
          glow: ''
        };
    }
  };

  const formatTimeUnit = (value, unit) => {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
        <div className="text-xs opacity-75">{unit}</div>
      </div>
    );
  };

  const getStatusMessage = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'Registration closes very soon!';
      case 'urgent':
        return 'Registration closes today!';
      case 'soon':
        return 'Registration closes in a few days';
      case 'expired':
        return 'Registration has closed';
      default:
        return 'Registration is open';
    }
  };

  const getActionText = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'Register Now!';
      case 'urgent':
        return 'Register Today';
      case 'soon':
        return 'Register Soon';
      case 'expired':
        return 'Registration Closed';
      default:
        return 'Register';
    }
  };

  if (isExpired) {
    return (
      <div className={`rounded-lg border-2 p-6 text-center ${className}`}>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <CheckCircleIcon className="w-8 h-8 text-gray-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Registration Closed
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The registration deadline has passed
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="space-y-2">
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
            >
              Registration Closed
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can still view event details and set reminders for future events
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const urgency = getUrgencyLevel(timeLeft);
  const styles = getUrgencyStyles(urgency);

  return (
    <div className={`rounded-lg border-2 p-6 ${styles.container} ${styles.glow} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        {urgency === 'critical' ? (
          <ExclamationTriangleIcon className={`w-8 h-8 ${styles.accent}`} />
        ) : (
          <ClockIcon className={`w-8 h-8 ${styles.accent}`} />
        )}
        <div>
          <h3 className={`text-lg font-semibold ${styles.text}`}>
            {getStatusMessage(urgency)}
          </h3>
          <p className={`text-sm ${styles.text} opacity-75`}>
            {event.deadline ? 'Registration deadline' : 'Event starts'}
          </p>
        </div>
      </div>

      {/* Countdown Display */}
      <div className="flex justify-center space-x-4 mb-6">
        {timeLeft.days > 0 && formatTimeUnit(timeLeft.days, 'Days')}
        {formatTimeUnit(timeLeft.hours, 'Hours')}
        {formatTimeUnit(timeLeft.minutes, 'Minutes')}
        {timeLeft.days === 0 && formatTimeUnit(timeLeft.seconds, 'Seconds')}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span>Time Remaining</span>
          <span>{Math.round((timeLeft.total / (1000 * 60 * 60 * 24)) * 10) / 10} days</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              urgency === 'critical' ? 'bg-red-500' :
              urgency === 'urgent' ? 'bg-orange-500' :
              urgency === 'soon' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ 
              width: `${Math.min(100, (timeLeft.total / (1000 * 60 * 60 * 24 * 30)) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="space-y-3">
          <button
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              urgency === 'critical' ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' :
              urgency === 'urgent' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
              urgency === 'soon' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
              'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {getActionText(urgency)}
          </button>
          
          <div className="flex space-x-2">
            <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Set Reminder
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Share Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
