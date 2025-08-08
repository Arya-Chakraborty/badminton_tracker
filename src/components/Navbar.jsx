import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏸 Badminton Tracker
        </Link>
        <div className="navbar-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/registration" className="nav-link">Registration</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/insert-details" className="nav-link">Insert Details</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
