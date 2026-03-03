import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Cookie, Check, X, ArrowRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: delay || 0, ease: [0.23, 1, 0.32, 1] },
})

const LAST_UPDATED = 'January 15, 2025'

const COOKIE_TYPES = [
  {
    name: 'Essential Cookies',
    tag: 'Always Active',
    tagColor: '#25D366',
    canDisable: false,
    desc: 'These cookies are required for the platform to function. They enable core features like authentication, session management, and security. Without them, Uzy cannot operate.',
    examples: [
      { name: 'auth_token', purpose: 'Keeps you logged in securely across sessions', duration: 'Session' },
      { name: 'csrf_token', purpose: 'Prevents cross-site request forgery attacks', duration: 'Session' },
      { name: 'session_id', purpose: 'Identifies your current browsing session', duration: 'Session' },
    ],
  },
  {
    name: 'Functional Cookies',
    tag: 'Optional',
    tagColor: '#C84B31',
    canDisable: true,
    desc: 'These cookies remember your preferences and settings, such as your dark/light mode choice, language, and dashboard layout. Disabling them means these preferences will reset each visit.',
    examples: [
      { name: 'theme_pref', purpose: 'Remembers your dark or light mode preference', duration: '1 year' },
      { name: 'dashboard_layout', purpose: 'Saves your custom dashboard column order', duration: '6 months' },
      { name: 'notification_prefs', purpose: 'Stores your notification settings', duration: '1 year' },
    ],
  },
  {
    name: 'Analytics Cookies',
    tag: 'Optional',
    tagColor: '#C84B31',
    canDisable: true,
    desc: 'These cookies help us understand how users interact with Uzy. All data is anonymized and aggregated — we cannot identify individual users from analytics data. This helps us improve the product.',
    examples: [
      { name: '_uzy_analytics', purpose: 'Tracks anonymized page views and feature usage', duration: '90 days' },
      { name: '_session_count', purpose: 'Counts number of sessions for retention analysis', duration: '1 year' },
    ],
  },
]

const SECTIONS = [
  {
    id: 'what',
    title: '1. What Are Cookies',
    content: 'Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to site owners. Uzy uses cookies exclusively to improve your experience and keep the platform secure.',
  },
  {
    id: 'types',
    title: '2. Types of Cookies We Use',
    component: 'cookie-table',
  },
  {
    id: 'third-party',
    title: '3. Third-Party Cookies',
    content: 'Uzy does not allow third-party advertising cookies on our platform. We use a limited number of trusted third-party service cookies for infrastructure purposes only. These providers are contractually bound to use data solely for the services they provide to us.',
    items: [
      'AWS CloudFront — CDN and content delivery (session only)',
      'Sentry — Anonymized error tracking for debugging (30 days)',
    ],
  },
  {
    id: 'control',
    title: '4. How to Control Cookies',
    content: 'You have full control over non-essential cookies. You can manage your preferences at any time:',
    items: [
      'Use the cookie preferences panel in your account settings',
      'Adjust settings directly in your browser (Chrome, Firefox, Safari, Edge)',
      'Use browser extensions designed for cookie management',
    ],
    note: 'Note: Disabling essential cookies will prevent Uzy from functioning correctly. We recommend keeping them enabled.',
  },
  {
    id: 'retention',
    title: '5. Cookie Retention',
    content: 'Session cookies are deleted automatically when you close your browser. Persistent cookies remain on your device for the duration specified in the table above, or until you clear them manually. You can clear all cookies at any time through your browser settings.',
  },
  {
    id: 'updates',
    title: '6. Updates to This Policy',
    content: 'We may update this Cookie Policy when we add new features or change how we use cookies. We will notify you of significant changes via email or an in-app notice. Continued use of Uzy after changes are posted constitutes your acceptance.',
  },
  {
    id: 'contact',
    title: '7. Questions',
    content: 'For any questions about our use of cookies, please contact us at:',
    contact: true,
  },
]

const TableOfContents = ({ sections, activeId, onSelect, t }) => (
  <div className="rounded-2xl border p-5 sticky top-24" style={{ background: t.surface, borderColor: t.border }}>
    <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: t.accent }}>
      Contents
    </p>
    <div className="space-y-1">
      {sections.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="w-full text-left text-sm px-3 py-2 rounded-xl transition-all"
          style={{
            color: activeId === s.id ? t.accent : t.textMuted,
            background: activeId === s.id ? t.accent + '12' : 'transparent',
            fontWeight: activeId === s.id ? '700' : '400',
          }}
        >
          {s.title}
        </button>
      ))}
    </div>
  </div>
)

