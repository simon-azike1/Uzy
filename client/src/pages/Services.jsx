import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Mail, Zap, BarChart2, Bell, Shield, Briefcase,
  ArrowRight, CheckCircle, Cpu, Calendar, Users, Star
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }
})

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }
})

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const CORE_SERVICES = [
  {
    icon: Mail,
    tag: 'Core Feature',
    title: 'Automatic Email Detection',
    desc: 'Connect your Gmail or Outlook account once via secure OAuth and Uzy does the rest. Every job application confirmation that lands in your inbox is instantly detected, parsed, and added to your dashboard — with zero manual input required.',
    points: [
      'Supports Gmail and Outlook via OAuth 2.0',
      'Detects confirmations from 500+ job platforms',
      'Extracts company, role, date, and job description',
      'Retroactively scans past emails on first connect',
    ],
    badge: 'Automated',
    badgeColor: '#C84B31',
  },
  {
    icon: Briefcase,
    tag: 'Core Feature',
    title: 'Centralized Dashboard',
    desc: 'All your applications — applied, under review, accepted, rejected — in one clean, real-time dashboard. Filter by company, role, industry, or priority. Sort by date or status. Archive old applications automatically.',
    points: [
      'Real-time status tracking across all applications',
      'Filter & sort by role, company, industry, priority',
      'Automatic archiving of inactive applications',
      'One-click status updates and notes',
    ],
    badge: 'Productivity',
    badgeColor: '#2D4263',
  },
  {
    icon: BarChart2,
    tag: 'Insights',
    title: 'Analytics & Performance Insights',
    desc: 'Understand your job search at a data level. Track how many applications you send per week, which roles get the most responses, and what patterns lead to success. Charts and graphs give you a clear visual picture of where you stand.',
    points: [
      'Monthly and weekly application volume charts',
      'Response rate breakdown by company and role type',
      'Success pattern identification',
      'Exportable reports for personal review',
    ],
    badge: 'Analytics',
    badgeColor: '#C84B31',
  },
  {
    icon: Bell,
    tag: 'Notifications',
    title: 'Smart Alerts & Follow-up Engine',
    desc: 'Uzy tracks time elapsed since each application and surfaces follow-up suggestions at exactly the right moment. Get deadline reminders, status change alerts, and action prompts — via email, push, or in-app.',
    points: [
      'Follow-up reminders based on application age',
      'Deadline alerts for application review dates',
      'Status change notifications in real time',
      'Daily digest of your job search activity',
    ],
    badge: 'Proactive',
    badgeColor: '#2D4263',
  },
]

const ADVANCED_SERVICES = [
  {
    icon: Cpu,
    title: 'AI Resume Feedback',
    desc: 'Upload your resume or cover letter and get role-specific improvement suggestions powered by AI. Understand what\'s working and what to sharpen.',
  },
  {
    icon: Calendar,
    title: 'Calendar Integration',
    desc: 'Sync application deadlines and interview dates directly to Google Calendar or Outlook. Never double-book or miss an interview again.',
  },
  {
    icon: Users,
    title: 'Collaborative Tracking',
    desc: 'Share your job search progress with a mentor, career coach, or accountability partner. Give view access without sharing your full account.',
  },
  {
    icon: Star,
    title: 'Priority & Goal Setting',
    desc: 'Set monthly application targets, mark dream companies as high priority, and track your progress toward your personal career goals.',
  },
  {
    icon: Shield,
    title: 'Privacy & Data Control',
    desc: 'Full control over your data at all times. Export everything, delete everything, or revoke email access — instantly, with one click.',
  },
  {
    icon: Zap,
    title: 'Instant Sync',
    desc: 'New application confirmed? It appears on your dashboard within seconds. Our webhook-powered sync means you\'re always up to date.',
  },
]

const COMPARISON = [
  { feature: 'Auto email detection',         uzy: true,  spreadsheet: false, others: false },
  { feature: 'Zero manual data entry',        uzy: true,  spreadsheet: false, others: false },
  { feature: 'Real-time dashboard',           uzy: true,  spreadsheet: false, others: true  },
  { feature: 'Analytics & response rates',    uzy: true,  spreadsheet: false, others: true  },
  { feature: 'Smart follow-up reminders',     uzy: true,  spreadsheet: false, others: false },
  { feature: 'AI resume feedback',            uzy: true,  spreadsheet: false, others: false },
  { feature: 'Calendar sync',                 uzy: true,  spreadsheet: false, others: true  },
  { feature: 'Free to start',                 uzy: true,  spreadsheet: true,  others: false },
]

