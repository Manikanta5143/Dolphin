import React, { useState, useEffect } from 'react';
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CountdownBadge = ({ 
  event, 
  variant = 'badge',
  size = 'md',
  showIcon = true,
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const deadline = event.deadline ? new Date(event.deadline) : eventDate;
      
      const diff = deadline - now;
      
      if (diff <= 0) {
        setIsExpired(true);
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
  }, [event.date, event.deadline]);

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
          container: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-600 dark:text-red-400',
          glow: 'shadow-red-500/50'
        };
      case 'urgent':
        return {
          container: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
          text: 'text-orange-800 dark:text-orange-200',
          icon: 'text-orange-600 dark:text-orange-400',
          glow: 'shadow-orange-500/50'
        };
      case 'soon':
        return {
          container: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: 'text-yellow-600 dark:text-yellow-400',
          glow: 'shadow-yellow-500/50'
        };
      case 'expired':
        return {
          container: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
          text: 'text-gray-600 dark:text-gray-400',
          icon: 'text-gray-500 dark:text-gray-400',
          glow: ''
        };
      default:
        return {
          container: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
          text: 'text-green-800 dark:text-green-200',
          icon: 'text-green-600 dark:text-green-400',
          glow: ''
        };
    }
  };

  const formatTimeLeft = (timeLeft) => {
    if (!timeLeft) return 'Expired';
    
    const { days, hours, minutes, seconds } = timeLeft;
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-lg';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'card':
        return 'rounded-lg border-2 p-4';
      case 'inline':
        return 'rounded-full border';
      default:
        return 'rounded-full border';
    }
  };

  if (!timeLeft && !isExpired) {
    return null;
  }

  const urgency = getUrgencyLevel(timeLeft);
  const styles = getUrgencyStyles(urgency);

  if (variant === 'card') {
    return (
      <div className={`${styles.container} ${styles.glow} ${getVariantClasses(variant)} ${className}`}>
        <div className="flex items-center space-x-3">
          {showIcon && (
            <div className="flex-shrink-0">
              {urgency === 'critical' ? (
                <ExclamationTriangleIcon className={`w-6 h-6 ${styles.icon}`} />
              ) : (
                <ClockIcon className={`w-6 h-6 ${styles.icon}`} />
              )}
            </div>
          )}
          
          <div className="flex-1">
            <div className={`font-semibold ${styles.text}`}>
              {isExpired ? 'Event Closed' : formatTimeLeft(timeLeft)}
            </div>
            <div className={`text-xs ${styles.text} opacity-75`}>
              {isExpired ? 'Registration deadline has passed' : 'Time remaining'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1 ${getSizeClasses(size)} ${getVariantClasses(variant)} ${styles.container} ${styles.glow} ${className}`}>
      {showIcon && (
        urgency === 'critical' ? (
          <ExclamationTriangleIcon className={`w-4 h-4 ${styles.icon}`} />
        ) : (
          <ClockIcon className={`w-4 h-4 ${styles.icon}`} />
        )
      )}
      <span className={`font-medium ${styles.text}`}>
        {isExpired ? 'Closed' : formatTimeLeft(timeLeft)}
      </span>
    </div>
  );
};

export default CountdownBadge;
