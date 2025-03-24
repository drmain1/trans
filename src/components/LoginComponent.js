import React, { useState } from 'react'
import { signIn, forgotPassword, forgotPasswordSubmit } from '../services/authService'

function LoginComponent({ onLoginSuccess }) {
  const [loginState, setLoginState] = useState('signIn') // signIn, forgotPassword, resetPassword
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  
  async function handleSignIn(e) {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Please enter your username and password')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const user = await signIn(username, password)
      setIsLoading(false)
      
      if (onLoginSuccess) {
        onLoginSuccess(user)
      }
    } catch (err) {
      setIsLoading(false)
      
      if (err.code === 'UserNotConfirmedException') {
        setError('Account not confirmed. Please check your email for verification code.')
      } else if (err.code === 'NotAuthorizedException') {
        setError('Incorrect username or password')
      } else {
        setError(`Error signing in: ${err.message}`)
      }
      
      console.error('Sign in error:', err)
    }
  }
  
  async function handleForgotPassword(e) {
    e.preventDefault()
    
    if (!username) {
      setError('Please enter your username')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      await forgotPassword(username)
      setIsLoading(false)
      setLoginState('resetPassword')
      setMessage('Please check your email for the password reset code')
    } catch (err) {
      setIsLoading(false)
      setError(`Error requesting password reset: ${err.message}`)
      console.error('Forgot password error:', err)
    }
  }
  
  async function handleResetPassword(e) {
    e.preventDefault()
    
    if (!username || !confirmationCode || !newPassword) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      await forgotPasswordSubmit(username, confirmationCode, newPassword)
      setIsLoading(false)
      setLoginState('signIn')
      setMessage('Password reset successful. Please sign in with your new password.')
      setConfirmationCode('')
      setNewPassword('')
    } catch (err) {
      setIsLoading(false)
      setError(`Error resetting password: ${err.message}`)
      console.error('Reset password error:', err)
    }
  }
  
  return (
    <div className="login-container p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        HealthScribe Physician Portal
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {loginState === 'signIn' && (
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setLoginState('forgotPassword')
                setError(null)
                setMessage(null)
              }}
              className="text-blue-500 hover:text-blue-800 text-sm"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      )}
      
      {loginState === 'forgotPassword' && (
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reset-username">
              Username
            </label>
            <input
              id="reset-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setLoginState('signIn')
                setError(null)
                setMessage(null)
              }}
              className="text-blue-500 hover:text-blue-800 text-sm"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
      
      {loginState === 'resetPassword' && (
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
              Confirmation Code
            </label>
            <input
              id="code"
              type="text"
              value={confirmationCode}
              onChange={e => setConfirmationCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter the code from your email"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your new password"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setLoginState('signIn')
                setError(null)
                setMessage(null)
              }}
              className="text-blue-500 hover:text-blue-800 text-sm"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginComponent 