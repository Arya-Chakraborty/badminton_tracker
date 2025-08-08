import { useState } from 'react'
import './InsertDetails.css'

function InsertDetails({ players, onAddMatch }) {
  const [formData, setFormData] = useState({
    teamAPlayer1: '',
    teamAPlayer2: '',
    teamBPlayer1: '',
    teamBPlayer2: '',
    teamAScore: '',
    teamBScore: '',
    opponentUnknown: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const validateForm = () => {
    const { teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2, teamAScore, teamBScore, opponentUnknown } = formData
    
    // Check if Team A players are selected
    if (!teamAPlayer1 || !teamAPlayer2) {
      return 'Please select both Team A players'
    }
    
    // Check if Team A players are different
    if (teamAPlayer1 === teamAPlayer2) {
      return 'Team A players must be different'
    }
    
    // Check Team B players only if opponents are not unknown
    if (!opponentUnknown) {
      if (!teamBPlayer1 || !teamBPlayer2) {
        return 'Please select both Team B players or check "Opponent Unknown"'
      }
      
      if (teamBPlayer1 === teamBPlayer2) {
        return 'Team B players must be different'
      }
      
      // Check if all players are different
      const selectedPlayers = [teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2]
      const uniquePlayers = new Set(selectedPlayers)
      if (uniquePlayers.size !== 4) {
        return 'All players must be different'
      }
    }
    
    // Check if scores are valid
    const scoreA = parseInt(teamAScore)
    const scoreB = parseInt(teamBScore)
    
    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      return 'Please enter valid scores (non-negative numbers)'
    }
    
    if (scoreA === scoreB) {
      return 'Scores cannot be tied. Please enter different scores for each team'
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setSubmitMessage(validationError)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const matchData = {
        teamA: {
          player1: formData.teamAPlayer1,
          player2: formData.teamAPlayer2
        },
        teamB: {
          player1: formData.opponentUnknown ? null : formData.teamBPlayer1,
          player2: formData.opponentUnknown ? null : formData.teamBPlayer2
        },
        teamAScore: parseInt(formData.teamAScore),
        teamBScore: parseInt(formData.teamBScore),
        opponentUnknown: formData.opponentUnknown
      }
      
      const result = await onAddMatch(matchData)
      
      if (result.success) {
        setSubmitMessage('Match recorded successfully! Player ratings have been updated.')
        setFormData({
          teamAPlayer1: '',
          teamAPlayer2: '',
          teamBPlayer1: '',
          teamBPlayer2: '',
          teamAScore: '',
          teamBScore: '',
          opponentUnknown: false
        })
      } else {
        setSubmitMessage(result.error || 'Error recording match. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Error recording match. Please try again.')
    }
    
    setIsSubmitting(false)
    
    // Clear message after 3 seconds
    setTimeout(() => setSubmitMessage(''), 3000)
  }

  const getPlayerName = (playerId) => {
    const player = players.find(p => p._id === playerId || p.id === playerId)
    return player ? `${player.firstName} ${player.lastName}` : ''
  }

  const getAvailablePlayers = (excludeIds = []) => {
    return players.filter(player => {
      const playerId = player._id || player.id
      return !excludeIds.includes(playerId.toString())
    })
  }

  const minPlayersRequired = formData.opponentUnknown ? 2 : 4

  return (
    <div className="insert-details">
      <div className="insert-details-container">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Insert Match Details</h1>
            <p className="card-description">
              Record the results of a doubles badminton match. ELO ratings will be automatically updated using the advanced scoring system.
            </p>
          </div>
          
          {players.length < minPlayersRequired ? (
            <div className="insufficient-players">
              <div className="warning-icon">⚠️</div>
              <h3>Not Enough Players</h3>
              <p>You need at least {minPlayersRequired} registered players to record a match. Currently, you have {players.length} player(s) registered.</p>
              <p>Please register more players before recording matches.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="match-form">
              <div className="opponent-unknown-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="opponentUnknown"
                    checked={formData.opponentUnknown}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    Opponent Unknown (opponents assumed to have 1000 ELO)
                  </span>
                </label>
              </div>
              
              <div className="teams-container">
                <div className="team-section">
                  <h3 className="team-title">Team A</h3>
                  
                  <div className="form-group">
                    <label htmlFor="teamAPlayer1" className="form-label">
                      Player 1
                    </label>
                    <select
                      id="teamAPlayer1"
                      name="teamAPlayer1"
                      value={formData.teamAPlayer1}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Player 1</option>
                      {getAvailablePlayers([
                        formData.teamAPlayer2,
                        formData.opponentUnknown ? null : formData.teamBPlayer1,
                        formData.opponentUnknown ? null : formData.teamBPlayer2
                      ].filter(Boolean)).map(player => (
                        <option key={player._id || player.id} value={player._id || player.id}>
                          {player.firstName} {player.lastName} ({player.company} - {player.level?.code || 'L3'}) - ELO: {Math.round(player.eloRating)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="teamAPlayer2" className="form-label">
                      Player 2
                    </label>
                    <select
                      id="teamAPlayer2"
                      name="teamAPlayer2"
                      value={formData.teamAPlayer2}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Player 2</option>
                      {getAvailablePlayers([
                        formData.teamAPlayer1,
                        formData.opponentUnknown ? null : formData.teamBPlayer1,
                        formData.opponentUnknown ? null : formData.teamBPlayer2
                      ].filter(Boolean)).map(player => (
                        <option key={player._id || player.id} value={player._id || player.id}>
                          {player.firstName} {player.lastName} ({player.company} - {player.level?.code || 'L3'}) - ELO: {Math.round(player.eloRating)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="teamAScore" className="form-label">
                      Team A Score
                    </label>
                    <input
                      type="number"
                      id="teamAScore"
                      name="teamAScore"
                      value={formData.teamAScore}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      max="30"
                      required
                      placeholder="Enter score"
                    />
                  </div>
                </div>
                
                <div className="vs-divider">
                  <span className="vs-text">VS</span>
                </div>
                
                <div className="team-section">
                  <h3 className="team-title">
                    {formData.opponentUnknown ? 'Unknown Opponents' : 'Team B'}
                  </h3>
                  
                  {formData.opponentUnknown ? (
                    <div className="unknown-opponents-info">
                      <p>Opponents will be assumed to have 1000 ELO rating for calculation purposes.</p>
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label htmlFor="teamBPlayer1" className="form-label">
                          Player 1
                        </label>
                        <select
                          id="teamBPlayer1"
                          name="teamBPlayer1"
                          value={formData.teamBPlayer1}
                          onChange={handleChange}
                          className="form-select"
                          required={!formData.opponentUnknown}
                        >
                          <option value="">Select Player 1</option>
                          {getAvailablePlayers([
                            formData.teamAPlayer1,
                            formData.teamAPlayer2,
                            formData.teamBPlayer2
                          ]).map(player => (
                            <option key={player._id || player.id} value={player._id || player.id}>
                              {player.firstName} {player.lastName} ({player.company} - {player.level?.code || 'L3'}) - ELO: {Math.round(player.eloRating)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="teamBPlayer2" className="form-label">
                          Player 2
                        </label>
                        <select
                          id="teamBPlayer2"
                          name="teamBPlayer2"
                          value={formData.teamBPlayer2}
                          onChange={handleChange}
                          className="form-select"
                          required={!formData.opponentUnknown}
                        >
                          <option value="">Select Player 2</option>
                          {getAvailablePlayers([
                            formData.teamAPlayer1,
                            formData.teamAPlayer2,
                            formData.teamBPlayer1
                          ]).map(player => (
                            <option key={player._id || player.id} value={player._id || player.id}>
                              {player.firstName} {player.lastName} ({player.company} - {player.level?.code || 'L3'}) - ELO: {Math.round(player.eloRating)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="teamBScore" className="form-label">
                      {formData.opponentUnknown ? 'Opponent Score' : 'Team B Score'}
                    </label>
                    <input
                      type="number"
                      id="teamBScore"
                      name="teamBScore"
                      value={formData.teamBScore}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      max="30"
                      required
                      placeholder="Enter score"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-large submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Recording Match...' : 'Record Match'}
              </button>
              
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('Error') || submitMessage.includes('Please') || submitMessage.includes('All') || submitMessage.includes('Scores') ? 'error' : 'success'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsertDetails
