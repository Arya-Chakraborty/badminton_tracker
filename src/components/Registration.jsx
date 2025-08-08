import { useState } from 'react'
import './Registration.css'

function Registration({ onAddPlayer }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: 'Ericsson'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setSubmitMessage('Please fill in all required fields.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await onAddPlayer(formData)
      
      if (result.success) {
        setSubmitMessage('Player registered successfully!')
        setFormData({
          firstName: '',
          lastName: '',
          company: 'Ericsson'
        })
      } else {
        setSubmitMessage(result.error || 'Error registering player. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Error registering player. Please try again.')
    }
    
    setIsSubmitting(false)
    
    // Clear message after 3 seconds
    setTimeout(() => setSubmitMessage(''), 3000)
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
              className="btn btn-primary btn-large submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Player'}
            </button>
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registration
