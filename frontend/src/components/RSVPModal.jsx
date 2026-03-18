import React, { useState } from 'react';
import { FaTimes, FaCheck, FaQuestion, FaTimes as FaNotGoing, FaUsers, FaUtensils, FaWheelchair } from 'react-icons/fa';
import { format } from 'date-fns';

const RSVPModal = ({ eventId, eventDate, eventTitle, currentRSVP, onClose, onConfirm }) => {
  const [status, setStatus] = useState(currentRSVP?.status || '');
  const [guestCount, setGuestCount] = useState(currentRSVP?.details?.guestCount || 1);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(currentRSVP?.details?.dietaryRestrictions || []);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(currentRSVP?.details?.accessibilityNeeds || []);
  const [notes, setNotes] = useState(currentRSVP?.details?.notes || '');
  const [emergencyContact, setEmergencyContact] = useState({
    name: currentRSVP?.details?.emergencyContact?.name || '',
    phone: currentRSVP?.details?.emergencyContact?.phone || '',
    relationship: currentRSVP?.details?.emergencyContact?.relationship || ''
  });

  const rsvpOptions = [
    {
      value: 'going',
      label: 'Going',
      description: 'I will attend this event',
      icon: <FaCheck className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      value: 'maybe',
      label: 'Maybe',
      description: 'I might attend this event',
      icon: <FaQuestion className="h-5 w-5" />,
      color: 'text-yellow-600'
    },
    {
      value: 'not_going',
      label: 'Not Going',
      description: 'I will not attend this event',
      icon: <FaNotGoing className="h-5 w-5" />,
      color: 'text-red-600'
    }
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Kosher', 'Halal', 'Other'
  ];

  const accessibilityOptions = [
    'Wheelchair access needed', 'Hearing assistance', 'Visual assistance', 'Mobility assistance', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!status) {
      alert('Please select your RSVP status');
      return;
    }

    const details = {
      guestCount,
      dietaryRestrictions,
      accessibilityNeeds,
      notes,
      emergencyContact: emergencyContact.name ? emergencyContact : undefined
    };

    onConfirm(status, details);
  };

  const handleDietaryChange = (option) => {
    setDietaryRestrictions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleAccessibilityChange = (option) => {
    setAccessibilityNeeds(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaUsers className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">RSVP to Event</h3>
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
            {/* RSVP Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Will you attend this event?
              </label>
              <div className="space-y-2">
                {rsvpOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      status === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={status === option.value}
                      onChange={(e) => setStatus(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`mr-3 ${option.color}`}>{option.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Guest Count (only for "going") */}
            {status === 'going' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of guests (including yourself)
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1} {index === 0 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dietary Restrictions (only for "going") */}
            {status === 'going' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary restrictions (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dietaryRestrictions.includes(option)}
                        onChange={() => handleDietaryChange(option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Accessibility Needs (only for "going") */}
            {status === 'going' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accessibility needs (optional)
                </label>
                <div className="space-y-2">
                  {accessibilityOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={accessibilityNeeds.includes(option)}
                        onChange={() => handleAccessibilityChange(option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Contact (only for "going") */}
            {status === 'going' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency contact (optional)
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={emergencyContact.name}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={emergencyContact.phone}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={emergencyContact.relationship}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional information or questions..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                {currentRSVP ? 'Update RSVP' : 'Submit RSVP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVPModal;

