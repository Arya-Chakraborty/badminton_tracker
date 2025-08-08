# Badminton Tracker App

A full-stack badminton match tracking application with ELO rating system built with React, Express, and MongoDB.

## Features

- Player registration and management
- Advanced ELO-based ranking system with 8 skill levels
- Match recording with unknown opponent support
- Real-time leaderboard with filtering options
- Responsive design with dark theme

## Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Deployment**: Render

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev:full
   ```

This will start both the backend server (port 5000) and frontend development server (port 5173).

## Deployment on Render

### Step 1: Prepare Your Repository

1. Push your code to GitHub
2. Make sure your MongoDB Atlas connection string is ready

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Use these settings:
   - **Name**: `badminton-tracker` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`

### Step 3: Environment Variables

In the Render dashboard, add these environment variables:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: `5000` (optional, Render will set this automatically)

### Step 4: Deploy

Click "Create Web Service" and wait for the deployment to complete.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/players` - Get all players
- `POST /api/players` - Create a new player
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Record a new match

## ELO Rating System

The app uses an advanced ELO rating system with these levels:

- **L1**: Rookie (0-899)
- **L2**: Club Starter (900-999)
- **L3**: Club Intermediate (1000-1099)
- **L4**: Strong Intermediate (1100-1199)
- **L5**: Club Advanced (1200-1299)
- **L6**: Tournament Challenger (1300-1399)
- **L7**: Tournament Winner (1400-1499)
- **L8**: Semi-Pro Tier (1500+)

Players start at 1000 ELO rating and their level is automatically calculated based on their current rating.

## License

MIT License
