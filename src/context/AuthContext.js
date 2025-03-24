import React, { createContext, useState, useEffect, useContext } from 'react'
import { currentAuthenticatedUser } from '../services/authService'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkUserAuth()
  }, [])

  async function checkUserAuth() {
    setIsLoading(true)
    try {
      const authUser = await currentAuthenticatedUser()
      setUser(authUser)
      setIsAuthenticated(true)
      setError(null)
    } catch (err) {
      setUser(null)
      setIsAuthenticated(false)
      setError('User is not authenticated')
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    error,
    checkUserAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth } 