import React, { createContext, useContext, useState, useEffect } from 'react';
import { shareService } from '../services/shareService';
import toast from 'react-hot-toast';

const ShareContext = createContext();

export const useShare = () => {
  const context = useContext(ShareContext);
  if (!context) {
    throw new Error('useShare must be used within a ShareProvider');
  }
  return context;
};

export const ShareProvider = ({ children }) => {
  const [userShares, setUserShares] = useState([]);
  const [shareStats, setShareStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user shares
  const fetchUserShares = async (options = {}) => {
    try {
      setLoading(true);
      const response = await shareService.getUserShares(options);
      if (response.success) {
        setUserShares(response.data);
      }
    } catch (error) {
      console.error('Error fetching shares:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch share stats
  const fetchShareStats = async (eventId = null) => {
    try {
      const response = await shareService.getShareStats(eventId);
      if (response.success) {
        setShareStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching share stats:', error);
    }
  };

  // Share event
  const shareEvent = async (shareData) => {
    try {
      const response = await shareService.shareEvent(shareData);
      if (response.success) {
        setUserShares(prev => [response.data, ...prev]);
        toast.success('Event shared successfully!');
        return response.data;
      }
    } catch (error) {
      console.error('Error sharing event:', error);
      throw error;
    }
  };

  // Generate shareable link
  const generateShareableLink = async (eventId) => {
    try {
      const response = await shareService.generateShareableLink(eventId);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
      throw error;
    }
  };

  // Delete share
  const deleteShare = async (shareId) => {
    try {
      const response = await shareService.deleteShare(shareId);
      if (response.success) {
        setUserShares(prev => 
          prev.filter(share => share._id !== shareId)
        );
        toast.success('Share deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting share:', error);
      throw error;
    }
  };

  // Update share analytics
  const updateAnalytics = async (shareId, analytics) => {
    try {
      const response = await shareService.updateAnalytics(shareId, analytics);
      if (response.success) {
        setUserShares(prev => 
          prev.map(share => 
            share._id === shareId 
              ? { ...share, ...response.data }
              : share
          )
        );
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  };

  // Get event shares
  const getEventShares = async (eventId, options = {}) => {
    try {
      const response = await shareService.getEventShares(eventId, options);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching event shares:', error);
      throw error;
    }
  };

  // Track share click (public function)
  const trackShareClick = async (shareToken, clickData = {}) => {
    try {
      await shareService.trackClick(shareToken, clickData);
    } catch (error) {
      console.error('Error tracking share click:', error);
    }
  };

  // Get share statistics
  const getShareStatistics = async (eventId = null, timeframe = '30d') => {
    try {
      const response = await shareService.getStats(eventId, timeframe);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching share statistics:', error);
      throw error;
    }
  };

  // Get trending shares
  const getTrendingShares = async (limit = 10) => {
    try {
      const response = await shareService.getTrendingShares(limit);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching trending shares:', error);
      throw error;
    }
  };

  // Initialize data
  useEffect(() => {
    fetchUserShares();
    fetchShareStats();
  }, []);

  const value = {
    userShares,
    shareStats,
    loading,
    fetchUserShares,
    fetchShareStats,
    shareEvent,
    generateShareableLink,
    deleteShare,
    updateAnalytics,
    getEventShares,
    trackShareClick,
    getShareStatistics,
    getTrendingShares
  };

  return (
    <ShareContext.Provider value={value}>
      {children}
    </ShareContext.Provider>
  );
};
