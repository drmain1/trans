import React, { useState } from 'react'
import useRecording from '../hooks/useRecording'

function RecordingComponent({ onRecordingComplete, patientInfo }) {
  const {
    isRecording,
    audioData,
    error,
    duration,
    audioLevel,
    startRecording,
    stopRecording,
    resetRecording
  } = useRecording()
  
  const [audioUrl, setAudioUrl] = useState(null)
  
  // Handle recording completion
  function handleStopRecording() {
    stopRecording()
  }
  
  // Reset the recording
  function handleReset() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    resetRecording()
  }
  
  // Create an audio URL when audioData changes
  React.useEffect(() => {
    if (audioData) {
      const url = URL.createObjectURL(audioData)
      setAudioUrl(url)
    }
  }, [audioData])
  
  // Format duration as mm:ss
  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Submit the recording
  function handleSubmit() {
    if (audioData && onRecordingComplete) {
      onRecordingComplete(audioData)
    }
  }
  
  return (
    <div className="recording-container p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Record Conversation</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-gray-700">
          Patient: {patientInfo?.patientName || 'Not specified'}
        </p>
        <p className="text-gray-700">
          Encounter: {patientInfo?.encounterType || 'Not specified'}
        </p>
      </div>
      
      <div className="recording-visualizer mb-4 h-20 bg-gray-200 rounded-md overflow-hidden relative">
        <div 
          className="audio-level-indicator bg-blue-500 h-full"
          style={{ width: `${audioLevel * 100}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">
            {isRecording ? formatDuration(duration) : 'Ready to record'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mb-4">
        {!isRecording && !audioData && (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Start Recording
          </button>
        )}
        
        {isRecording && (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Stop Recording
          </button>
        )}
        
        {audioData && (
          <>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
            >
              Process Recording
            </button>
          </>
        )}
      </div>
      
      {audioUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Review Recording</h3>
          <audio controls src={audioUrl} className="w-full"></audio>
        </div>
      )}
    </div>
  )
}

export default RecordingComponent 