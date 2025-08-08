import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Models
const playerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String, enum: ['Ericsson', 'Away'], required: true },
  eloRating: { type: Number, default: 1000 },
  matchesPlayed: { type: Number, default: 0 },
  matchesWon: { type: Number, default: 0 },
  pointsWon: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

// Add virtual field for level based on ELO rating
playerSchema.virtual('level').get(function() {
  const rating = this.eloRating
  if (rating <= 899) return { code: 'L1', name: 'Rookie', range: '0-899' }
  if (rating <= 999) return { code: 'L2', name: 'Club Starter', range: '900-999' }
  if (rating <= 1099) return { code: 'L3', name: 'Club Intermediate', range: '1000-1099' }
  if (rating <= 1199) return { code: 'L4', name: 'Strong Intermediate', range: '1100-1199' }
  if (rating <= 1299) return { code: 'L5', name: 'Club Advanced', range: '1200-1299' }
  if (rating <= 1399) return { code: 'L6', name: 'Tournament Challenger', range: '1300-1399' }
  if (rating <= 1499) return { code: 'L7', name: 'Tournament Winner', range: '1400-1499' }
  return { code: 'L8', name: 'Semi-Pro Tier', range: '1500+' }
})

// Ensure virtual fields are serialized
playerSchema.set('toJSON', { virtuals: true })
playerSchema.set('toObject', { virtuals: true })

const matchSchema = new mongoose.Schema({
  teamA: {
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true }
  },
  teamB: {
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true }
  },
  teamAScore: { type: Number, required: true, min: 0 },
  teamBScore: { type: Number, required: true, min: 0 },
  opponentUnknown: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
})

const Player = mongoose.model('Player', playerSchema)
const Match = mongoose.model('Match', matchSchema)

// ELO Calculation Functions
function calculateTeamRating(player1Rating, player2Rating) {
  return (player1Rating + player2Rating) / 2
}

function calculateExpectedScore(teamRating, opponentRating) {
  return 1 / (1 + Math.pow(10, (opponentRating - teamRating) / 400))
}

function calculateActualScore(teamScore, totalPoints) {
  return teamScore / totalPoints
}

function calculateNewRating(currentRating, actualScore, expectedScore, kFactor = 32) {
  return currentRating + kFactor * (actualScore - expectedScore)
}

async function updatePlayerRatings(match) {
  const { teamA, teamB, teamAScore, teamBScore, opponentUnknown } = match
  
  // Get Team A players (always required)
  const teamAPlayerIds = [teamA.player1, teamA.player2]
  let allPlayerIds = [...teamAPlayerIds]
  
  // Add Team B players only if not unknown opponents
  if (!opponentUnknown && teamB.player1 && teamB.player2) {
    allPlayerIds.push(teamB.player1, teamB.player2)
  }
  
  const players = await Player.find({
    _id: { $in: allPlayerIds }
  })
  
  const playerMap = {}
  players.forEach(player => {
    playerMap[player._id.toString()] = player
  })
  
  const teamAPlayer1 = playerMap[teamA.player1.toString()]
  const teamAPlayer2 = playerMap[teamA.player2.toString()]
  const teamBPlayer1 = !opponentUnknown && teamB.player1 ? playerMap[teamB.player1.toString()] : null
  const teamBPlayer2 = !opponentUnknown && teamB.player2 ? playerMap[teamB.player2.toString()] : null
  
  // Calculate team ratings
  const teamARating = calculateTeamRating(teamAPlayer1.eloRating, teamAPlayer2.eloRating)
  const teamBRating = opponentUnknown ? 1000 : calculateTeamRating(teamBPlayer1.eloRating, teamBPlayer2.eloRating)
  
  // Calculate expected scores
  const expectedScoreA = calculateExpectedScore(teamARating, teamBRating)
  const expectedScoreB = 1 - expectedScoreA
  
  // Calculate actual scores
  const totalPoints = teamAScore + teamBScore
  const actualScoreA = calculateActualScore(teamAScore, totalPoints)
  const actualScoreB = calculateActualScore(teamBScore, totalPoints)
  
  // Calculate new team ratings
  const newTeamARating = calculateNewRating(teamARating, actualScoreA, expectedScoreA)
  const newTeamBRating = opponentUnknown ? teamBRating : calculateNewRating(teamBRating, actualScoreB, expectedScoreB)
  
  // Calculate rating changes
  const teamARatingChange = newTeamARating - teamARating
  const teamBRatingChange = newTeamBRating - teamBRating
  
  // Update individual player ratings (split team change evenly)
  const updates = []
  
  // Team A players
  updates.push(
    Player.findByIdAndUpdate(teamA.player1, {
      $inc: {
        eloRating: teamARatingChange / 2,
        matchesPlayed: 1,
        matchesWon: teamAScore > teamBScore ? 1 : 0,
        pointsWon: teamAScore
      }
    }),
    Player.findByIdAndUpdate(teamA.player2, {
      $inc: {
        eloRating: teamARatingChange / 2,
        matchesPlayed: 1,
        matchesWon: teamAScore > teamBScore ? 1 : 0,
        pointsWon: teamAScore
      }
    })
  )
  
  // Team B players (only if not unknown opponents)
  if (!opponentUnknown) {
    updates.push(
      Player.findByIdAndUpdate(teamB.player1, {
        $inc: {
          eloRating: teamBRatingChange / 2,
          matchesPlayed: 1,
          matchesWon: teamBScore > teamAScore ? 1 : 0,
          pointsWon: teamBScore
        }
      }),
      Player.findByIdAndUpdate(teamB.player2, {
        $inc: {
          eloRating: teamBRatingChange / 2,
          matchesPlayed: 1,
          matchesWon: teamBScore > teamAScore ? 1 : 0,
          pointsWon: teamBScore
        }
      })
    )
  }
  
  await Promise.all(updates)
}

// API Routes
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ eloRating: -1 })
    res.json(players)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/players', async (req, res) => {
  try {
    const player = new Player(req.body)
    await player.save()
    res.status(201).json(player)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('teamA.player1 teamA.player2 teamB.player1 teamB.player2')
      .sort({ date: -1 })
    res.json(matches)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/matches', async (req, res) => {
  try {
    const match = new Match(req.body)
    await match.save()
    
    // Update player ratings
    await updatePlayerRatings(match)
    
    res.status(201).json(match)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })

export default app
