import React, { useState, useEffect } from 'react';
import { FaCheck, FaQuestion, FaTimes, FaCalendarCheck } from 'react-icons/fa';
import { useRSVP } from '../context/RSVPContext';
import RSVPModal from './RSVPModal';
import toast from 'react-hot-toast';

const RSVPButton = ({ eventId, eventDate, eventTitle }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentRSVP, setCurrentRSVP] = useState(null);
  const { createRSVP, getUserRSVP, updateRSVP } = useRSVP();

  // Check if user has already RSVP'd
  useEffect(() => {
    const fetchRSVP = async () => {
      try {
        const rsvp = await getUserRSVP(eventId);
        setCurrentRSVP(rsvp);
      } catch (error) {
        // No RSVP found, that's okay
        setCurrentRSVP(null);
      }
    };

    fetchRSVP();
  }, [eventId, getUserRSVP]);

  const handleRSVP = async (status, details = {}) => {
    try {
      if (currentRSVP) {
        // Update existing RSVP
        await updateRSVP(currentRSVP._id, { status, ...details });
      } else {
        // Create new RSVP
        await createRSVP({
          eventId,
          status,
          details
        });
      }
      
      setCurrentRSVP({ ...currentRSVP, status, details });
      setShowModal(false);
      
      const statusMessages = {
        going: 'You\'re going to this event!',
        maybe: 'You marked yourself as maybe for this event.',
        not_going: 'You marked yourself as not going to this event.'
      };
      
      toast.success(statusMessages[status]);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
    }
  };

  const getButtonProps = () => {
    if (!currentRSVP) {
      return {
        icon: <FaCalendarCheck className="h-4 w-4" />,
        text: 'RSVP',
        className: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }

    switch (currentRSVP.status) {
      case 'going':
        return {
          icon: <FaCheck className="h-4 w-4" />,
          text: 'Going',
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'maybe':
        return {
          icon: <FaQuestion className="h-4 w-4" />,
          text: 'Maybe',
          className: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'not_going':
        return {
          icon: <FaTimes className="h-4 w-4" />,
          text: 'Not Going',
          className: 'bg-red-600 hover:bg-red-700 text-white'
        };
      default:
        return {
          icon: <FaCalendarCheck className="h-4 w-4" />,
          text: 'RSVP',
          className: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const buttonProps = getButtonProps();
  const isPastEvent = new Date(eventDate) <= new Date();

  if (isPastEvent) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
        <FaCalendarCheck className="h-4 w-4" />
        <span>Event Passed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${buttonProps.className}`}
      >
        {buttonProps.icon}
        <span className="hidden sm:inline">{buttonProps.text}</span>
      </button>

      {showModal && (
        <RSVPModal
          eventId={eventId}
          eventDate={eventDate}
          eventTitle={eventTitle}
          currentRSVP={currentRSVP}
          onClose={() => setShowModal(false)}
          onConfirm={handleRSVP}
        />
      )}
    </>
  );
};

export default RSVPButton;
