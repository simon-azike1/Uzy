import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, ChevronDown, ArrowRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: delay || 0, ease: [0.23, 1, 0.32, 1] },
})

const LAST_UPDATED = 'January 15, 2025'

const SECTIONS = [
  {
    id: 'overview',
    title: '1. Overview',
    content: [
      'Uzy ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our job application tracking platform.',
      'By using Uzy, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the platform.',
    ],
  },
  {
    id: 'collect',
    title: '2. Information We Collect',
    subsections: [
      {
        title: 'Account Information',
        items: [
          'Full name and email address provided during registration',
          'Encrypted password (we never store plain-text passwords)',
          'Profile preferences such as target roles, industries, and locations',
        ],
      },
      {
        title: 'Email Integration Data',
        items: [
          'We connect to your Gmail or Outlook account via OAuth 2.0',
          'We only read emails that match job application confirmation patterns',
          'We extract and store: company name, job role, application date, and job description snippets',
          'We never read, store, or process personal emails unrelated to job applications',
          'Your email password is never stored or accessible to us at any point',
        ],
      },
      {
        title: 'Usage Data',
        items: [
          'Pages visited and features used within the platform',
          'Device type, browser type, and operating system',
          'IP address and approximate geographic location',
          'Session timestamps and interaction logs for debugging purposes',
        ],
      },
    ],
  },
  {
    id: 'use',
    title: '3. How We Use Your Information',
    items: [
      'To provide, operate, and maintain the Uzy platform and its features',
      'To automatically detect and track job applications from your connected email',
      'To send you notifications, reminders, and follow-up suggestions',
      'To analyze usage patterns and improve the platform experience',
      'To respond to your support requests, questions, and feedback',
      'To send important service-related communications such as account updates',
      'To comply with legal obligations and enforce our Terms of Service',
    ],
  },
  {
    id: 'sharing',
    title: '4. Information Sharing',
    content: [
      'We do not sell, trade, or rent your personal information to third parties under any circumstances.',
      'We may share data with trusted service providers who assist in operating the platform, provided they agree to keep your information confidential. Current service providers include cloud hosting (AWS), analytics (anonymized only), and email delivery services.',
      'We may disclose information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights or prevent harm.',
    ],
  },
  {
    id: 'retention',
    title: '5. Data Retention',
    content: [
      'We retain your account data for as long as your account is active. If you delete your account, all associated personal data is permanently removed within 30 days.',
      'Email-derived application data is retained until you manually delete individual records or close your account.',
      'Anonymized, aggregated usage statistics may be retained indefinitely for product improvement purposes.',
    ],
  },
  {
    id: 'rights',
    title: '6. Your Rights',
    items: [
      'Access: Request a copy of all personal data we hold about you',
      'Correction: Request correction of inaccurate or incomplete data',
      'Deletion: Request permanent deletion of your account and all associated data',
      'Portability: Export your application data in CSV or JSON format at any time',
      'Objection: Object to certain types of data processing at any time',
      'Revocation: Revoke email access permissions at any time from account settings',
    ],
  },
  {
    id: 'security',
    title: '7. Security',
    content: [
      'We implement industry-standard security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, and regular security audits.',
      'Email access is handled exclusively through OAuth 2.0 — we never store, access, or transmit your email credentials.',
      'While we take all reasonable precautions, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and enable two-factor authentication.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies',
    content: [
      'We use essential cookies to maintain your session and authentication state. We also use analytics cookies (anonymized) to understand how users interact with the platform.',
      'You can control cookie preferences through your browser settings or our Cookie Preferences panel. Please see our Cookie Policy for full details.',
    ],
  },
  {
    id: 'children',
    title: '9. Children',
    content: [
      'Uzy is not intended for users under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will delete it.',
    ],
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. When we do, we will notify you via email and update the "Last Updated" date at the top of this page.',
      'Continued use of Uzy after changes are posted constitutes your acceptance of the revised policy.',
    ],
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: [
      'If you have questions about this Privacy Policy or wish to exercise your data rights, please contact our privacy team:',
    ],
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

export default function PrivacyPolicy() {
  const { theme: t } = useTheme()
  const [activeId, setActiveId] = useState('overview')

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
              <Shield size={18} style={{ color: t.accent }} />
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
            Privacy Policy
          </motion.h1>
          <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-4">
            <span
              className="text-sm px-3 py-1.5 rounded-full border font-medium"
              style={{ borderColor: t.border, color: t.textMuted, background: t.surface }}
            >
              Last updated: {LAST_UPDATED}
            </span>
            <Link
              to="/cookie-policy"
              className="text-sm font-bold flex items-center gap-1.5 transition-colors"
              style={{ color: t.accent }}
            >
              Cookie Policy
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
          <motion.div {...fadeUp(0.15)} className="md:col-span-3 space-y-10">

            {/* Intro banner */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: t.accent + '08', borderColor: t.accent + '22' }}
            >
              <p className="text-sm leading-relaxed font-medium" style={{ color: t.text }}>
                Your privacy matters deeply to us. This policy is written in plain language so you can understand exactly what we do with your data. If anything is unclear, please reach out at{' '}
                <a href="mailto:privacy@uzy.app" style={{ color: t.accent }}>privacy@uzy.app</a>.
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

                {section.content && section.content.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: t.textMuted }}>
                    {para}
                  </p>
                ))}

                {section.items && (
                  <ul className="space-y-2.5">
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

                {section.subsections && section.subsections.map((sub, si) => (
                  <div key={si} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-3" style={{ color: t.accent }}>
                      {sub.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {sub.items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-2.5">
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
                  </div>
                ))}

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
                      <p className="text-sm" style={{ color: t.textMuted }}>
                        Response time: Within 72 hours
                      </p>
                    </div>
                  </div>
                )}

              </div>
            ))}

          </motion.div>
        </div>
      </section>

    </div>
  )
}