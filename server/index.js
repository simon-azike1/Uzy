const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { startScheduler } = require('./services/scheduler')
const { runDailyReminders, runWeeklySummary } = require('./services/scheduler')



dotenv.config()
connectDB()
startScheduler()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/email', require('./routes/email'))           // ← ADD THIS
app.use('/api/applications', require('./routes/application'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/notifications', require('./routes/notifications'))
app.get('/api/test-notifications', async (req, res) => {
  await runDailyReminders()
  await runWeeklySummary()
  res.json({ success: true, message: 'Notifications triggered' })
})

// Health check
app.get('/api', (req, res) => {
  res.json({ message: '✅ UZY API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))