const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const { startScheduler } = require('./services/scheduler')





connectDB()
startScheduler()

const app = express()

// Replace app.use(cors({...})) with this:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://uzy-flame.vercel.app')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/email', require('./routes/email'))           // ← ADD THIS
app.use('/api/applications', require('./routes/application'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/notifications', require('./routes/notifications'))


// Health check
app.get('/api', (req, res) => {
  res.json({ message: '✅ UZY API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))