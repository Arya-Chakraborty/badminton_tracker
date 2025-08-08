# Badminton Match Tracker

A modern React application for tracking badminton matches and player rankings using an advanced ELO rating system.

## Features

### Core Functionality
- **Player Registration**: Register players with company affiliation (Ericsson/Away)
- **Dynamic Skill Levels**: 8-tier system automatically assigned based on ELO rating
- **Match Recording**: Record doubles match results with score tracking
- **Advanced ELO System**: Sophisticated rating calculation based on score proportions and team ratings
- **Leaderboard**: Real-time rankings with filtering and sorting capabilities
- **Unknown Opponents**: Support for matches against unregistered players (assumed 1000 ELO)

## Skill Level System

The application features an 8-tier dynamic skill level system:

| Level | Name | Rating Band |
|-------|------|-------------|
| L1 | Rookie | 0–899 |
| L2 | Club Starter | 900–999 |
| L3 | Club Intermediate | 1000–1099 |
| L4 | Strong Intermediate | 1100–1199 |
| L5 | Club Advanced | 1200–1299 |
| L6 | Tournament Challenger | 1300–1399 |
| L7 | Tournament Winner | 1400–1499 |
| L8 | Semi-Pro Tier | 1500+ |

Player skill levels are automatically calculated and updated based on their current ELO rating.

### Technical Features
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas
- **Real-time Updates**: Automatic rating calculations after each match
- **Responsive Design**: Modern, minimalist dark blue theme
- **API Integration**: RESTful backend with Express.js
- **Local Backup**: Fallback to localStorage when server is unavailable

## ELO Rating System

The application uses an advanced ELO rating system specifically designed for badminton doubles:

### How It Works
1. **Team Rating Calculation**: Average of both players' individual ratings
2. **Expected Score**: Based on rating difference between teams using standard ELO formula
3. **Actual Score**: Proportion of points scored (e.g., 21/36 = 58.3%)
4. **Rating Update**: K-factor of 32 applied to the difference between actual and expected performance
5. **Individual Updates**: Team rating change is split equally between both players

### Example Calculation
- Team A (1000 avg) vs Team B (1075 avg)
- Expected: Team A should score ~39.4% of points
- Actual: 21-15 win = 58.3% of points
- Result: Team A gains ~6 points, Team B loses ~6 points
- Individual: Each player gains/loses ~3 points

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd badminton_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Get your connection string
   - Update the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/badminton-app?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```

4. **Run the application**
   
   **Option 1: Run frontend and backend separately**
   ```bash
   # Terminal 1 - Backend server
   npm run server
   
   # Terminal 2 - Frontend development server
   npm run dev
   ```
   
   **Option 2: Run both together**
   ```bash
   npm run dev:full
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### API Endpoints

- `GET /api/players` - Get all players
- `POST /api/players` - Create a new player
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Record a new match

### Data Models

**Player Schema:**
```javascript
{
  firstName: String,
  lastName: String,
  company: "Ericsson" | "Away",
  eloRating: Number (default: 1000),
  matchesPlayed: Number,
  matchesWon: Number,
  pointsWon: Number,
  createdAt: Date,
  level: Virtual field calculated from ELO rating
}
```

**Match Schema:**
```javascript
{
  teamA: {
    player1: ObjectId,
    player2: ObjectId
  },
  teamB: {
    player1: ObjectId,
    player2: ObjectId
  },
  teamAScore: Number,
  teamBScore: Number,
  opponentUnknown: Boolean,
  date: Date
}
```

## Usage Guide

### Registering Players
1. Navigate to the Registration page
2. Fill in player details: First Name, Last Name, Company
3. Click "Register Player"
4. Player starts with 1000 ELO rating (Club Intermediate level)

### Recording Matches
1. Navigate to "Insert Match Details"
2. Select players for Team A and Team B
3. Enter final scores
4. For unknown opponents, check "Opponent Unknown" checkbox
5. Click "Record Match"
6. ELO ratings are automatically updated

### Viewing Rankings
1. Navigate to the Leaderboard
2. Use filters to view by Company or Skill Level
3. Click column headers to sort
4. View detailed statistics for each player

## Development

### Project Structure
```
src/
├── components/          # React components
├── services/           # API service layer
├── App.jsx            # Main application component
├── App.css            # Global styles
└── main.jsx           # Application entry point
```

### Styling
- CSS custom properties for consistent theming
- Responsive design with mobile-first approach
- Dark blue color scheme with modern aesthetics

### State Management
- React hooks for local state
- API integration for persistent data
- localStorage fallback for offline functionality

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your connection string in `.env`
   - Check network access in MongoDB Atlas
   - Ensure your IP is whitelisted

2. **Port Already in Use**
   - Change the PORT in `.env`
   - Kill existing processes on ports 5000 or 5173

3. **API Not Responding**
   - Ensure backend server is running
   - Check server logs for errors
   - Verify CORS configuration

### Development Tips
- Use browser developer tools to inspect API calls
- Check server logs for debugging backend issues
- localStorage data persists as a backup when API is unavailable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
