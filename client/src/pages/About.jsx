// client/src/pages/About.jsx

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Target, Heart, Lightbulb, Shield,
  Users, TrendingUp, ArrowRight, Quote
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

const VALUES = [
  {
    icon: Target,
    title: 'Precision',
    desc: 'Every feature we build solves a specific, real problem. We cut the noise so our users can focus on what matters , getting hired.',
  },
  {
    icon: Shield,
    title: 'Trust',
    desc: 'We handle sensitive career data. Our commitment to privacy and security is non-negotiable, not a marketing checkbox.',
  },
  {
    icon: Lightbulb,
    title: 'Simplicity',
    desc: 'Powerful tools don\'t need to be complicated. We obsess over reducing friction until using Uzy feels completely natural.',
  },
  {
    icon: Heart,
    title: 'Empathy',
    desc: 'Job searching is stressful. We build with that in mind , every decision is filtered through the lens of the person applying.',
  },
]

const TEAM_PREVIEW = [
  { name: 'Azike Simon S.', role: 'Founder & CEO',      initial: 'S', color: '#C84B31' },
  { name: 'Marcelina Kehinde A.',    role: 'Head of Product',     initial: 'T', color: '#2D4263' },
  { name: 'Quadri Kobiowu K.',   role: 'Lead Engineer',       initial: 'K', color: '#C84B31' },
  { name: 'Adegoke Julius A.',   role: 'Design Lead',         initial: 'A', color: '#2D4263' },
]

const MILESTONES = [
  { year: '2026', event: 'Uzy founded after a frustrating 12-month job search with 80+ applications lost in spreadsheets.' },
  { year: 'Early 2030', event: 'First 100 users onboarded. Email auto-detection accuracy reached 91%.' },
  { year: 'Mid 2034', event: 'Launched analytics dashboard. User base grew to 1,200 active job seekers.' },
  { year: '2040', event: 'Crossed 3,400 users. AI-powered feedback and calendar sync released.' },
]

