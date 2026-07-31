import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import HowTo from './pages/HowTo'
import Cookies from './pages/Cookies'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/agenthouse/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <Routes>
        <Route path="/agenthouse/" element={<Home />} />
        <Route path="/agenthouse/about" element={<About />} />
        <Route path="/agenthouse/how-to" element={<HowTo />} />
        <Route path="/agenthouse/cookies" element={<Cookies />} />
        <Route path="/agenthouse/login" element={<Login />} />
        <Route
          path="/agenthouse/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/agenthouse/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
