import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  FireIcon, 
  EyeIcon, 
  BookmarkIcon, 
  ShareIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { eventService } from '../services/eventService';
import LoadingSkeleton, { EventCardSkeleton } from './LoadingSkeleton';

const TrendingEvents = ({ 
  title = "Trending Events", 
  limit = 6, 
  showTitle = true,
  className = "" 
}) => {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingEvents();
  }, [limit]);

  const fetchTrendingEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getTrendingEvents({ limit });
      setTrendingEvents(response.data);
    } catch (err) {
      console.error('Error fetching trending events:', err);
      setError(err.response?.data?.message || 'Failed to fetch trending events');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days) => {
    if (days <= 1) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    if (days <= 3) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
    if (days <= 7) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <FireIcon className="w-6 h-6 mr-2 text-orange-500" />
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <FireIcon className="w-6 h-6 mr-2 text-orange-500" />
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchTrendingEvents}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (trendingEvents.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <FireIcon className="w-6 h-6 mr-2 text-orange-500" />
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <FireIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No trending events yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for popular events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <FireIcon className="w-6 h-6 mr-2 text-orange-500" />
            {title}
          </h2>
          <Link
            to="/events?sort=trending"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingEvents.map((event) => {
          const daysUntil = getDaysUntil(event.date);
          const isUrgent = daysUntil <= 3;
          const isExpired = daysUntil < 0;

          return (
            <div
              key={event._id}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              {/* Trending Badge */}
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium">
                  <FireIcon className="w-3 h-3" />
                  <span>Trending</span>
                </div>
              </div>

              <Link to={`/events/${event._id}`} className="block">
                <div className="p-4">
                  {/* Event Type and Date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {event.type.replace('_', ' ')}
                    </span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(daysUntil)}`}>
                      {isExpired ? 'Expired' : `${daysUntil} days left`}
                    </div>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Event Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-3">
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  {event.engagement && (
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          {event.engagement.viewCount || 0}
                        </div>
                        <div className="flex items-center">
                          <BookmarkIcon className="w-3 h-3 mr-1" />
                          {event.engagement.bookmarkCount || 0}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="w-3 h-3 mr-1" />
                          {event.engagement.rsvpCount || 0}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <ShareIcon className="w-3 h-3 mr-1" />
                        {event.engagement.shareCount || 0}
                      </div>
                    </div>
                  )}

                  {/* Event Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingEvents;
