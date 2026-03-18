import { useState, useEffect } from 'react'
import { eventService } from '../services/eventService'
import { notificationService } from '../services/notificationService'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

const Debug = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { notifications, unreadCount, loading: notificationLoading, initialized } = useNotification()
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsError, setEventsError] = useState(null)

  useEffect(() => {
    testEventsAPI()
  }, [])

  const testEventsAPI = async () => {
    try {
      setEventsLoading(true)
      setEventsError(null)
      const response = await eventService.getEvents()
      console.log('Debug - Events API Response:', response)
      setEvents(response.data || [])
    } catch (error) {
      console.error('Debug - Events API Error:', error)
      setEventsError(error.message)
    } finally {
      setEventsLoading(false)
    }
  }

  const testNotificationService = async () => {
    try {
      console.log('Testing notification service...')
      const response = await notificationService.getNotifications()
      console.log('Notification service test:', response)
      alert(`Notification service test successful! Found ${response.data?.length || 0} notifications. Check console for details.`)
    } catch (error) {
      console.error('Notification service test failed:', error)
      alert(`Notification service test failed: ${error.message}. Check console for details.`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Page</h1>
        
        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
          </div>
        </div>

        {/* Notification Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Status</h2>
          <div className="space-y-2">
            <p><strong>Initialized:</strong> {initialized ? 'Yes' : 'No'}</p>
            <p><strong>Loading:</strong> {notificationLoading ? 'Yes' : 'No'}</p>
            <p><strong>Notifications Count:</strong> {notifications.length}</p>
            <p><strong>Unread Count:</strong> {unreadCount}</p>
            <button 
              onClick={testNotificationService}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test Notification Service
            </button>
          </div>
        </div>

        {/* Events API Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Events API Test</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {eventsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {eventsError || 'None'}</p>
            <p><strong>Events Count:</strong> {events.length}</p>
            <button 
              onClick={testEventsAPI}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test Events API
            </button>
          </div>
          {events.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Sample Events:</h3>
              <div className="space-y-2">
                {events.slice(0, 3).map((event, index) => (
                  <div key={index} className="p-2 bg-gray-100 rounded">
                    <p><strong>Title:</strong> {event.title}</p>
                    <p><strong>Type:</strong> {event.type}</p>
                    <p><strong>Date:</strong> {event.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Base URL */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
          <div className="space-y-2">
            <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
            <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug
