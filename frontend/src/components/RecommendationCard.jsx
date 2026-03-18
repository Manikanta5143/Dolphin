import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  BookmarkIcon, 
  ShareIcon, 
  XMarkIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useRecommendations } from '../context/RecommendationContext';
import toast from 'react-hot-toast';

const RecommendationCard = ({ 
  recommendation, 
  onNotInterested,
  showActions = true 
}) => {
  const { event, score, reasons, breakdown } = recommendation;
  const { user } = useAuth();
  const { getRecommendationExplanation } = useRecommendations();
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const handleNotInterested = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onNotInterested) {
      await onNotInterested(event._id);
    }
  };

  const handleShowExplanation = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (explanation) {
      setShowExplanation(!showExplanation);
      return;
    }

    try {
      setLoadingExplanation(true);
      const response = await getRecommendationExplanation(event._id);
      setExplanation(response);
      setShowExplanation(true);
    } catch (error) {
      console.error('Error getting explanation:', error);
      toast.error('Failed to load explanation');
    } finally {
      setLoadingExplanation(false);
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

  const daysUntil = getDaysUntil(event.date);
  const isUrgent = daysUntil <= 3;
  const isExpired = daysUntil < 0;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      {/* Recommendation Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
          <SparklesIcon className="w-3 h-3" />
          <span>Recommended</span>
        </div>
      </div>

      {/* Not Interested Button */}
      {showActions && (
        <button
          onClick={handleNotInterested}
          className="absolute top-2 left-2 z-10 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Not interested"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}

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

          {/* Recommendation Reasons */}
          {reasons && reasons.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {reasons.slice(0, 2).map((reason, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  >
                    {reason}
                  </span>
                ))}
                {reasons.length > 2 && (
                  <button
                    onClick={handleShowExplanation}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {loadingExplanation ? 'Loading...' : `+${reasons.length - 2} more`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Event Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
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

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle bookmark action
                  }}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Bookmark"
                >
                  <BookmarkIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle share action
                  }}
                  className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                  title="Share"
                >
                  <ShareIcon className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleShowExplanation}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <InformationCircleIcon className="w-4 h-4 mr-1" />
                Why recommended?
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Explanation Modal */}
      {showExplanation && explanation && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Why this event was recommended
            </h4>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Recommendation Score:</strong> {Math.round(explanation.score * 100)}%
            </div>
            
            {explanation.reasons && explanation.reasons.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Reasons:
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {explanation.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {explanation.breakdown && (
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Score Breakdown:
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  {Object.entries(explanation.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span>{Math.round(value * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
