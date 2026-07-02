import React, { createContext, useContext, useReducer, useEffect } from 'react';
import achievementService from '../services/achievementService';
import toast from 'react-hot-toast';

const AchievementContext = createContext();

const initialState = {
  achievements: [],
  userAchievements: [],
  leaderboard: [],
  userStats: null,
  loading: false,
  error: null,
  newAchievements: []
};

const achievementReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ACHIEVEMENTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_ACHIEVEMENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        achievements: action.payload.achievements || [],
        userAchievements: action.payload.userAchievements || [],
        userStats: action.payload.userStats || null,
        error: null
      };
    
    case 'FETCH_ACHIEVEMENTS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        achievements: [],
        userAchievements: []
      };
    
    case 'FETCH_LEADERBOARD_SUCCESS':
      return {
        ...state,
        leaderboard: action.payload.leaderboard || [],
        error: null
      };
    
    case 'NEW_ACHIEVEMENTS':
      return {
        ...state,
        newAchievements: action.payload,
        userStats: action.payload.userStats || state.userStats
      };
    
    case 'CLEAR_NEW_ACHIEVEMENTS':
      return {
        ...state,
        newAchievements: []
      };
    
    case 'CLEAR_ACHIEVEMENTS':
      return {
        ...state,
        achievements: [],
        userAchievements: [],
        leaderboard: [],
        userStats: null
      };
    
    default:
      return state;
  }
};

export const AchievementProvider = ({ children }) => {
  const [state, dispatch] = useReducer(achievementReducer, initialState);

  const fetchAchievements = async (params = {}) => {
    try {
      dispatch({ type: 'FETCH_ACHIEVEMENTS_START' });
      
      const response = await achievementService.getAchievements(params);
      
      dispatch({
        type: 'FETCH_ACHIEVEMENTS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      dispatch({
        type: 'FETCH_ACHIEVEMENTS_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch achievements'
      });
    }
  };

  const fetchUserAchievements = async () => {
    try {
      dispatch({ type: 'FETCH_ACHIEVEMENTS_START' });
      
      const response = await achievementService.getUserAchievements();
      
      dispatch({
        type: 'FETCH_ACHIEVEMENTS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      dispatch({
        type: 'FETCH_ACHIEVEMENTS_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch user achievements'
      });
    }
  };

  const fetchLeaderboard = async (params = {}) => {
    try {
      const response = await achievementService.getLeaderboard(params);
      
      dispatch({
        type: 'FETCH_LEADERBOARD_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      dispatch({
        type: 'FETCH_ACHIEVEMENTS_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch leaderboard'
      });
    }
  };

  const checkAchievements = async (action, eventId = null) => {
    try {
      const response = await achievementService.checkAchievements(action, eventId);
      
      if (response.data.newAchievements && response.data.newAchievements.length > 0) {
        dispatch({
          type: 'NEW_ACHIEVEMENTS',
          payload: response.data
        });
        
        // Show toast notifications for new achievements
        response.data.newAchievements.forEach(achievement => {
          toast.success(
            `🎉 Achievement Unlocked: ${achievement.name}! (+${achievement.points} points)`,
            {
              duration: 5000,
              icon: achievement.icon
            }
          );
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  };

  const clearNewAchievements = () => {
    dispatch({ type: 'CLEAR_NEW_ACHIEVEMENTS' });
  };

  const clearAchievements = () => {
    dispatch({ type: 'CLEAR_ACHIEVEMENTS' });
  };

  const refreshAchievements = () => {
    return fetchUserAchievements();
  };

  // Auto-fetch user achievements when context is first used
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && state.userAchievements.length === 0 && !state.loading && !state.error) {
      fetchUserAchievements();
    }
  }, []);

  const value = {
    ...state,
    fetchAchievements,
    fetchUserAchievements,
    fetchLeaderboard,
    checkAchievements,
    clearNewAchievements,
    clearAchievements,
    refreshAchievements
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export default AchievementContext;
