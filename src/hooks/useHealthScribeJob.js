import { useState, useEffect, useCallback } from 'react'
import { getJobStatus, submitRecordingForProcessing } from '../services/healthScribeService'
import { uploadRecording, getTranscription, getFormattedNotes } from '../services/storageService'

function useHealthScribeJob() {
  const [jobId, setJobId] = useState(null)
  const [jobStatus, setJobStatus] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [transcript, setTranscript] = useState(null)
  const [clinicalNotes, setClinicalNotes] = useState(null)
  const [recordingKey, setRecordingKey] = useState(null)
  
  // Poll for job status when jobId changes
  useEffect(() => {
    let intervalId = null
    
    if (jobId) {
      setIsProcessing(true)
      
      // Poll every 5 seconds
      intervalId = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId)
          setJobStatus(status.jobStatus)
          
          // If job is complete, fetch results
          if (status.jobStatus === 'COMPLETED') {
            clearInterval(intervalId)
            setIsProcessing(false)
            
            if (recordingKey) {
              await fetchResults(recordingKey)
            }
          } else if (['FAILED', 'EXPIRED', 'STOPPED'].includes(status.jobStatus)) {
            clearInterval(intervalId)
            setIsProcessing(false)
            setError(`Job ${status.jobStatus.toLowerCase()}: ${status.failureReason || 'Unknown error'}`)
          }
        } catch (err) {
          console.error('Error polling job status:', err)
          setError(`Failed to get job status: ${err.message}`)
          clearInterval(intervalId)
          setIsProcessing(false)
        }
      }, 5000)
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [jobId, recordingKey])
  
  // Upload recording and start processing
  const processRecording = useCallback(async (audioBlob, patientInfo) => {
    setError(null)
    setIsProcessing(true)
    
    try {
      // Upload recording to S3
      const uploadResult = await uploadRecording(audioBlob, {
        patientId: patientInfo.patientId,
        encounterType: patientInfo.encounterType,
        specialtyType: patientInfo.specialtyType
      })
      
      const key = uploadResult.key
      setRecordingKey(key)
      
      // Submit for processing
      const result = await submitRecordingForProcessing(key, patientInfo)
      setJobId(result.jobId)
      
      return result.jobId
    } catch (err) {
      setError(`Failed to process recording: ${err.message}`)
      setIsProcessing(false)
      throw err
    }
  }, [])
  
  // Fetch results when job is complete
  const fetchResults = useCallback(async (key) => {
    try {
      // Get transcript
      const transcriptResult = await getTranscription(key)
      const transcriptText = await transcriptResult.Body.text()
      setTranscript(JSON.parse(transcriptText))
      
      // Get formatted notes
      const notesResult = await getFormattedNotes(key)
      const notesText = await notesResult.Body.text()
      setClinicalNotes(JSON.parse(notesText))
      
      return {
        transcript: JSON.parse(transcriptText),
        clinicalNotes: JSON.parse(notesText)
      }
    } catch (err) {
      setError(`Failed to fetch results: ${err.message}`)
      console.error('Error fetching results:', err)
      throw err
    }
  }, [])
  
  // Reset the job state
  const resetJob = useCallback(() => {
    setJobId(null)
    setJobStatus(null)
    setIsProcessing(false)
    setError(null)
    setTranscript(null)
    setClinicalNotes(null)
    setRecordingKey(null)
  }, [])
  
  return {
    jobId,
    jobStatus,
    isProcessing,
    error,
    transcript,
    clinicalNotes,
    recordingKey,
    processRecording,
    fetchResults,
    resetJob
  }
}

export default useHealthScribeJob 