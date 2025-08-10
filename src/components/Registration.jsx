import { useState } from 'react'
import './Registration.css'

function Registration({ onAddPlayer }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: 'Ericsson'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please fill in all required fields.')
      return
    }
    
    setIsSubmitting(true)
    setErrorMessage('')
    setUserExists(false)
    
    try {
      const result = await onAddPlayer(formData)
      
      if (result.success) {
        setIsSuccess(true)
        setFormData({
          firstName: '',
          lastName: '',
          company: 'Ericsson'
        })
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
          setIsSubmitting(false)
        }, 3000)
      } else {
        if (result.error && result.error.includes('already registered')) {
          setUserExists(true)
          // Reset user exists state after 3 seconds
          setTimeout(() => {
            setUserExists(false)
            setIsSubmitting(false)
          }, 3000)
        } else {
          setErrorMessage(result.error || 'Error registering player. Please try again.')
          setIsSubmitting(false)
        }
      }
    } catch (error) {
      setErrorMessage('Error registering player. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="registration">
      <div className="registration-container">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Player Registration</h1>
            <p className="card-description">
              Register a new player for the badminton league. All players start with an ELO rating of 1000 (Club Intermediate level).
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  Company
                </label>
                <select
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Ericsson">Ericsson</option>
                  <option value="Away">Away</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-large submit-btn ${isSuccess ? 'btn-success' : userExists ? 'btn-warning' : 'btn-primary'}`}
              disabled={isSubmitting || isSuccess || userExists}
            >
              {isSuccess ? 'Registration Successful ✓' : 
               userExists ? 'User Already Exists ⚠️' : 
               isSubmitting ? 'Registering...' : 'Register Player'}
            </button>
            
            {errorMessage && (
              <div className="submit-message error">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registration
