import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import DashboardPage      from './pages/DashboardPage.jsx'
import SelectPhotosPage   from './pages/SelectPhotosPage.jsx'
import AnalysisResultsPage from './pages/AnalysisResultsPage.jsx'
import ReviewPage         from './pages/ReviewPage.jsx'
import SettingsPage       from './pages/SettingsPage.jsx'
import MemoriesPage       from './pages/MemoriesPage.jsx'
import ShieldPage         from './pages/ShieldPage.jsx'
import InsightsPage       from './pages/InsightsPage.jsx'
import LoginPage          from './pages/LoginPage.jsx'
import SignupPage         from './pages/SignupPage.jsx'
import { useAuth } from './hooks/useAuth.jsx'

const ACCESSIBILITY_CLASSES = {
  comfortMode: 'photoguard-comfort-mode',
  largerText: 'photoguard-large-text',
  highContrast: 'photoguard-high-contrast',
  reduceMotion: 'photoguard-reduce-motion',
}

function applyAccessibilitySettings() {
  Object.entries(ACCESSIBILITY_CLASSES).forEach(([key, className]) => {
    document.body.classList.toggle(className, window.localStorage.getItem(key) === 'true')
  })
}

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-shell">
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#667085' }}>
          Loading PhotoGuard...
        </main>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default function App() {
  useEffect(() => {
    applyAccessibilitySettings()
    window.addEventListener('photoguard-settings-change', applyAccessibilitySettings)
    window.addEventListener('storage', applyAccessibilitySettings)

    return () => {
      window.removeEventListener('photoguard-settings-change', applyAccessibilitySettings)
      window.removeEventListener('storage', applyAccessibilitySettings)
    }
  }, [])

  return (
    <Routes>
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/signup"         element={<SignupPage />} />
      <Route path="/"               element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/select-photos"  element={<ProtectedRoute><SelectPhotosPage /></ProtectedRoute>} />
      <Route path="/analysis"       element={<ProtectedRoute><AnalysisResultsPage /></ProtectedRoute>} />
      <Route path="/review"         element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      <Route path="/settings"       element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/memories"       element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
      <Route path="/shield"         element={<ProtectedRoute><ShieldPage /></ProtectedRoute>} />
      <Route path="/insights"       element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
    </Routes>
  )
}
