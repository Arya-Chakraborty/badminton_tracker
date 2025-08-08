import axios from 'axios'

// Use relative URL for production (Render) and localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Relative URL for production - will use the same domain
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Players API
export const playersAPI = {
  getAll: () => api.get('/players'),
  create: (playerData) => api.post('/players', playerData),
}

// Matches API
export const matchesAPI = {
  getAll: () => api.get('/matches'),
  create: (matchData) => api.post('/matches', matchData),
}

export default api