export default function About() {
  const { theme: t } = useTheme()

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.accent}44, transparent)` }} />
        <div className="absolute left-0 top-32 bottom-0 w-px ml-6 md:ml-24 opacity-20" style={{ background: t.accent }} />

        <div className="max-w-6xl mx-auto">
          <div className="md:pl-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.accent }}>
              About Uzy
            </motion.p>

            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-8 max-w-3xl"
              style={{ color: t.text }}>
              We're on a mission to take the chaos out of job searching.
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-lg max-w-2xl leading-relaxed" style={{ color: t.textMuted }}>
              Uzy was built by people who've been through grueling job searches — and survived them.
              We know exactly what it feels like to lose track of applications, miss follow-ups,
              and wonder where things stand. So we built the tool we wish we'd had.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Why we built Uzy ── */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left — quote block */}
            <motion.div {...fadeLeft(0)} className="relative">
              <div className="absolute -top-4 -left-4 opacity-10">
                <Quote size={80} style={{ color: t.accent }} />
              </div>
              <div className="rounded-3xl p-8 border relative" style={{ background: t.surface, borderColor: `${t.accent}33` }}>
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${t.accent}06, transparent 60%)` }} />
                <p
                 className="text-xl md:text-2xl font-bold italic leading-snug relative"
                style={{ color: t.text }}>
                "I applied to 1,000 companies over eight months while finishing my degree as a software engineer. I tracked them in my head, in scattered emails, and in a Google Sheet I kept forgetting to update. I missed two follow-ups. That’s when I knew there had to be a better way — and Uzy was born."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                    style={{ background: `${t.accent}22`, color: t.accent }}>Y</div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: t.text }}>Simon A.</p>
                    <p className="text-xs" style={{ color: t.textFaint }}>Founder, Uzy</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — story text */}
            <motion.div {...fadeUp(0.15)} className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.accent }}>Why We Built This</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: t.text }}>
                Born from a real problem.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>
                The average job seeker applies to over 50 companies per search. That's 50 different
                timelines, 50 sets of contact names, 50 follow-up deadlines , all living in scattered
                emails, notes apps, and half-finished spreadsheets.
              </p>
              <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>
                We built Uzy to be the single source of truth for your job search. Connect your inbox
                once, and every application you send is automatically captured, organized, and tracked
             , without you lifting a finger.
              </p>
              <Link to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold pt-2 transition-colors"
                style={{ color: t.accent }}>
                See how it works <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <motion.div {...fadeUp(0)} className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.accent }}>Our Mission</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: t.text }}>
                Give every job seeker a professional advantage.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>
                Top candidates don't just apply more, they apply smarter. They know which companies
                have responded, which roles are worth following up on, and where they stand at every
                stage of the process.
              </p>
              <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>
                Uzy's mission is to give every job seeker , regardless of background or experience ,
                the same clarity and control that previously only came from expensive career coaches
                or meticulous manual tracking.
              </p>
            </motion.div>

            {/* Right — stat cards */}
            <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 gap-4">
              {[
                { icon: Users,      value: '00', label: 'Active Users',         color: t.accent },
                { icon: TrendingUp, value: '0%',    label: 'Detection Accuracy',   color: t.primary },
                { icon: Target,     value: '0',    label: 'Avg Apps Per Search',  color: t.primary },
                { icon: Heart,      value: '0 ★',   label: 'User Satisfaction',    color: t.accent },
              ].map((stat, i) => (
                <motion.div key={stat.label} {...fadeUp(i * 0.07)}
                  className="rounded-2xl p-5 border text-center" style={{ background: t.surface, borderColor: t.border }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${stat.color}18` }}>
                    <stat.icon size={16} style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-black mb-1" style={{ color: t.text }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: t.textFaint }}>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Story / Timeline ── */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Our Story</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: t.text }}>
              From frustration<br />to product.
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: `${t.accent}22` }} />

            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <motion.div key={m.year} {...fadeLeft(i * 0.1)} className="flex gap-8 relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10"
                    style={{ background: t.bg, borderColor: t.accent }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: t.accent }} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: t.accent }}>
                      {m.year}
                    </p>
                    <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Our Values</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: t.text }}>
              What we stand for.
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: t.textMuted }}>
              These aren't words on a wall, they're the filters every product and business decision
              passes through.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.08)}
                className="rounded-2xl p-6 border group transition-all duration-300"
                style={{ background: t.surface, borderColor: t.border }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = t.border
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${t.accent}18` }}>
                  <v.icon size={18} style={{ color: t.accent }} />
                </div>
                <h3 className="font-black text-lg mb-3" style={{ color: t.text }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Preview ── */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>The Team</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: t.text }}>
                The people<br />behind Uzy.
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)}>
              <Link to="/team"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border transition-all"
                style={{ borderColor: t.border, color: t.textMuted, background: t.surface }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted }}>
                Meet the full team <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TEAM_PREVIEW.map((member, i) => (
              <motion.div key={member.name} {...fadeUp(i * 0.08)}
                className="rounded-2xl p-6 border text-center group transition-all duration-300"
                style={{ background: t.surface, borderColor: t.border }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 transition-transform group-hover:scale-105"
                  style={{ background: `${member.color}22`, color: member.color, border: `2px solid ${member.color}33` }}>
                  {member.initial}
                </div>
                <p className="font-bold text-sm mb-1" style={{ color: t.text }}>{member.name}</p>
                <p className="text-xs" style={{ color: t.textFaint }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className=" p-12 border text-center relative overflow-hidden"
            style={{ background: t.surface, borderColor: `${t.accent}33` }}>
            <div className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: `radial-gradient(ellipse at center, ${t.accent}07, transparent 70%)` }} />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.accent }}>
                Join Us
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: t.text }}>
                Ready to take control<br />of your job search?
              </h2>
              <p className="text-base mb-8" style={{ color: t.textMuted }}>
                Create your free account today and never lose track of an application again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base"
                  style={{ background: t.accent, color: '#ECDBBA' }}>
                  Get started free <ArrowRight size={16} />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium border"
                  style={{ borderColor: t.border, color: t.textMuted }}>
                  Get in touch
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}