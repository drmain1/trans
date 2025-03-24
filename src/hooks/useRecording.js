import { useState, useEffect, useRef } from 'react'

function useRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState(null)
  const [error, setError] = useState(null)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const startTimeRef = useRef(null)
  const timerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const mediaStreamRef = useRef(null)
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])
  
  function updateAudioLevel() {
    if (!analyserRef.current) return
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    
    // Calculate audio level from frequency data
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
    setAudioLevel(average / 256) // Normalize to 0-1
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }
  
  async function startRecording() {
    try {
      audioChunksRef.current = []
      
      // Request access to the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      
      // Set up audio processing for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      // Start audio level visualization
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      // Handle data available event
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      // Handle recording stop event
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioData(audioBlob)
        
        // Stop the media stream
        stream.getTracks().forEach(track => track.stop())
        
        // Stop audio level visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        
        // Stop duration timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
      
      // Start recording
      mediaRecorderRef.current.start()
      startTimeRef.current = Date.now()
      setIsRecording(true)
      setError(null)
      
      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } catch (err) {
      setError(`Failed to start recording: ${err.message}`)
      console.error('Error starting recording:', err)
    }
  }
  
  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }
  
  function resetRecording() {
    setAudioData(null)
    setDuration(0)
    setAudioLevel(0)
  }
  
  return {
    isRecording,
    audioData,
    error,
    duration,
    audioLevel,
    startRecording,
    stopRecording,
    resetRecording
  }
}

export default useRecording 