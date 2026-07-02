import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash, FaEnvelope, FaMobile } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import toast from 'react-hot-toast';

const NotificationPreferences = () => {
  const { preferences, updatePreferences, loading } = useNotification();
  const [formData, setFormData] = useState({
    email: true,
    push: true,
    reminderTiming: '1day',
    newEventNotifications: true,
    achievementNotifications: true,
    communityNotifications: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePreferences(formData);
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-6 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FaBell className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="email"
                  checked={formData.email}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaMobile className="h-5 w-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-900">Push Notifications</label>
                  <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="push"
                  checked={formData.push}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Reminder Timing */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Timing</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When to send event reminders
            </label>
            <select
              name="reminderTiming"
              value={formData.reminderTiming}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1hour">1 hour before</option>
              <option value="1day">1 day before</option>
              <option value="1week">1 week before</option>
              <option value="1month">1 month before</option>
            </select>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">New Events</label>
                <p className="text-sm text-gray-500">Notify me about new events that match my interests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="newEventNotifications"
                  checked={formData.newEventNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Achievements</label>
                <p className="text-sm text-gray-500">Notify me when I unlock new achievements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="achievementNotifications"
                  checked={formData.achievementNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Community Updates</label>
                <p className="text-sm text-gray-500">Notify me about community activities and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="communityNotifications"
                  checked={formData.communityNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationPreferences;
