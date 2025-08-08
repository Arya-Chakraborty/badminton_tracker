import { useState, useMemo } from 'react'
import './Leaderboard.css'

function Leaderboard({ players }) {
  const [sortBy, setSortBy] = useState('eloRating')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterCompany, setFilterCompany] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')

  const sortedAndFilteredPlayers = useMemo(() => {
    let filtered = players.filter(player => {
      const companyMatch = filterCompany === 'all' || player.company === filterCompany
      const levelMatch = filterLevel === 'all' || (player.level && player.level.code === filterLevel)
      return companyMatch && levelMatch
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'name') {
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Add ranking based on ELO rating
    return filtered.map((player, index) => ({
      ...player,
      ranking: index + 1
    }))
  }, [players, sortBy, sortOrder, filterCompany, filterLevel])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return ''
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-description">
          Track player rankings based on ELO rating system. Click column headers to sort.
        </p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="companyFilter" className="filter-label">Company:</label>
          <select
            id="companyFilter"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Companies</option>
            <option value="Ericsson">Ericsson</option>
            <option value="Away">Away</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="levelFilter" className="filter-label">Level:</label>
          <select
            id="levelFilter"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="L1">L1 - Rookie (0-899)</option>
            <option value="L2">L2 - Club Starter (900-999)</option>
            <option value="L3">L3 - Club Intermediate (1000-1099)</option>
            <option value="L4">L4 - Strong Intermediate (1100-1199)</option>
            <option value="L5">L5 - Club Advanced (1200-1299)</option>
            <option value="L6">L6 - Tournament Challenger (1300-1399)</option>
            <option value="L7">L7 - Tournament Winner (1400-1499)</option>
            <option value="L8">L8 - Semi-Pro Tier (1500+)</option>
          </select>
        </div>
      </div>

      {sortedAndFilteredPlayers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏸</div>
          <h3>No Players Found</h3>
          <p>No players match your current filters, or no players have been registered yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th 
                  className="sortable"
                  onClick={() => handleSort('eloRating')}
                >
                  Rank {getSortIcon('eloRating')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('company')}
                >
                  Company {getSortIcon('company')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('level')}
                >
                  Level {getSortIcon('level')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('matchesPlayed')}
                >
                  Matches Played {getSortIcon('matchesPlayed')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('matchesWon')}
                >
                  Matches Won {getSortIcon('matchesWon')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('pointsWon')}
                >
                  Points Won {getSortIcon('pointsWon')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('eloRating')}
                >
                  ELO Rating {getSortIcon('eloRating')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredPlayers.map((player) => (
                <tr key={player._id || player.id} className="player-row">
                  <td className="rank-cell">
                    <div className="rank-badge">
                      {player.ranking <= 3 && (
                        <span className={`medal medal-${player.ranking}`}>
                          {player.ranking === 1 ? '🥇' : player.ranking === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                      #{player.ranking}
                    </div>
                  </td>
                  <td className="name-cell">
                    <div className="player-name">
                      {player.firstName} {player.lastName}
                    </div>
                  </td>
                  <td>
                    <span className={`company-badge ${player.company.toLowerCase()}`}>
                      {player.company}
                    </span>
                  </td>
                  <td>
                    <span className={`level-badge level-${player.level?.code?.toLowerCase() || 'l3'}`}>
                      {player.level?.code || 'L3'}
                    </span>
                  </td>
                  <td>{player.matchesPlayed}</td>
                  <td>{player.matchesWon}</td>
                  <td>{player.pointsWon}</td>
                  <td className="elo-cell">
                    <div className="elo-rating">
                      {Math.round(player.eloRating)}
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

export default Leaderboard
