import React, { createContext, useContext, useReducer, useEffect } from 'react';
import recommendationService from '../services/recommendationService';
import toast from 'react-hot-toast';

const RecommendationContext = createContext();

const initialState = {
  recommendations: [],
  loading: false,
  error: null,
  lastUpdated: null
};

const recommendationReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_RECOMMENDATIONS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_RECOMMENDATIONS_SUCCESS':
      return {
        ...state,
        loading: false,
        recommendations: action.payload,
        lastUpdated: new Date(),
        error: null
      };
    
    case 'FETCH_RECOMMENDATIONS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        recommendations: []
      };
    
    case 'REMOVE_RECOMMENDATION':
      return {
        ...state,
        recommendations: state.recommendations.filter(
          rec => rec.event._id !== action.payload
        )
      };
    
    case 'CLEAR_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: [],
        lastUpdated: null
      };
    
    default:
      return state;
  }
};

export const RecommendationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recommendationReducer, initialState);

  const fetchRecommendations = async (options = {}) => {
    try {
      dispatch({ type: 'FETCH_RECOMMENDATIONS_START' });
      
      const response = await recommendationService.getRecommendations(options);
      
      dispatch({
        type: 'FETCH_RECOMMENDATIONS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      dispatch({
        type: 'FETCH_RECOMMENDATIONS_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch recommendations'
      });
    }
  };

  const markNotInterested = async (eventId) => {
    try {
      await recommendationService.markNotInterested(eventId);
      
      // Remove from local state
      dispatch({
        type: 'REMOVE_RECOMMENDATION',
        payload: eventId
      });
      
      toast.success('Thanks for your feedback! We\'ll improve your recommendations.');
    } catch (error) {
      console.error('Error marking as not interested:', error);
      toast.error('Failed to record feedback');
    }
  };

  const markInterested = async (eventId) => {
    try {
      await recommendationService.markInterested(eventId);
      toast.success('Great! We\'ll show you more events like this.');
    } catch (error) {
      console.error('Error marking as interested:', error);
      toast.error('Failed to record feedback');
    }
  };

  const getRecommendationExplanation = async (eventId) => {
    try {
      const response = await recommendationService.getRecommendationExplanation(eventId);
      return response.data;
    } catch (error) {
      console.error('Error getting explanation:', error);
      throw error;
    }
  };

  const clearRecommendations = () => {
    dispatch({ type: 'CLEAR_RECOMMENDATIONS' });
  };

  const refreshRecommendations = (options = {}) => {
    return fetchRecommendations(options);
  };

  // Auto-fetch recommendations when context is first used
  useEffect(() => {
    if (state.recommendations.length === 0 && !state.loading && !state.error) {
      fetchRecommendations();
    }
  }, []);

  const value = {
    ...state,
    fetchRecommendations,
    markNotInterested,
    markInterested,
    getRecommendationExplanation,
    clearRecommendations,
    refreshRecommendations
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};

export default RecommendationContext;
