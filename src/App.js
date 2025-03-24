import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginComponent from './components/LoginComponent'
import DashboardPage from './pages/DashboardPage'
import TranscriptionPage from './pages/TranscriptionPage'
import configureAmplify from './utils/amplifyConfig'

// Initialize Amplify
configureAmplify()

// Protected route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}

// Main App component
function AppContent() {
  const { isAuthenticated, checkUserAuth } = useAuth()
  
  // Check authentication status when the app loads
  useEffect(() => {
    checkUserAuth()
  }, [checkUserAuth])
  
  return (
    <div className="app min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={
          isAuthenticated 
            ? <Navigate to="/dashboard" />
            : <LoginComponent onLoginSuccess={() => checkUserAuth()} />
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/transcribe" element={
          <ProtectedRoute>
            <TranscriptionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-8">The page you are looking for doesn't exist.</p>
            <a href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Return to Dashboard
            </a>
          </div>
        } />
      </Routes>
    </div>
  )
}

// Wrap the app with providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App 