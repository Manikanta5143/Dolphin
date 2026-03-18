import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  EyeIcon, 
  BookmarkIcon, 
  ShareIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { eventService } from '../services/eventService';
import LoadingSkeleton, { EventCardSkeleton } from './LoadingSkeleton';

const RecentEvents = ({ 
  title = "Recent Events", 
  limit = 6, 
  showTitle = true,
  className = "" 
}) => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentEvents();
  }, [limit]);

  const fetchRecentEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents({ 
        limit, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
      setRecentEvents(response.data || []);
    } catch (err) {
      console.error('Error fetching recent events:', err);
      setError(err.response?.data?.message || 'Failed to fetch recent events');
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

  const getEventTypeColor = (type) => {
    const colors = {
      HACKATHON: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      CODING_FEST: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      INTERNSHIP: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      WORKSHOP: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      CONFERENCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      COMPETITION: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      MEETUP: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      WEBINAR: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      BOOTCAMP: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      SCHOLARSHIP: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      JOB_FAIR: 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300',
      NETWORKING: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
      TECH_TALK: 'bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300',
      STARTUP_PITCH: 'bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-300',
      RESEARCH_OPPORTUNITY: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
      VOLUNTEER: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      MENTORSHIP: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-300',
      CAREER_FAIR: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300',
      ALUMNI_EVENT: 'bg-stone-100 text-stone-800 dark:bg-stone-900/20 dark:text-stone-300',
      STUDY_GROUP: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      HACKATHON: '💻',
      CODING_FEST: '🏆',
      INTERNSHIP: '💼',
      WORKSHOP: '🔧',
      CONFERENCE: '🎤',
      COMPETITION: '🏅',
      MEETUP: '👥',
      WEBINAR: '📹',
      BOOTCAMP: '🚀',
      SCHOLARSHIP: '🎓',
      JOB_FAIR: '💼',
      NETWORKING: '🤝',
      TECH_TALK: '🎯',
      STARTUP_PITCH: '💡',
      RESEARCH_OPPORTUNITY: '🔬',
      VOLUNTEER: '❤️',
      MENTORSHIP: '🎯',
      CAREER_FAIR: '🏢',
      ALUMNI_EVENT: '🎓',
      STUDY_GROUP: '📚'
    };
    return icons[type] || '📅';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
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
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
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
            onClick={fetchRecentEvents}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recentEvents.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <CalendarIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No recent events yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new opportunities.
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
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
            {title}
          </h2>
          <Link
            to="/events?sort=recent"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentEvents.map((event) => {
          const daysUntil = getDaysUntil(event.date);
          const isUrgent = daysUntil <= 3;
          const isExpired = daysUntil < 0;

          return (
            <div
              key={event._id}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              {/* New Badge */}
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                  <CalendarIcon className="w-3 h-3" />
                  <span>New</span>
                </div>
              </div>

              <Link to={`/events/${event._id}`} className="block">
                <div className="p-4">
                  {/* Event Type and Date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      <span className="mr-1">{getEventTypeIcon(event.type)}</span>
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

export default RecentEvents;
