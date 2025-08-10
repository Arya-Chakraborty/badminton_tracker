import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { playersAPI, matchesAPI } from './services/api'
import HomePage from './components/HomePage'
import Registration from './components/Registration'
import Leaderboard from './components/Leaderboard'
import InsertDetails from './components/InsertDetails'
import Matches from './components/Matches'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load data from API on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [playersResponse, matchesResponse] = await Promise.all([
          playersAPI.getAll(),
          matchesAPI.getAll()
        ])
        
        setPlayers(playersResponse.data)
        setMatches(matchesResponse.data)
        setError(null)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data. Make sure the server is running.')
        // Fallback to localStorage if API fails
        loadFromLocalStorage()
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const loadFromLocalStorage = () => {
    const savedPlayers = localStorage.getItem('badminton-players')
    const savedMatches = localStorage.getItem('badminton-matches')
    
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers))
    }
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches))
    }
  }

  const addPlayer = async (playerData) => {
    try {
      const response = await playersAPI.create(playerData)
      const newPlayer = response.data
      
      setPlayers(prevPlayers => [...prevPlayers, newPlayer])
      
      // Also save to localStorage as backup
      const updatedPlayers = [...players, newPlayer]
      localStorage.setItem('badminton-players', JSON.stringify(updatedPlayers))
      
      return { success: true, player: newPlayer }
    } catch (err) {
      console.error('Error adding player:', err)
      
      // Extract error message from axios error response
      const errorMessage = err.response?.data?.error || 'Failed to add player. Please try again.'
      
      return { success: false, error: errorMessage }
    }
  }

  const addMatch = async (matchData) => {
    try {
      const response = await matchesAPI.create(matchData)
      const newMatch = response.data
      
      setMatches(prevMatches => [...prevMatches, newMatch])
      
      // Reload players to get updated ratings
      const playersResponse = await playersAPI.getAll()
      setPlayers(playersResponse.data)
      
      // Also save to localStorage as backup
      const updatedMatches = [...matches, newMatch]
      localStorage.setItem('badminton-matches', JSON.stringify(updatedMatches))
      localStorage.setItem('badminton-players', JSON.stringify(playersResponse.data))
      
      return { success: true, match: newMatch }
    } catch (err) {
      console.error('Error adding match:', err)
      return { success: false, error: 'Failed to record match. Please try again.' }
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner">🏸</div>
          <p>Loading badminton data...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<Registration onAddPlayer={addPlayer} />} />
            <Route path="/leaderboard" element={<Leaderboard players={players} />} />
            <Route path="/insert-details" element={<InsertDetails players={players} onAddMatch={addMatch} />} />
            <Route path="/matches" element={<Matches />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
