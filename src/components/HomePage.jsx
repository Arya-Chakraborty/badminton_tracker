import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="hero-title">Badminton Match Tracker</h1>
        <p className="hero-description">
          Track matches, manage player rankings, and monitor your badminton league with our advanced ELO-based ranking system featuring 8 skill levels.
        </p>
      </div>
      
      <div className="action-buttons">
        <Link to="/registration" className="btn btn-primary btn-large">
          <span className="btn-icon">👤</span>
          Player Registration
        </Link>
        
        <Link to="/leaderboard" className="btn btn-primary btn-large">
          <span className="btn-icon">🏆</span>
          Leaderboard
        </Link>
        
        <Link to="/insert-details" className="btn btn-primary btn-large">
          <span className="btn-icon">📝</span>
          Insert Match Details
        </Link>
        
        <Link to="/matches" className="btn btn-primary btn-large">
          <span className="btn-icon">🏸</span>
          Matches
        </Link>
      </div>
      
    </div>
  )
}

export default HomePage
