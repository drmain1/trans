import React, { useState } from 'react'

function PatientInfoForm({ onSubmit, initialValues = {} }) {
  const [formData, setFormData] = useState({
    patientId: initialValues.patientId || '',
    patientName: initialValues.patientName || '',
    encounterType: initialValues.encounterType || 'office_visit',
    specialtyType: initialValues.specialtyType || 'general_medicine',
    ehrSystem: initialValues.ehrSystem || 'other'
  })
  
  const [errors, setErrors] = useState({})
  
  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }
  
  // Validate form
  function validateForm() {
    const newErrors = {}
    
    if (!formData.patientId.trim()) {
      newErrors.patientId = 'Patient ID is required'
    }
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient Name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  return (
    <div className="patient-info-form p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientId">
            Patient ID
          </label>
          <input
            type="text"
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className={`shadow appearance-none border ${
              errors.patientId ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
          {errors.patientId && (
            <p className="text-red-500 text-xs italic">{errors.patientId}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientName">
            Patient Name
          </label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className={`shadow appearance-none border ${
              errors.patientName ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
          {errors.patientName && (
            <p className="text-red-500 text-xs italic">{errors.patientName}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="encounterType">
            Encounter Type
          </label>
          <select
            id="encounterType"
            name="encounterType"
            value={formData.encounterType}
            onChange={handleChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="office_visit">Office Visit</option>
            <option value="telehealth">Telehealth</option>
            <option value="emergency">Emergency</option>
            <option value="hospital_admission">Hospital Admission</option>
            <option value="follow_up">Follow-up</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialtyType">
            Specialty
          </label>
          <select
            id="specialtyType"
            name="specialtyType"
            value={formData.specialtyType}
            onChange={handleChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="general_medicine">General Medicine</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="dermatology">Dermatology</option>
            <option value="behavioral_health">Behavioral Health</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ehrSystem">
            EHR System
          </label>
          <select
            id="ehrSystem"
            name="ehrSystem"
            value={formData.ehrSystem}
            onChange={handleChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="epic">Epic</option>
            <option value="cerner">Cerner</option>
            <option value="allscripts">Allscripts</option>
            <option value="athenahealth">athenahealth</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientInfoForm 