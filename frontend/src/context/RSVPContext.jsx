import React, { createContext, useContext, useState, useEffect } from 'react';
import { rsvpService } from '../services/rsvpService';
import toast from 'react-hot-toast';

const RSVPContext = createContext();

export const useRSVP = () => {
  const context = useContext(RSVPContext);
  if (!context) {
    throw new Error('useRSVP must be used within a RSVPProvider');
  }
  return context;
};

export const RSVPProvider = ({ children }) => {
  const [userRSVPs, setUserRSVPs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user RSVPs
  const fetchUserRSVPs = async (options = {}) => {
    try {
      setLoading(true);
      const response = await rsvpService.getUserRSVPs(options);
      if (response.success) {
        setUserRSVPs(response.data);
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upcoming events
  const fetchUpcomingEvents = async (limit = 10) => {
    try {
      const response = await rsvpService.getUpcomingEvents(limit);
      if (response.success) {
        setUpcomingEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  // Create RSVP
  const createRSVP = async (rsvpData) => {
    try {
      const response = await rsvpService.createRSVP(rsvpData);
      if (response.success) {
        setUserRSVPs(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating RSVP:', error);
      throw error;
    }
  };

  // Update RSVP
  const updateRSVP = async (rsvpId, updateData) => {
    try {
      const response = await rsvpService.updateRSVP(rsvpId, updateData);
      if (response.success) {
        setUserRSVPs(prev => 
          prev.map(rsvp => 
            rsvp._id === rsvpId 
              ? { ...rsvp, ...response.data }
              : rsvp
          )
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      throw error;
    }
  };

  // Delete RSVP
  const deleteRSVP = async (rsvpId) => {
    try {
      const response = await rsvpService.deleteRSVP(rsvpId);
      if (response.success) {
        setUserRSVPs(prev => 
          prev.filter(rsvp => rsvp._id !== rsvpId)
        );
      }
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      throw error;
    }
  };

  // Get user's RSVP for specific event
  const getUserRSVP = async (eventId) => {
    try {
      const response = await rsvpService.getUserRSVP(eventId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      // No RSVP found is not an error
      return null;
    }
  };

  // Check in to event
  const checkIn = async (rsvpId) => {
    try {
      const response = await rsvpService.checkIn(rsvpId);
      if (response.success) {
        setUserRSVPs(prev => 
          prev.map(rsvp => 
            rsvp._id === rsvpId 
              ? { ...rsvp, ...response.data }
              : rsvp
          )
        );
        toast.success('Checked in successfully!');
        return response.data;
      }
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  };

  // Check out of event
  const checkOut = async (rsvpId) => {
    try {
      const response = await rsvpService.checkOut(rsvpId);
      if (response.success) {
        setUserRSVPs(prev => 
          prev.map(rsvp => 
            rsvp._id === rsvpId 
              ? { ...rsvp, ...response.data }
              : rsvp
          )
        );
        toast.success('Checked out successfully!');
        return response.data;
      }
    } catch (error) {
      console.error('Error checking out:', error);
      throw error;
    }
  };

  // Submit feedback
  const submitFeedback = async (rsvpId, rating, comment = '') => {
    try {
      const response = await rsvpService.submitFeedback(rsvpId, { rating, comment });
      if (response.success) {
        setUserRSVPs(prev => 
          prev.map(rsvp => 
            rsvp._id === rsvpId 
              ? { ...rsvp, ...response.data }
              : rsvp
          )
        );
        toast.success('Feedback submitted successfully!');
        return response.data;
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  // Get user's RSVP status for event
  const getRSVPStatus = (eventId) => {
    const rsvp = userRSVPs.find(rsvp => rsvp.eventId === eventId);
    return rsvp ? rsvp.status : null;
  };

  // Check if user is going to event
  const isGoingToEvent = (eventId) => {
    const rsvp = userRSVPs.find(rsvp => rsvp.eventId === eventId);
    return rsvp && rsvp.status === 'going';
  };

  // Check if user has checked in to event
  const hasCheckedIn = (eventId) => {
    const rsvp = userRSVPs.find(rsvp => rsvp.eventId === eventId);
    return rsvp && rsvp.attendance && rsvp.attendance.checkedIn;
  };

  // Initialize data
  useEffect(() => {
    fetchUserRSVPs();
    fetchUpcomingEvents();
  }, []);

  const value = {
    userRSVPs,
    upcomingEvents,
    loading,
    fetchUserRSVPs,
    fetchUpcomingEvents,
    createRSVP,
    updateRSVP,
    deleteRSVP,
    getUserRSVP,
    checkIn,
    checkOut,
    submitFeedback,
    getRSVPStatus,
    isGoingToEvent,
    hasCheckedIn
  };

  return (
    <RSVPContext.Provider value={value}>
      {children}
    </RSVPContext.Provider>
  );
};
