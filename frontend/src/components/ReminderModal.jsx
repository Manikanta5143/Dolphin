import React, { useState } from 'react';
import { FaTimes, FaBell, FaClock, FaEnvelope, FaMobile } from 'react-icons/fa';
import { format, addHours, addDays, addWeeks, addMonths } from 'date-fns';

const ReminderModal = ({ eventId, eventDate, eventTitle, onClose, onConfirm, reminderSet }) => {
  const [reminderOption, setReminderOption] = useState('1day');
  const [reminderType, setReminderType] = useState('both');

  const reminderOptions = [
    { value: '1hour', label: '1 hour before', icon: '⏰' },
    { value: '1day', label: '1 day before', icon: '📅' },
    { value: '1week', label: '1 week before', icon: '🗓️' },
    { value: '1month', label: '1 month before', icon: '📆' }
  ];

  const reminderTypes = [
    { value: 'both', label: 'Email & Push', icon: <FaBell className="h-4 w-4" /> },
    { value: 'email', label: 'Email only', icon: <FaEnvelope className="h-4 w-4" /> },
    { value: 'push', label: 'Push only', icon: <FaMobile className="h-4 w-4" /> }
  ];

  const calculateReminderTime = (option) => {
    if (!eventDate) return null;
    
    const eventDateTime = new Date(eventDate);
    
    switch (option) {
      case '1hour':
        return addHours(eventDateTime, -1);
      case '1day':
        return addDays(eventDateTime, -1);
      case '1week':
        return addWeeks(eventDateTime, -1);
      case '1month':
        return addMonths(eventDateTime, -1);
      default:
        return addDays(eventDateTime, -1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reminderTime = calculateReminderTime(reminderOption);
    
    if (!reminderTime || reminderTime <= new Date()) {
      alert('Reminder time is in the past. Please select a different option.');
      return;
    }

    onConfirm({
      reminderOption,
      reminderType,
      reminderTiming: reminderTime
    });
  };

  const reminderTime = calculateReminderTime(reminderOption);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaBell className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {reminderSet ? 'Update Reminder' : 'Set Event Reminder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">{eventTitle}</h4>
            <p className="text-sm text-gray-600">
              {eventDate ? format(new Date(eventDate), 'EEEE, MMMM do, yyyy \'at\' h:mm a') : 'Date TBD'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reminder Timing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                When should we remind you?
              </label>
              <div className="space-y-2">
                {reminderOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      reminderOption === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reminderOption"
                      value={option.value}
                      checked={reminderOption === option.value}
                      onChange={(e) => setReminderOption(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg mr-3">{option.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    {reminderTime && option.value === reminderOption && (
                      <span className="ml-auto text-xs text-gray-500">
                        {format(reminderTime, 'MMM do, h:mm a')}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Reminder Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How should we send the reminder?
              </label>
              <div className="space-y-2">
                {reminderTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      reminderType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reminderType"
                      value={type.value}
                      checked={reminderType === type.value}
                      onChange={(e) => setReminderType(e.target.value)}
                      className="sr-only"
                    />
                    <span className="mr-3">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Warning if reminder time is in the past */}
            {reminderTime && reminderTime <= new Date() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ The selected reminder time is in the past. Please choose a different option.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reminderTime && reminderTime <= new Date()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {reminderSet ? 'Update Reminder' : 'Set Reminder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
