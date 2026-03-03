import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle, XCircle, ArrowRight, Zap,
  Shield, Users, HelpCircle, ChevronDown
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }
})

// ─── Plans ────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name:        'Free',
    tagline:     'Everything you need to get started.',
    monthly:     0,
    yearly:      0,
    highlight:   false,
    badge:       null,
    cta:         'Get started free',
    ctaTo:       '/register',
    features: [
      { text: 'Up to 30 tracked applications',     included: true  },
      { text: 'Auto email detection (Gmail)',       included: true  },
      { text: 'Real-time dashboard',               included: true  },
      { text: 'Status & priority management',      included: true  },
      { text: 'Basic analytics',                   included: true  },
      { text: 'Email notifications',               included: true  },
      { text: 'Unlimited applications',            included: false },
      { text: 'Advanced analytics & exports',      included: false },
      { text: 'AI resume feedback',                included: false },
      { text: 'Calendar sync',                     included: false },
      { text: 'Outlook integration',               included: false },
      { text: 'Priority support',                  included: false },
    ],
  },
  {
    name:        'Pro',
    tagline:     'For serious job seekers who want every advantage.',
    monthly:     9,
    yearly:      7,
    highlight:   true,
    badge:       'Most Popular',
    cta:         'Start Pro free trial',
    ctaTo:       '/register',
    features: [
      { text: 'Unlimited tracked applications',    included: true  },
      { text: 'Auto email detection (Gmail)',       included: true  },
      { text: 'Real-time dashboard',               included: true  },
      { text: 'Status & priority management',      included: true  },
      { text: 'Advanced analytics & exports',      included: true  },
      { text: 'Email & push notifications',        included: true  },
      { text: 'Outlook integration',               included: true  },
      { text: 'AI resume & cover letter feedback', included: true  },
      { text: 'Calendar sync (Google & Outlook)',  included: true  },
      { text: 'Follow-up automation suggestions',  included: true  },
      { text: 'Collaborative sharing (1 person)',  included: false },
      { text: 'Priority support',                  included: false },
    ],
  },
  {
    name:        'Team',
    tagline:     'For career coaches and job search groups.',
    monthly:     24,
    yearly:      19,
    highlight:   false,
    badge:       null,
    cta:         'Contact us',
    ctaTo:       '/contact',
    features: [
      { text: 'Everything in Pro',                 included: true  },
      { text: 'Up to 5 user accounts',             included: true  },
      { text: 'Collaborative sharing & review',    included: true  },
      { text: 'Team-wide analytics dashboard',     included: true  },
      { text: 'Goal setting & progress tracking',  included: true  },
      { text: 'Coach / mentor access controls',    included: true  },
      { text: 'Bulk application import',           included: true  },
      { text: 'White-label ready (on request)',    included: true  },
      { text: 'Dedicated account manager',         included: true  },
      { text: 'SLA-backed priority support',       included: true  },
      { text: 'Custom integrations',               included: false },
      { text: 'Enterprise SSO',                    included: false },
    ],
  },
]

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. The Free plan has no time limit and no credit card required. You can use Uzy free indefinitely with up to 30 tracked applications.',
  },
  {
    q: 'How does the Pro free trial work?',
    a: 'You get 14 days of full Pro access when you register. No credit card needed to start. At the end of the trial, you choose to upgrade or stay on the Free plan.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Absolutely. Upgrade or downgrade at any time. If you downgrade mid-cycle, you keep Pro access until the end of your billing period.',
  },
  {
    q: 'What email providers are supported?',
    a: 'Gmail is supported on all plans. Outlook integration is available on Pro and Team plans. More providers are on our roadmap.',
  },
  {
    q: 'Is my email data secure?',
    a: 'We use OAuth 2.0 — meaning we never store your email password. We only read job-related confirmation emails, and you can revoke access at any time from your account settings.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. If you\'re not satisfied within the first 30 days of a paid plan, we\'ll issue a full refund — no questions asked.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Pricing() {
  const { theme: t } = useTheme()
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${t.accent}44, transparent)` }} />

        <div className="max-w-3xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: t.accent }}>
            Pricing
          </motion.p>
          <motion.h1 {...fadeUp(0.1)}
            className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5"
            style={{ color: t.text }}>
            Simple, transparent<br />
            <span style={{ color: t.accent }}>pricing.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg leading-relaxed mb-10"
            style={{ color: t.textMuted }}>
            Start free. Upgrade when you need more.
            No hidden fees, no surprise charges.
          </motion.p>

          {/* Billing toggle */}
          <motion.div {...fadeUp(0.3)} className="inline-flex items-center gap-4 p-1.5 rounded-2xl border"
            style={{ background: t.surface, borderColor: t.border }}>
            <button
              onClick={() => setYearly(false)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: !yearly ? t.accent : 'transparent',
                color: !yearly ? '#ECDBBA' : t.textMuted,
              }}>
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              style={{
                background: yearly ? t.accent : 'transparent',
                color: yearly ? '#ECDBBA' : t.textMuted,
              }}>
              Yearly
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: yearly ? '#ECDBBA33' : `${t.accent}22`, color: yearly ? '#ECDBBA' : t.accent }}>
                -22%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                {...fadeUp(i * 0.1)}
                className="rounded-3xl border overflow-hidden transition-all duration-300 relative"
                style={{
                  background: plan.highlight ? t.primary : t.surface,
                  borderColor: plan.highlight ? t.accent : t.border,
                  transform: plan.highlight ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: plan.highlight ? `0 0 40px ${t.accent}20` : 'none',
                }}>

                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="px-4 py-1 text-xs font-black uppercase tracking-widest rounded-b-xl"
                      style={{ background: t.accent, color: '#ECDBBA' }}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="p-8 pt-10">
                  {/* Plan name */}
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: plan.highlight ? '#ECDBBA88' : t.textFaint }}>
                    {plan.name}
                  </p>
                  <p className="text-sm mb-6 leading-snug"
                    style={{ color: plan.highlight ? '#ECDBBAcc' : t.textMuted }}>
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-1.5 mb-8">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={yearly ? 'yearly' : 'monthly'}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-5xl font-black leading-none"
                        style={{ color: plan.highlight ? '#ECDBBA' : t.text }}>
                        {plan.monthly === 0 ? 'Free' : `$${yearly ? plan.yearly : plan.monthly}`}
                      </motion.span>
                    </AnimatePresence>
                    {plan.monthly > 0 && (
                      <span className="text-sm mb-1.5" style={{ color: plan.highlight ? '#ECDBBA66' : t.textFaint }}>
                        / mo
                      </span>
                    )}
                  </div>

                  {yearly && plan.monthly > 0 && (
                    <p className="text-xs mb-6 -mt-5" style={{ color: plan.highlight ? '#ECDBBA66' : t.textFaint }}>
                      Billed annually — save ${(plan.monthly - plan.yearly) * 12}/yr
                    </p>
                  )}

                  {/* CTA */}
                  <Link to={plan.ctaTo}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all mb-8"
                    style={{
                      background: plan.highlight ? t.accent : `${t.accent}15`,
                      color: plan.highlight ? '#ECDBBA' : t.accent,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    {plan.cta} <ArrowRight size={14} />
                  </Link>

                  {/* Divider */}
                  <div className="border-t mb-6"
                    style={{ borderColor: plan.highlight ? '#ECDBBA15' : t.border }} />

                  {/* Feature list */}
                  <div className="space-y-3">
                    {plan.features.map(f => (
                      <div key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <CheckCircle size={14} className="mt-0.5 shrink-0"
                            style={{ color: plan.highlight ? t.accent : t.accent }} />
                        ) : (
                          <XCircle size={14} className="mt-0.5 shrink-0 opacity-30"
                            style={{ color: plan.highlight ? '#ECDBBA' : t.textFaint }} />
                        )}
                        <span className="text-sm"
                          style={{
                            color: f.included
                              ? plan.highlight ? '#ECDBBAdd' : t.textMuted
                              : plan.highlight ? '#ECDBBA44' : t.textFaint,
                          }}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <motion.div {...fadeUp(0.3)}
            className="flex flex-wrap items-center justify-center gap-8 mt-12">
            {[
              { icon: Shield, text: '14-day free trial on Pro' },
              { icon: Zap,    text: 'No credit card to start'  },
              { icon: Users,  text: 'Cancel anytime'           },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm"
                style={{ color: t.textFaint }}>
                <Icon size={14} style={{ color: t.accent }} />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Feature comparison — full table ── */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>
              Full Comparison
            </p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: t.text }}>
              What's included in each plan.
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: t.border }}>
            {/* Header */}
            <div className="grid grid-cols-4 px-6 py-4 border-b"
              style={{ background: t.surface, borderColor: t.border }}>
              <div />
              {PLANS.map((plan, i) => (
                <div key={plan.name} className="text-center">
                  <p className="text-sm font-black"
                    style={{ color: i === 1 ? t.accent : t.text }}>{plan.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: t.textFaint }}>
                    {plan.monthly === 0 ? 'Free' : `from $${plan.yearly}/mo`}
                  </p>
                </div>
              ))}
            </div>

            {/* Category rows */}
            {[
              {
                category: 'Core Tracking',
                rows: [
                  { label: 'Applications',           values: ['30 max', 'Unlimited', 'Unlimited'] },
                  { label: 'Auto email detection',   values: ['Gmail only', 'Gmail + Outlook', 'Gmail + Outlook'] },
                  { label: 'Dashboard',              values: [true, true, true] },
                  { label: 'Status management',      values: [true, true, true] },
                ],
              },
              {
                category: 'Analytics',
                rows: [
                  { label: 'Basic analytics',        values: [true, true, true]   },
                  { label: 'Advanced analytics',     values: [false, true, true]  },
                  { label: 'Data export',            values: [false, true, true]  },
                ],
              },
              {
                category: 'Automation',
                rows: [
                  { label: 'Follow-up suggestions',  values: [false, true, true]  },
                  { label: 'Calendar sync',          values: [false, true, true]  },
                  { label: 'AI resume feedback',     values: [false, true, true]  },
                ],
              },
              {
                category: 'Team & Support',
                rows: [
                  { label: 'Collaborative sharing',  values: [false, '1 person', '5 users'] },
                  { label: 'Priority support',       values: [false, false, true]           },
                  { label: 'Account manager',        values: [false, false, true]           },
                ],
              },
            ].map((group, gi) => (
              <div key={group.category}>
                <div className="px-6 py-2.5 border-b"
                  style={{ background: `${t.accent}08`, borderColor: t.border }}>
                  <p className="text-xs font-black uppercase tracking-widest"
                    style={{ color: t.accent }}>{group.category}</p>
                </div>
                {group.rows.map((row, ri) => (
                  <div key={row.label}
                    className="grid grid-cols-4 px-6 py-3.5 border-b last:border-b-0"
                    style={{
                      borderColor: t.border,
                      background: ri % 2 === 0 ? 'transparent' : `${t.primary}04`,
                    }}>
                    <p className="text-sm" style={{ color: t.textMuted }}>{row.label}</p>
                    {row.values.map((val, vi) => (
                      <div key={vi} className="flex items-center justify-center">
                        {val === true ? (
                          <CheckCircle size={15} style={{ color: vi === 1 ? t.accent : t.textFaint }} />
                        ) : val === false ? (
                          <div className="w-4 h-0.5 rounded-full" style={{ background: t.border }} />
                        ) : (
                          <span className="text-xs font-semibold text-center"
                            style={{ color: vi === 1 ? t.accent : t.textMuted }}>{val}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: t.accent }}>FAQ</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: t.text }}>
              Questions answered.
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={faq.q} {...fadeUp(i * 0.05)}
                className="rounded-2xl border overflow-hidden transition-all"
                style={{ background: t.surface, borderColor: openFaq === i ? `${t.accent}66` : t.border }}>
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-bold text-sm pr-4" style={{ color: t.text }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} style={{ color: t.textFaint, flexShrink: 0 }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
                      <div className="px-6 pb-5 border-t" style={{ borderColor: t.border }}>
                        <p className="text-sm leading-relaxed pt-4" style={{ color: t.textMuted }}>
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)} className="text-center mt-12">
            <p className="text-sm mb-3" style={{ color: t.textMuted }}>
              Still have questions?
            </p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl border transition-all"
              style={{ borderColor: t.border, color: t.text, background: t.surface }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text }}>
              <HelpCircle size={15} /> Contact support
            </Link>
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
                No risk. All reward.
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: t.text }}>
                Start free today.<br />Upgrade when ready.
              </h2>
              <p className="text-base mb-8" style={{ color: t.textMuted }}>
                No credit card. No commitment. Just a better job search.
              </p>
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold"
                style={{ background: t.accent, color: '#ECDBBA' }}>
                Create free account <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}