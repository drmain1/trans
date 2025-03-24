import React, { useState } from 'react'
import PatientInfoForm from '../components/PatientInfoForm'
import RecordingComponent from '../components/RecordingComponent'
import TranscriptionResults from '../components/TranscriptionResults'
import useHealthScribeJob from '../hooks/useHealthScribeJob'
import { useAuth } from '../context/AuthContext'

function TranscriptionPage() {
  const { user } = useAuth()
  const [step, setStep] = useState('patient-info') // patient-info, recording, processing, results
  const [patientInfo, setPatientInfo] = useState(null)
  const [exportStatus, setExportStatus] = useState(null)
  
  const {
    jobId,
    jobStatus,
    isProcessing,
    error: processingError,
    transcript,
    clinicalNotes,
    processRecording,
    resetJob
  } = useHealthScribeJob()
  
  // Handle patient form submission
  function handlePatientInfoSubmit(data) {
    setPatientInfo(data)
    setStep('recording')
  }
  
  // Handle recording submission
  async function handleRecordingComplete(audioBlob) {
    try {
      await processRecording(audioBlob, patientInfo)
      setStep('processing')
    } catch (err) {
      console.error('Error processing recording:', err)
    }
  }
  
  // Handle notes edit
  function handleNotesEdit(editedNotes) {
    console.log('Notes edited:', editedNotes)
    // In a real implementation, this would save the edited notes
  }
  
  // Handle export to EHR
  function handleExportToEHR(notes) {
    setExportStatus('exporting')
    
    // Simulate an export process
    setTimeout(() => {
      setExportStatus('success')
      
      // In a real implementation, this would call an API to export to the EHR
      console.log('Exported notes to EHR:', notes)
    }, 2000)
  }
  
  // Start a new transcription
  function handleStartNew() {
    resetJob()
    setPatientInfo(null)
    setStep('patient-info')
    setExportStatus(null)
  }
  
  // Render the appropriate component based on the current step
  function renderStepContent() {
    switch (step) {
      case 'patient-info':
        return <PatientInfoForm onSubmit={handlePatientInfoSubmit} initialValues={patientInfo} />
      
      case 'recording':
        return <RecordingComponent onRecordingComplete={handleRecordingComplete} patientInfo={patientInfo} />
      
      case 'processing':
        // If we have notes, go to results
        if (transcript && clinicalNotes) {
          setStep('results')
          return null
        }
        
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Processing Recording</h2>
            
            {processingError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-bold">Error</p>
                <p>{processingError}</p>
                
                <div className="mt-4">
                  <button
                    onClick={handleStartNew}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
                
                <p className="text-center mb-4">
                  {jobStatus ? `Status: ${jobStatus}` : 'Initializing...'}
                </p>
                
                <p className="text-sm text-gray-500">
                  HealthScribe is analyzing your conversation and generating clinical documentation.
                  This may take several minutes depending on the length of the recording.
                </p>
              </div>
            )}
          </div>
        )
      
      case 'results':
        return (
          <div>
            <TranscriptionResults
              transcript={transcript}
              clinicalNotes={clinicalNotes}
              onEdit={handleNotesEdit}
              onExport={handleExportToEHR}
            />
            
            {exportStatus && (
              <div className={`mt-4 p-4 rounded ${
                exportStatus === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-blue-100 border border-blue-400 text-blue-700'
              }`}>
                {exportStatus === 'exporting' ? (
                  <p>Exporting to EHR system...</p>
                ) : (
                  <div>
                    <p className="font-bold">Export Successful</p>
                    <p>The clinical notes have been successfully exported to {patientInfo.ehrSystem}.</p>
                    
                    <div className="mt-4">
                      <button
                        onClick={handleStartNew}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Start New Transcription
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="transcription-page container mx-auto p-4 max-w-3xl">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">HealthScribe MVP</h1>
          
          {user && (
            <div className="text-sm text-gray-600">
              <span>Logged in as {user.attributes?.email}</span>
            </div>
          )}
        </div>
        
        {/* Stepper */}
        <div className="flex items-center my-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'patient-info' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            ['recording', 'processing', 'results'].includes(step) ? 'bg-blue-500' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'recording' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            ['processing', 'results'].includes(step) ? 'bg-blue-500' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'processing' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            3
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step === 'results' ? 'bg-blue-500' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'results' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            4
          </div>
        </div>
        
        {/* Step labels */}
        <div className="flex text-xs justify-between text-gray-600">
          <div className={step === 'patient-info' ? 'font-bold text-blue-800' : ''}>
            Patient Info
          </div>
          <div className={step === 'recording' ? 'font-bold text-blue-800' : ''}>
            Recording
          </div>
          <div className={step === 'processing' ? 'font-bold text-blue-800' : ''}>
            Processing
          </div>
          <div className={step === 'results' ? 'font-bold text-blue-800' : ''}>
            Results
          </div>
        </div>
      </header>
      
      <main>
        {renderStepContent()}
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>HealthScribe MVP - HIPAA Compliant Medical Transcription</p>
      </footer>
    </div>
  )
}

export default TranscriptionPage 