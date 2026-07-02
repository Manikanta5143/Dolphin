import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, EyeIcon, BookmarkIcon, UserGroupIcon, ShareIcon, FireIcon } from '@heroicons/react/24/outline';
import { eventService } from '../services/eventService';
import LoadingSkeleton from './LoadingSkeleton';

const CategoryTrendingEvents = () => {
  const [trendingEvents, setTrendingEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['HACKATHON', 'INTERNSHIP', 'CONFERENCE', 'WORKSHOP'];

  const getEventTypeIcon = (type) => {
    const icons = {
      'HACKATHON': '🏆',
      'INTERNSHIP': '💼',
      'CONFERENCE': '🎤',
      'WORKSHOP': '🔧',
      'COMPETITION': '🏅',
      'MEETUP': '👥',
      'WEBINAR': '💻',
      'BOOTCAMP': '🚀',
      'SCHOLARSHIP': '🎓',
      'JOB_FAIR': '🏢',
      'NETWORKING': '🤝',
      'TECH_TALK': '💡',
      'STARTUP_PITCH': '🚀',
      'RESEARCH_OPPORTUNITY': '🔬',
      'VOLUNTEER': '❤️',
      'MENTORSHIP': '👨‍🏫',
      'CAREER_FAIR': '🎯',
      'ALUMNI_EVENT': '🎓',
      'STUDY_GROUP': '📚'
    };
    return icons[type] || '📅';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'HACKATHON': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'INTERNSHIP': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'CONFERENCE': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'WORKSHOP': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'COMPETITION': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'MEETUP': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'WEBINAR': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'BOOTCAMP': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'SCHOLARSHIP': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'JOB_FAIR': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'NETWORKING': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'TECH_TALK': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'STARTUP_PITCH': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'RESEARCH_OPPORTUNITY': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
      'VOLUNTEER': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      'MENTORSHIP': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'CAREER_FAIR': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
      'ALUMNI_EVENT': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      'STUDY_GROUP': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  useEffect(() => {
    fetchTrendingEvents();
  }, []);

  const fetchTrendingEvents = async () => {
    try {
      setLoading(true);
      const eventsByCategory = {};

      for (const category of categories) {
        try {
          const response = await eventService.getEventsByType(category, { limit: 1, sortBy: 'trendingScore', sortOrder: 'desc' });
          if (response.success && response.data && response.data.length > 0) {
            eventsByCategory[category] = response.data[0];
          }
        } catch (err) {
          console.error(`Error fetching ${category} events:`, err);
        }
      }

      setTrendingEvents(eventsByCategory);
    } catch (err) {
      console.error('Error fetching trending events:', err);
      setError(err.response?.data?.message || 'Failed to fetch trending events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" border border-gray-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <LoadingSkeleton className="h-4 w-3/4 mb-2" />
            <LoadingSkeleton className="h-3 w-1/2 mb-4" />
            <LoadingSkeleton className="h-20 w-full mb-4" />
            <LoadingSkeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => {
        const event = trendingEvents[category];

        if (!event) {
          return (
            <div key={category} className=" border-2 border-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">{getEventTypeIcon(category)}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.replace('_', ' ')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No trending events available
              </p>
            </div>
          );
        }

        return (
          <div key={category} className=" border-2 border-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
            <Link to={`/events/${event._id}`} className="block">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center text-orange-500">
                    <FireIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Trending</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-3">
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                </div>

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

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                    View Details →
                  </span>

                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Register
                    </a>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryTrendingEvents;
