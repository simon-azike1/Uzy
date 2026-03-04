const cron       = require('node-cron')
const User        = require('../models/User')
const Application = require('../models/Application')
const Notification = require('../models/Notification')

const DAY_MS = 24 * 60 * 60 * 1000

const createIfNotExists = async (userId, applicationId, type, title, message) => {
  // Avoid duplicate notifications for same app+type within 7 days
  const since = new Date(Date.now() - 7 * DAY_MS)
  const exists = await Notification.findOne({ userId, applicationId, type, createdAt: { $gte: since } })
  if (!exists) await Notification.create({ userId, applicationId, type, title, message })
}

// ── Daily at 9am: follow-up + interview reminders ──────────────────────────
const runDailyReminders = async () => {
  console.log('[Scheduler] Running daily reminders...')
  try {
    const users = await User.find({})
    for (const user of users) {
      const apps = await Application.find({ userId: user._id })
      for (const app of apps) {
        const daysSince = Math.floor((Date.now() - new Date(app.updatedAt)) / DAY_MS)

        // Follow-up: applied/no-response for 7+ days
        if (['applied', 'no-response'].includes(app.status) && daysSince >= 7) {
          await createIfNotExists(
            user._id, app._id, 'follow-up',
            `Follow up with ${app.company}`,
            `Your application for ${app.role} at ${app.company} has had no update for ${daysSince} days. Consider sending a follow-up.`
          )
        }

        // Interview reminder: under-review for 3+ days
        if (app.status === 'under-review' && daysSince >= 3) {
          await createIfNotExists(
            user._id, app._id, 'interview',
            `Check in with ${app.company}`,
            `Your ${app.role} application at ${app.company} has been under review for ${daysSince} days. You may want to check in.`
          )
        }
      }
    }
    console.log('[Scheduler] Daily reminders done.')
  } catch (err) {
    console.error('[Scheduler] Error in daily reminders:', err.message)
  }
}

// ── Every Monday at 8am: weekly summary ───────────────────────────────────
const runWeeklySummary = async () => {
  console.log('[Scheduler] Running weekly summaries...')
  try {
    const users = await User.find({})
    const since = new Date(Date.now() - 7 * DAY_MS)

    for (const user of users) {
      const apps = await Application.find({ userId: user._id })
      const newThisWeek      = apps.filter(a => new Date(a.createdAt) >= since).length
      const acceptedThisWeek = apps.filter(a => a.status === 'accepted' && new Date(a.updatedAt) >= since).length
      const total            = apps.length

      if (newThisWeek === 0) continue // skip if no activity

      await Notification.create({
        userId:  user._id,
        type:    'weekly-summary',
        title:   'Your weekly job search summary',
        message: `This week: ${newThisWeek} new application${newThisWeek !== 1 ? 's' : ''} added, ${acceptedThisWeek} accepted. Total applications: ${total}.`,
      })
    }
    console.log('[Scheduler] Weekly summaries done.')
  } catch (err) {
    console.error('[Scheduler] Error in weekly summaries:', err.message)
  }
}

const startScheduler = () => {
  // Daily at 9:00 AM
  cron.schedule('0 9 * * *', runDailyReminders)
  // Every Monday at 8:00 AM
  cron.schedule('0 8 * * 1', runWeeklySummary)
  console.log('[Scheduler] Cron jobs registered.')
}

module.exports = { startScheduler, runDailyReminders, runWeeklySummary }