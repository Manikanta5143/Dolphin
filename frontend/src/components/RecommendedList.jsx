import React from 'react';
import { useRecommendations } from '../context/RecommendationContext';
import RecommendationCard from './RecommendationCard';
import LoadingSkeleton from './LoadingSkeleton';

const RecommendedList = ({ 
  title = "Recommended for you", 
  limit = 6, 
  showTitle = true,
  className = "" 
}) => {
  const { 
    recommendations, 
    loading, 
    error, 
    fetchRecommendations,
    markNotInterested 
  } = useRecommendations();

  const displayRecommendations = recommendations.slice(0, limit);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => fetchRecommendations({ limit })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (displayRecommendations.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Set your interests and bookmark some events to get personalized recommendations.
          </p>
          <button
            onClick={() => fetchRecommendations({ limit })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={() => fetchRecommendations({ limit })}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Refresh
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.event._id}
            recommendation={recommendation}
            onNotInterested={markNotInterested}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedList;
