import React from 'react';
import clsx from 'clsx';

const LoadingSkeleton = ({ 
  className = '', 
  lines = 3, 
  showAvatar = false,
  showImage = false,
  variant = 'default' 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  if (variant === 'card') {
    return (
      <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4', className)}>
        {/* Header with avatar and title */}
        <div className="flex items-start space-x-3 mb-3">
          {showAvatar && (
            <div className={clsx(baseClasses, 'w-10 h-10 rounded-full')} />
          )}
          <div className="flex-1 space-y-2">
            <div className={clsx(baseClasses, 'h-4 w-3/4')} />
            <div className={clsx(baseClasses, 'h-3 w-1/2')} />
          </div>
        </div>

        {/* Image */}
        {showImage && (
          <div className={clsx(baseClasses, 'w-full h-32 mb-3')} />
        )}

        {/* Content lines */}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={clsx(
                baseClasses,
                'h-3',
                index === lines - 1 ? 'w-2/3' : 'w-full'
              )}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <div className={clsx(baseClasses, 'h-6 w-16')} />
            <div className={clsx(baseClasses, 'h-6 w-16')} />
          </div>
          <div className={clsx(baseClasses, 'h-6 w-20')} />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={clsx('space-y-3', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {showAvatar && (
              <div className={clsx(baseClasses, 'w-10 h-10 rounded-full flex-shrink-0')} />
            )}
            <div className="flex-1 space-y-2">
              <div className={clsx(baseClasses, 'h-4 w-3/4')} />
              <div className={clsx(baseClasses, 'h-3 w-1/2')} />
            </div>
            <div className={clsx(baseClasses, 'h-6 w-16')} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              'h-3',
              index === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={clsx(baseClasses, className)} />
  );
};

// Specific skeleton components for common use cases
export const EventCardSkeleton = ({ className = '' }) => (
  <LoadingSkeleton 
    variant="card" 
    lines={4} 
    showImage={true}
    className={className}
  />
);

export const EventListSkeleton = ({ count = 5, className = '' }) => (
  <div className={clsx('space-y-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton 
        key={index}
        variant="list" 
        lines={2} 
        showAvatar={true}
      />
    ))}
  </div>
);

export const DashboardSkeleton = ({ className = '' }) => (
  <div className={clsx('space-y-6', className)}>
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <LoadingSkeleton variant="text" lines={2} />
        </div>
      ))}
    </div>
    
    {/* Event cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export const NotificationSkeleton = ({ className = '' }) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        </div>
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
