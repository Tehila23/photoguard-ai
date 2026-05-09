import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage      from './pages/DashboardPage.jsx'
import SelectPhotosPage   from './pages/SelectPhotosPage.jsx'
import AnalysisResultsPage from './pages/AnalysisResultsPage.jsx'
import ReviewPage         from './pages/ReviewPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard"      element={<DashboardPage />} />
      <Route path="/select-photos"  element={<SelectPhotosPage />} />
      <Route path="/analysis"       element={<AnalysisResultsPage />} />
      <Route path="/review"         element={<ReviewPage />} />
    </Routes>
  )
}
