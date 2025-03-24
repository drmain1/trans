import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecordings } from '../services/storageService'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const { user } = useAuth()
  const [recordings, setRecordings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  
  // Load recordings on component mount
  useEffect(() => {
    loadRecordings()
  }, [])
  
  // Load recordings from storage
  async function loadRecordings() {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getRecordings()
      
      // In a real application, we would fetch metadata for each recording
      // For this MVP, we'll use mock data based on the keys
      const recordingsWithMetadata = result.map(item => {
        // Extract date from key (recordings/TIMESTAMP_UUID.webm)
        const timestamp = item.key.split('/')[1].split('_')[0]
        const date = new Date(parseInt(timestamp))
        
        // Generate mock metadata (in a real app, this would come from S3 metadata)
        return {
          key: item.key,
          date,
          patientId: `P${Math.floor(Math.random() * 10000)}`,
          patientName: `Patient ${Math.floor(Math.random() * 100)}`,
          encounterType: ['office_visit', 'telehealth', 'follow_up'][Math.floor(Math.random() * 3)],
          specialty: ['general_medicine', 'orthopedics', 'pediatrics'][Math.floor(Math.random() * 3)],
          status: ['completed', 'in_progress', 'error'][Math.floor(Math.random() * 3)],
          jobId: `job-${Math.random().toString(36).substring(2, 10)}`
        }
      })
      
      setRecordings(recordingsWithMetadata)
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading recordings:', err)
      setError('Failed to load recordings. Please try again.')
      setIsLoading(false)
    }
  }
  
  // Filter recordings based on search term
  const filteredRecordings = recordings.filter(recording => {
    const searchLower = searchTerm.toLowerCase()
    return (
      recording.patientName.toLowerCase().includes(searchLower) ||
      recording.patientId.toLowerCase().includes(searchLower) ||
      recording.encounterType.toLowerCase().includes(searchLower) ||
      recording.specialty.toLowerCase().includes(searchLower)
    )
  })
  
  // Sort recordings
  const sortedRecordings = [...filteredRecordings].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime()
    }
    
    if (sortBy === 'patientName') {
      return sortOrder === 'asc'
        ? a.patientName.localeCompare(b.patientName)
        : b.patientName.localeCompare(a.patientName)
    }
    
    if (sortBy === 'status') {
      return sortOrder === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    }
    
    return 0
  })
  
  // Format date
  function formatDate(date) {
    return new Date(date).toLocaleString()
  }
  
  // Handle sort change
  function handleSortChange(column) {
    if (sortBy === column) {
      // Toggle order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortBy(column)
      setSortOrder('asc')
    }
  }
  
  return (
    <div className="dashboard-page container mx-auto p-4 max-w-6xl">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">HealthScribe Dashboard</h1>
          
          {user && (
            <div className="text-sm text-gray-600">
              <span>Logged in as {user.attributes?.email}</span>
            </div>
          )}
        </div>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Transcriptions</h2>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search transcriptions"
              className="px-3 py-2 border rounded"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            
            <Link
              to="/transcribe"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              New Transcription
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th 
                    className="py-2 px-4 text-left cursor-pointer"
                    onClick={() => handleSortChange('date')}
                  >
                    <div className="flex items-center">
                      Date/Time
                      {sortBy === 'date' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-2 px-4 text-left cursor-pointer"
                    onClick={() => handleSortChange('patientName')}
                  >
                    <div className="flex items-center">
                      Patient
                      {sortBy === 'patientName' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-4 text-left">Encounter Type</th>
                  <th className="py-2 px-4 text-left">Specialty</th>
                  <th 
                    className="py-2 px-4 text-left cursor-pointer"
                    onClick={() => handleSortChange('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecordings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No transcriptions found.
                    </td>
                  </tr>
                ) : (
                  sortedRecordings.map(recording => (
                    <tr key={recording.key} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{formatDate(recording.date)}</td>
                      <td className="py-2 px-4">
                        <div>{recording.patientName}</div>
                        <div className="text-xs text-gray-500">{recording.patientId}</div>
                      </td>
                      <td className="py-2 px-4 capitalize">
                        {recording.encounterType.replace('_', ' ')}
                      </td>
                      <td className="py-2 px-4 capitalize">
                        {recording.specialty.replace('_', ' ')}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          recording.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : recording.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {recording.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <Link
                          to={`/view/${recording.jobId}`}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Transcriptions this month</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Storage used</span>
                <span className="font-semibold">2.4 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Average processing time</span>
                <span className="font-semibold">2m 34s</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/transcribe"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center px-4 py-2 rounded"
            >
              New Transcription
            </Link>
            
            <Link
              to="/settings"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-center px-4 py-2 rounded"
            >
              EHR Integration Settings
            </Link>
            
            <Link
              to="/support"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-center px-4 py-2 rounded"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="text-center text-gray-500 text-sm">
        <p>HealthScribe MVP - HIPAA Compliant Medical Transcription</p>
      </footer>
    </div>
  )
}

export default DashboardPage 