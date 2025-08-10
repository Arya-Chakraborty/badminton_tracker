import { useState, useEffect } from 'react'
import { matchesAPI } from '../services/api'
import './Matches.css'

function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await matchesAPI.getAll()
      setMatches(response.data)
      setError('')
    } catch (error) {
      console.error('Error fetching matches:', error)
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getWinningTeam = (match) => {
    if (match.team1Score > match.team2Score) {
      return `${match.team1Player1} & ${match.team1Player2}`
    } else {
      return `${match.team2Player1} & ${match.team2Player2}`
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🏸</div>
        <p>Loading matches...</p>
      </div>
    )
  }

  return (
    <div className="matches">
      <div className="matches-header">
        <h1 className="page-title">Match History</h1>
        <p className="page-description">
          Complete record of all badminton matches played in the league
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏸</div>
          <h3>No Matches Found</h3>
          <p>No matches have been recorded yet. Start playing and recording matches!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="matches-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Team 1</th>
                <th>Score</th>
                <th>Team 2</th>
                <th>Winning Team</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id} className="match-row">
                  <td className="date-cell">
                    {formatDate(match.createdAt)}
                  </td>
                  <td className="team-cell">
                    <div className="team-players">
                      <span className="player-name">{match.team1Player1}</span>
                      <span className="team-separator">&</span>
                      <span className="player-name">{match.team1Player2}</span>
                    </div>
                  </td>
                  <td className="score-cell">
                    <div className="score-display">
                      <span className={`score ${match.team1Score > match.team2Score ? 'winning-score' : ''}`}>
                        {match.team1Score}
                      </span>
                      <span className="score-separator">-</span>
                      <span className={`score ${match.team2Score > match.team1Score ? 'winning-score' : ''}`}>
                        {match.team2Score}
                      </span>
                    </div>
                  </td>
                  <td className="team-cell">
                    <div className="team-players">
                      <span className="player-name">{match.team2Player1}</span>
                      <span className="team-separator">&</span>
                      <span className="player-name">{match.team2Player2}</span>
                    </div>
                  </td>
                  <td className="winner-cell">
                    <div className="winning-team">
                      🏆 {getWinningTeam(match)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Matches
