// Shared logic — extracts job application data from email text

const JOB_KEYWORDS = [
  'application received', 'application confirmed', 'thank you for applying',
  'thanks for applying', 'we received your application', 'you applied to',
  'application submitted', 'successfully applied', 'your application for',
  'applied for the position', 'application acknowledgement',
  'thank you for your interest', 'we have received your application',
]

const REJECTION_KEYWORDS = [
  'unfortunately', 'not moving forward', 'not selected', 'other candidates',
  'position has been filled', 'we will not be moving', 'decided to pursue',
  'not a match', 'will not be proceeding',
]

const INTERVIEW_KEYWORDS = [
  'interview', 'schedule a call', 'next steps', 'speak with you',
  'would like to meet', 'phone screen', 'video call', 'zoom',
]

// Check if email is job-related
const isJobEmail = (subject, body) => {
  const text = (subject + ' ' + body).toLowerCase()
  return JOB_KEYWORDS.some(kw => text.includes(kw))
}

// Detect application status from email content
const detectStatus = (subject, body) => {
  const text = (subject + ' ' + body).toLowerCase()
  if (REJECTION_KEYWORDS.some(kw => text.includes(kw))) return 'rejected'
  if (INTERVIEW_KEYWORDS.some(kw => text.includes(kw))) return 'under-review'
  return 'applied'
}

// Extract company name from email
const extractCompany = (from, subject, body) => {
  // Try from sender domain first — most reliable
  const domainMatch = from.match(/@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}/)
  if (domainMatch) {
    const domain = domainMatch[1]
    // Skip generic email providers
    const generic = ['gmail', 'yahoo', 'outlook', 'hotmail', 'greenhouse', 'lever', 'workday', 'taleo', 'icims', 'jobvite', 'smartrecruiters']
    if (!generic.includes(domain.toLowerCase())) {
      // Capitalize first letter of each word
      return domain.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }
  }

  // Try extracting from subject patterns like "Your application to [Company]"
  const subjectPatterns = [
    /application (?:to|at|for|with) ([A-Z][a-zA-Z\s&.,'-]{2,40})/i,
    /(?:thank you for applying to|applied to|applying at) ([A-Z][a-zA-Z\s&.,'-]{2,40})/i,
    /([A-Z][a-zA-Z\s&.,'-]{2,30}) (?:has received|received your)/i,
  ]

  for (const pattern of subjectPatterns) {
    const match = (subject + ' ' + body.slice(0, 500)).match(pattern)
    if (match) return match[1].trim()
  }

  // Extract from sender display name
  const nameMatch = from.match(/^([^<@]+)/)
  if (nameMatch) {
    const name = nameMatch[1].trim().replace(/"/g, '')
    if (name && !name.toLowerCase().includes('no-reply') && !name.toLowerCase().includes('noreply')) {
      return name.replace(/\s+(careers|jobs|recruiting|talent|hr|team)$/i, '').trim()
    }
  }

  return 'Unknown Company'
}

// Extract job role from email
const extractRole = (subject, body) => {
  const rolePatterns = [
    /(?:position|role|job|opportunity)(?:\s+of|\s+for|\s*:)\s+([A-Za-z\s,/-]{3,60}?)(?:\s+at|\s+with|\s*[,.]|\n)/i,
    /applied (?:for|to)(?: the)? ([A-Za-z\s,/-]{3,60}?)(?:\s+(?:position|role|job|opportunity)|\s+at|\s*[,.])/i,
    /([A-Za-z\s,/-]{3,60}?) (?:position|role|opening|opportunity)/i,
    /re:\s*(?:your application\s*[-–]\s*)?([A-Za-z\s,/-]{3,60})/i,
  ]

  const text = subject + '\n' + body.slice(0, 1000)
  for (const pattern of rolePatterns) {
    const match = text.match(pattern)
    if (match) {
      const role = match[1].trim()
      if (role.length > 2 && role.length < 80) return role
    }
  }

  // Fallback — clean up subject line
  const cleaned = subject
    .replace(/re:/gi, '')
    .replace(/application|received|confirmed|thank you|for your interest/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned.length > 2 ? cleaned : 'Unknown Role'
}

// Main parser — takes raw email data, returns structured application
const parseEmail = ({ id, from, subject, body, date }) => {
  if (!isJobEmail(subject, body)) return null

  return {
    company:       extractCompany(from, subject, body),
    role:          extractRole(subject, body),
    status:        detectStatus(subject, body),
    appliedDate:   new Date(date),
    sourceEmail:   id,
    autoDetected:  true,
    notes:         '',
  }
}

module.exports = { parseEmail, isJobEmail }