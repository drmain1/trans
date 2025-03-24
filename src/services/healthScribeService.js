import AWS from 'aws-sdk'
import { Auth } from 'aws-amplify'

// This service will require a backend API to interact with HealthScribe
// For this MVP, we're implementing a frontend service that would call API endpoints

async function getJobStatus(jobId) {
  try {
    // In a real implementation, this would be an API call to a backend endpoint
    // that checks the status of a HealthScribe job
    const response = await fetch(`/api/healthscribe/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch job status')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching job status:', error)
    throw error
  }
}

async function submitRecordingForProcessing(recordingKey, patientInfo) {
  try {
    // In a real implementation, this would be an API call to a backend endpoint
    // that initiates a HealthScribe job
    const response = await fetch('/api/healthscribe/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      },
      body: JSON.stringify({
        recordingKey,
        patientInfo,
        noteTemplateType: 'SOAP' // Could be configurable
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit recording for processing')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting recording for processing:', error)
    throw error
  }
}

export {
  getJobStatus,
  submitRecordingForProcessing
} 