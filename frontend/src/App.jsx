import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { RecommendationProvider } from './context/RecommendationContext'
import { AchievementProvider } from './context/AchievementContext'
import { DashboardProvider } from './context/DashboardContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Hackathons from './pages/Hackathons'
import Internships from './pages/Internships'
import Bookmarks from './pages/Bookmarks'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import Achievements from './pages/Achievements'
import Debug from './pages/Debug'

function App() {
  const { user } = useAuth()

  return (
    <NotificationProvider>
      <RecommendationProvider>
        <AchievementProvider>
          <DashboardProvider>
            <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/debug" element={<Debug />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookmarks" 
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
            </div>
          </DashboardProvider>
        </AchievementProvider>
      </RecommendationProvider>
    </NotificationProvider>
  )
}

export default App 