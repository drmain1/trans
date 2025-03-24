import React, { useState } from 'react'

function TranscriptionResults({ transcript, clinicalNotes, onEdit, onExport }) {
  const [activeTab, setActiveTab] = useState('notes')
  const [editableNotes, setEditableNotes] = useState(clinicalNotes)
  const [isEditing, setIsEditing] = useState(false)
  
  // Handle tab switching
  function handleTabChange(tab) {
    setActiveTab(tab)
  }
  
  // Enable editing mode
  function handleEnableEditing() {
    setIsEditing(true)
  }
  
  // Save edited notes
  function handleSaveEdits() {
    setIsEditing(false)
    if (onEdit) {
      onEdit(editableNotes)
    }
  }
  
  // Cancel editing
  function handleCancelEditing() {
    setIsEditing(false)
    setEditableNotes(clinicalNotes)
  }
  
  // Handle notes changes
  function handleNotesChange(e) {
    setEditableNotes({
      ...editableNotes,
      [activeTab]: e.target.value
    })
  }
  
  // Export notes
  function handleExport() {
    if (onExport) {
      onExport(editableNotes)
    }
  }
  
  // Render content based on active tab
  function renderTabContent() {
    if (!transcript || !clinicalNotes) return null
    
    if (activeTab === 'transcript') {
      return (
        <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">
          {transcript.transcript || 'No transcript available'}
        </div>
      )
    }
    
    // For other tabs (sections of clinical notes)
    const content = clinicalNotes[activeTab]
    
    if (isEditing) {
      return (
        <textarea
          className="w-full h-64 p-4 border rounded font-mono text-sm"
          value={editableNotes[activeTab] || ''}
          onChange={handleNotesChange}
        />
      )
    }
    
    return (
      <div className="whitespace-pre-wrap bg-white p-4 rounded border">
        {content || `No content available for ${activeTab}`}
      </div>
    )
  }
  
  // If no data yet, show loading
  if (!transcript && !clinicalNotes) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No results available yet.</p>
      </div>
    )
  }
  
  // Available tabs based on clinical notes structure
  const tabs = clinicalNotes ? Object.keys(clinicalNotes) : []
  
  return (
    <div className="results-container p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Clinical Documentation</h2>
      
      <div className="tab-navigation flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 mr-2 ${
              activeTab === tab
                ? 'bg-blue-500 text-white rounded-t'
                : 'text-blue-500 hover:text-blue-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        
        <button
          onClick={() => handleTabChange('transcript')}
          className={`px-4 py-2 ${
            activeTab === 'transcript'
              ? 'bg-blue-500 text-white rounded-t'
              : 'text-blue-500 hover:text-blue-700'
          }`}
        >
          Full Transcript
        </button>
      </div>
      
      <div className="tab-content mb-4">
        {renderTabContent()}
      </div>
      
      <div className="flex justify-end space-x-2">
        {activeTab !== 'transcript' && (
          <>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEditing}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={handleEnableEditing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
          </>
        )}
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to EHR
        </button>
      </div>
    </div>
  )
}

export default TranscriptionResults 