export default function Services() {
  const { theme: t } = useTheme()

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${t.accent}44, transparent)` }} />

        <div className="max-w-6xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: t.accent }}>
            What We Offer
          </motion.p>
          <motion.h1 {...fadeUp(0.1)}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
            style={{ color: t.text }}>
            Every tool your<br />
            <span style={{ color: t.accent }}>job search needs.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: t.textMuted }}>
            From automatic application tracking to AI-powered resume feedback,
            Uzy gives you a complete professional toolkit — in one place.
          </motion.p>

          {/* Quick service pills */}
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-3">
            {['Email Detection', 'Dashboard', 'Analytics', 'Notifications', 'AI Feedback', 'Calendar Sync'].map(pill => (
              <span key={pill}
                className="px-4 py-2 rounded-full text-xs font-semibold border"
                style={{ background: t.surface, borderColor: t.border, color: t.textMuted }}>
                {pill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Core Services — alternating layout ── */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {CORE_SERVICES.map((service, i) => {
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={service.title}
                {...fadeUp(0.05)}
                className="rounded-3xl border overflow-hidden"
                style={{ background: t.surface, borderColor: t.border }}
              >
                <div className={`grid md:grid-cols-2 gap-0 ${isEven ? '' : 'md:[&>*:first-child]:order-2'}`}>

                  {/* Text side */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${t.accent}18` }}>
                        <service.icon size={18} style={{ color: t.accent }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ background: `${service.badgeColor}15`, color: service.badgeColor }}>
                        {service.badge}
                      </span>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: t.textFaint }}>
                      {service.tag}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4"
                      style={{ color: t.text }}>
                      {service.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: t.textMuted }}>
                      {service.desc}
                    </p>

                    <div className="space-y-2.5">
                      {service.points.map(point => (
                        <div key={point} className="flex items-start gap-2.5">
                          <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
                          <span className="text-sm" style={{ color: t.textMuted }}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual side */}
                  <div className="relative min-h-[280px] md:min-h-0 flex items-center justify-center p-8"
                    style={{ background: `${t.accent}06`, borderLeft: isEven ? `1px solid ${t.border}` : 'none', borderRight: !isEven ? `1px solid ${t.border}` : 'none' }}>
                    {/* Abstract visual */}
                    <div className="relative w-full max-w-xs">
                      <div className="absolute inset-0 rounded-2xl opacity-20"
                        style={{ background: `radial-gradient(circle at center, ${t.accent}, transparent 70%)` }} />

                      {/* Mock UI card */}
                      <div className="rounded-2xl border p-5 relative" style={{ background: t.surface, borderColor: t.border }}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ background: `${t.accent}22` }}>
                            <service.icon size={12} style={{ color: t.accent }} />
                          </div>
                          <div className="h-2.5 w-24 rounded-full" style={{ background: `${t.accent}33` }} />
                          <div className="ml-auto h-2 w-12 rounded-full" style={{ background: `${t.primary}33` }} />
                        </div>
                        <div className="space-y-2.5">
                          {[80, 60, 90, 45].map((w, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                                style={{ background: `${t.accent}18` }}>
                                <CheckCircle size={9} style={{ color: t.accent }} />
                              </div>
                              <div className="h-2 rounded-full flex-1" style={{ background: t.border, maxWidth: `${w}%` }}>
                                <div className="h-full rounded-full" style={{ width: '100%', background: `${t.accent}33` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 flex gap-2" style={{ borderTop: `1px solid ${t.border}` }}>
                          <div className="h-7 flex-1 rounded-lg" style={{ background: `${t.accent}22` }} />
                          <div className="h-7 w-16 rounded-lg" style={{ background: t.border }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Advanced / Optional Features ── */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>
              Advanced Features
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: t.text }}>
              Power tools for<br />serious job seekers.
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: t.textMuted }}>
              Available on Pro and Team plans — built for those who want an edge.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANCED_SERVICES.map((s, i) => (
              <motion.div key={s.title} {...fadeUp(i * 0.07)}
                className="rounded-2xl p-6 border transition-all duration-300"
                style={{ background: t.surface, borderColor: t.border }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = t.border
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${t.accent}15` }}>
                  <s.icon size={18} style={{ color: t.accent }} />
                </div>
                <h3 className="font-black text-base mb-2" style={{ color: t.text }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>
              Why Uzy
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: t.text }}>
              See the difference.
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: t.border }}>
            {/* Table header */}
            <div className="grid grid-cols-4 px-6 py-4 border-b"
              style={{ background: t.surface, borderColor: t.border }}>
              <div className="col-span-1" />
              {['Uzy', 'Spreadsheet', 'Others'].map((h, i) => (
                <div key={h} className="text-center">
                  <span className={`text-sm font-black ${i === 0 ? '' : ''}`}
                    style={{ color: i === 0 ? t.accent : t.textFaint }}>
                    {h}
                  </span>
                  {i === 0 && (
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${t.accent}22`, color: t.accent }}>★</span>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <motion.div key={row.feature} {...fadeUp(i * 0.04)}
                className="grid grid-cols-4 px-6 py-4 border-b last:border-b-0 transition-colors"
                style={{
                  borderColor: t.border,
                  background: i % 2 === 0 ? 'transparent' : `${t.primary}05`,
                }}>
                <div className="col-span-1 text-sm font-medium" style={{ color: t.textMuted }}>
                  {row.feature}
                </div>
                {[row.uzy, row.spreadsheet, row.others].map((val, j) => (
                  <div key={j} className="flex items-center justify-center">
                    {val ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: j === 0 ? `${t.accent}22` : `${t.primary}15` }}>
                        <CheckCircle size={13} style={{ color: j === 0 ? t.accent : t.textFaint }} />
                      </div>
                    ) : (
                      <div className="w-4 h-0.5 rounded-full" style={{ background: t.border }} />
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="rounded-3xl p-12 text-center border relative overflow-hidden"
            style={{ background: t.surface, borderColor: `${t.accent}33` }}>
            <div className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: `radial-gradient(ellipse at center, ${t.accent}07, transparent 70%)` }} />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.accent }}>
                Ready to start?
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: t.text }}>
                Everything you need.<br />Right now. For free.
              </h2>
              <p className="text-base mb-8" style={{ color: t.textMuted }}>
                Start with our free plan — no credit card, no time limit. Upgrade when you're ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold"
                  style={{ background: t.accent, color: '#ECDBBA' }}>
                  Start for free <ArrowRight size={16} />
                </Link>
                <Link to="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium border"
                  style={{ borderColor: t.border, color: t.textMuted }}>
                  Compare plans
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}