const CookieTable = ({ type, t }) => (
  <div
    className="rounded-2xl border overflow-hidden mb-6 last:mb-0"
    style={{ borderColor: t.border }}
  >
    <div
      className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
      style={{ background: t.surfaceHigh }}
    >
      <div className="flex items-center gap-3">
        <h3 className="font-black text-base" style={{ color: t.text }}>
          {type.name}
        </h3>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: type.tagColor + '18', color: type.tagColor }}
        >
          {type.tag}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: type.canDisable ? t.textFaint : '#25D366' }}>
        {type.canDisable ? (
          <>
            <X size={13} style={{ color: '#C84B31' }} />
            Can be disabled
          </>
        ) : (
          <>
            <Check size={13} style={{ color: '#25D366' }} />
            Required
          </>
        )}
      </div>
    </div>
    <div className="px-6 py-4 border-t" style={{ borderColor: t.border, background: t.surface }}>
      <p className="text-sm leading-relaxed mb-5" style={{ color: t.textMuted }}>
        {type.desc}
      </p>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: t.border }}>
        <div
          className="grid grid-cols-3 px-4 py-2.5 text-xs font-black uppercase tracking-wider"
          style={{ background: t.surfaceHigh, color: t.textFaint }}
        >
          <span>Cookie Name</span>
          <span>Purpose</span>
          <span>Duration</span>
        </div>
        {type.examples.map((ex, i) => (
          <div
            key={ex.name}
            className="grid grid-cols-3 px-4 py-3 border-t text-sm"
            style={{
              borderColor: t.border,
              background: i % 2 === 0 ? 'transparent' : t.surfaceHigh + '44',
            }}
          >
            <span className="font-mono font-bold text-xs" style={{ color: t.accent }}>
              {ex.name}
            </span>
            <span style={{ color: t.textMuted }}>{ex.purpose}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit h-fit"
              style={{ background: t.accent + '12', color: t.accent }}
            >
              {ex.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function CookiePolicy() {
  const { theme: t } = useTheme()
  const [activeId, setActiveId] = useState('what')

  const scrollTo = (id) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, ' + t.accent + '44, transparent)' }}
        />
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: t.accent + '18' }}
            >
              <Cookie size={18} style={{ color: t.accent }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.accent }}>
              Legal
            </p>
          </motion.div>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4"
            style={{ color: t.text }}
          >
            Cookie Policy
          </motion.h1>
          <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-4">
            <span
              className="text-sm px-3 py-1.5 rounded-full border font-medium"
              style={{ borderColor: t.border, color: t.textMuted, background: t.surface }}
            >
              Last updated: {LAST_UPDATED}
            </span>
            <Link
              to="/privacy-policy"
              className="text-sm font-bold flex items-center gap-1.5"
              style={{ color: t.accent }}
            >
              Privacy Policy
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10">

          {/* Table of contents */}
          <motion.div {...fadeUp(0.1)} className="hidden md:block md:col-span-1">
            <TableOfContents
              sections={SECTIONS}
              activeId={activeId}
              onSelect={scrollTo}
              t={t}
            />
          </motion.div>

          {/* Main content */}
          <motion.div {...fadeUp(0.15)} className="md:col-span-3 space-y-8">

            {/* Intro banner */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: t.accent + '08', borderColor: t.accent + '22' }}
            >
              <p className="text-sm leading-relaxed font-medium" style={{ color: t.text }}>
                We use cookies to keep Uzy secure, remember your preferences, and improve your experience. We do not use advertising or tracking cookies. This policy explains exactly what we use and why.
              </p>
            </div>

            {/* Sections */}
            {SECTIONS.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="rounded-2xl border p-8 scroll-mt-28"
                style={{ background: t.surface, borderColor: t.border }}
              >
                <h2 className="text-xl font-black mb-5" style={{ color: t.text }}>
                  {section.title}
                </h2>

                {section.component === 'cookie-table' && (
                  <div>
                    {COOKIE_TYPES.map(type => (
                      <CookieTable key={type.name} type={type} t={t} />
                    ))}
                  </div>
                )}

                {section.content && section.component !== 'cookie-table' && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: t.textMuted }}>
                    {section.content}
                  </p>
                )}

                {section.items && (
                  <ul className="space-y-2.5 mb-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ background: t.accent }}
                        />
                        <span className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <div
                    className="rounded-xl p-4 border mt-4"
                    style={{ background: t.accent + '08', borderColor: t.accent + '22' }}
                  >
                    <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                      {section.note}
                    </p>
                  </div>
                )}

                {section.contact && (
                  <div
                    className="mt-4 rounded-xl p-5 border"
                    style={{ background: t.surfaceHigh, borderColor: t.border }}
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-bold" style={{ color: t.text }}>Uzy Privacy Team</p>
                      <p className="text-sm" style={{ color: t.textMuted }}>
                        Email:{' '}
                        <a href="mailto:privacy@uzy.app" className="font-medium" style={{ color: t.accent }}>
                          privacy@uzy.app
                        </a>
                      </p>
                      <p className="text-sm" style={{ color: t.textMuted }}>
                        Address: Casablanca, Morocco
                      </p>
                    </div>
                  </div>
                )}

              </div>
            ))}

            {/* Footer note */}
            <div
              className="rounded-2xl p-6 border text-center"
              style={{ background: t.surface, borderColor: t.border }}
            >
              <p className="text-sm mb-4" style={{ color: t.textMuted }}>
                Want to understand how we handle your personal data beyond cookies?
              </p>
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                style={{ background: t.accent + '15', color: t.accent }}
                onMouseEnter={e => { e.currentTarget.style.background = t.accent + '25' }}
                onMouseLeave={e => { e.currentTarget.style.background = t.accent + '15' }}
              >
                Read our Privacy Policy
                <ArrowRight size={13} />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

    </div>
  )
}