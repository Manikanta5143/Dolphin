import React, { createContext, useContext, useReducer, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import toast from 'react-hot-toast';

const DashboardContext = createContext();

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
  lastUpdated: null,
  widgets: {
    stats: null,
    bookmarks: [],
    recommendations: [],
    trending: [],
    achievements: [],
    leaderboard: [],
    reminders: []
  }
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DASHBOARD_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_DASHBOARD_SUCCESS':
      return {
        ...state,
        loading: false,
        dashboard: action.payload,
        lastUpdated: new Date(),
        error: null
      };
    
    case 'FETCH_DASHBOARD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        dashboard: null
      };
    
    case 'UPDATE_WIDGET':
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widget]: action.payload.data
        }
      };
    
    case 'CLEAR_DASHBOARD':
      return {
        ...state,
        dashboard: null,
        widgets: {
          stats: null,
          bookmarks: [],
          recommendations: [],
          trending: [],
          achievements: [],
          leaderboard: [],
          reminders: []
        },
        lastUpdated: null
      };
    
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const fetchDashboard = async () => {
    try {
      dispatch({ type: 'FETCH_DASHBOARD_START' });
      
      const response = await dashboardService.getDashboard();
      
      dispatch({
        type: 'FETCH_DASHBOARD_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      dispatch({
        type: 'FETCH_DASHBOARD_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch dashboard data'
      });
    }
  };

  const fetchWidget = async (widgetName) => {
    try {
      const response = await dashboardService.getDashboardWidgets([widgetName]);
      
      dispatch({
        type: 'UPDATE_WIDGET',
        payload: {
          widget: widgetName,
          data: response.data[widgetName]
        }
      });
    } catch (error) {
      console.error(`Error fetching ${widgetName} widget:`, error);
      toast.error(`Failed to load ${widgetName} data`);
    }
  };

  const refreshDashboard = async () => {
    return fetchDashboard();
  };

  const refreshWidget = async (widgetName) => {
    return fetchWidget(widgetName);
  };

  const clearDashboard = () => {
    dispatch({ type: 'CLEAR_DASHBOARD' });
  };

  // Auto-fetch dashboard when context is first used
  useEffect(() => {
    if (!state.dashboard && !state.loading && !state.error) {
      fetchDashboard();
    }
  }, []);

  const value = {
    ...state,
    fetchDashboard,
    fetchWidget,
    refreshDashboard,
    refreshWidget,
    clearDashboard
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;
