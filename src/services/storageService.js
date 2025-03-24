import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

function uploadRecording(audioBlob, metadata = {}) {
  const fileName = `recordings/${Date.now()}_${uuidv4()}.webm`
  
  return Storage.put(fileName, audioBlob, {
    contentType: 'audio/webm',
    metadata
  })
}

function getRecordings() {
  return Storage.list('recordings/')
}

function getTranscription(key) {
  // The output key will be in the output bucket with a modified path
  const outputKey = key.replace('recordings/', 'transcripts/')
  return Storage.get(outputKey, { download: true })
}

function getFormattedNotes(key) {
  // The formatted notes key will be in the output bucket with a modified path
  const notesKey = key.replace('recordings/', 'formatted-notes/')
  return Storage.get(notesKey, { download: true })
}

function deleteRecording(key) {
  return Storage.remove(key)
}

export {
  uploadRecording,
  getRecordings,
  getTranscription,
  getFormattedNotes,
  deleteRecording
} 