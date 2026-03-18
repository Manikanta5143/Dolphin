import React, { useState } from 'react';
import { FaBell, FaBellSlash, FaClock } from 'react-icons/fa';
import { format, addHours, addDays, addWeeks, addMonths } from 'date-fns';
import { useReminder } from '../context/ReminderContext';
import ReminderModal from './ReminderModal';
import toast from 'react-hot-toast';

const ReminderButton = ({ eventId, eventDate, eventTitle }) => {
  const [showModal, setShowModal] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const { createReminder, userReminders } = useReminder();

  // Check if reminder is already set for this event
  React.useEffect(() => {
    const existingReminder = userReminders.find(
      reminder => reminder.eventId === eventId
    );
    setReminderSet(!!existingReminder);
  }, [userReminders, eventId]);

  const handleSetReminder = async (reminderData) => {
    try {
      await createReminder({
        eventId,
        eventDate,
        eventTitle,
        ...reminderData
      });
      setReminderSet(true);
      setShowModal(false);
      toast.success('Reminder set successfully!');
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast.error('Failed to set reminder');
    }
  };

  const getReminderText = () => {
    if (!eventDate) return 'Set Reminder';
    
    const eventDateTime = new Date(eventDate);
    const now = new Date();
    const diffInHours = (eventDateTime - now) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Event starting soon';
    } else if (diffInHours < 24) {
      return 'Event today';
    } else if (diffInHours < 48) {
      return 'Event tomorrow';
    } else {
      const daysUntil = Math.ceil(diffInHours / 24);
      return `${daysUntil} days until event`;
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          reminderSet
            ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200'
        }`}
        disabled={new Date(eventDate) <= new Date()}
      >
        {reminderSet ? (
          <FaBellSlash className="h-4 w-4" />
        ) : (
          <FaBell className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {reminderSet ? 'Reminder Set' : 'Set Reminder'}
        </span>
        <FaClock className="h-3 w-3 sm:hidden" />
      </button>

      {showModal && (
        <ReminderModal
          eventId={eventId}
          eventDate={eventDate}
          eventTitle={eventTitle}
          onClose={() => setShowModal(false)}
          onConfirm={handleSetReminder}
          reminderSet={reminderSet}
        />
      )}
    </>
  );
};

export default ReminderButton;
