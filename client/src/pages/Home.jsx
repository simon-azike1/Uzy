import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Mail, Zap, BarChart2, Bell,
  Shield, Briefcase, ChevronRight, Star, CheckCircle
} from 'lucide-react'
import HeroTitle from '../components/HeroTitle'
import { useTheme } from '../context/ThemeContext'

const FEATURES = [
  { icon: Mail,      title: 'Auto Email Detection',  desc: 'Link Gmail or Outlook and every application confirmation is captured instantly — no copy-pasting ever again.' },
  { icon: Zap,       title: 'Zero Manual Entry',     desc: 'Company name, role, date, and description extracted from emails automatically the moment they arrive.' },
  { icon: BarChart2, title: 'Insightful Analytics',  desc: 'See response rates, track trends over time, and understand exactly where your job search stands.' },
  { icon: Bell,      title: 'Smart Notifications',   desc: 'Never miss a follow-up. Get deadline reminders, status updates, and action suggestions at the right time.' },
  { icon: Shield,    title: 'Private & Secure',      desc: 'Your data stays yours. OAuth-based email access — we never store your passwords.' },
  { icon: Briefcase, title: 'All-in-One Dashboard',  desc: 'Applied, Under Review, Accepted, Rejected — every application organized in one clean place.' },
]

const TESTIMONIALS = [
  { name: 'Simon',    role: 'Software Engineer', text: 'I applied to 60+ jobs in a month. Without Uzy I would have lost track of half of them. Game changer.', stars: 5 },
  { name: 'Joseph',   role: 'Product Designer',  text: 'The auto-detection is scary good. It picked up every single confirmation email I had, even old ones.',  stars: 5 },
  { name: 'Kayode',   role: 'Data Analyst',      text: "The analytics alone are worth it. I could see exactly which roles were getting responses and which weren't.", stars: 5 },
]

const STATS = [
  { value: '0+', label: 'Applications Tracked' },
  { value: '0%',     label: 'Auto-Detection Rate'  },
  { value: '0+',  label: 'Active Users'         },
  { value: '0★',    label: 'Average Rating'       },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] }
})





export default function Home() {
  const { theme: t } = useTheme()

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(/background-image..png)' }}>
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0.1)}>
            <HeroTitle t={t} />
            </motion.div>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base"
              style={{ background: t.accent, color: '#ECDBBA' }}>
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium text-base border"
              style={{ borderColor: t.border, color: t.textMuted, background: t.surface }}>
              See how it works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y" style={{ borderColor: t.border }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp(i * 0.07)} className="text-center">
              <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: t.accent }}>{stat.value}</p>
              <p className="text-sm" style={{ color: t.textMuted }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: t.text }}>
              Everything you need.<br />Nothing you don't.
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: t.textMuted }}>
              Built for job seekers who are serious about their search.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.07)}
                className="rounded-2xl p-6 border transition-all duration-300"
                style={{ background: t.surface, borderColor: t.border }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${t.accent}18` }}>
                  <f.icon size={18} style={{ color: t.accent }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: t.text }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: t.text }}>
              Up and running in minutes.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up in under 30 seconds. No credit card. No setup fees.' },
              { step: '02', title: 'Connect your inbox',  desc: 'Link Gmail or Outlook via secure OAuth. We scan for job confirmations automatically.' },
              { step: '03', title: 'Watch it fill up',    desc: 'Your dashboard populates in real time as applications are detected and organized.' },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp(i * 0.1)} className="relative">
                <div className="text-6xl font-black mb-4 leading-none select-none"
                  style={{ color: `${t.accent}22` }}>{item.step}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: t.text }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{item.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 -right-4">
                  <ChevronRight size={20} style={{ color: t.textFaint }} />
                </div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: t.text }}>
              Real people. Real results.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((item, i) => (
              <motion.div key={item.name} {...fadeUp(i * 0.1)}
                className="rounded-2xl p-6 border" style={{ background: t.surface, borderColor: t.border }}>
                <div className="flex gap-0.5 mb-4">
                  {Array(item.stars).fill(0).map((_, j) => (
                    <Star key={j} size={13} fill={t.accent} style={{ color: t.accent }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: t.textMuted }}>"{item.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: `${t.accent}22`, color: t.accent }}>{item.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: t.text }}>{item.name}</p>
                    <p className="text-xs" style={{ color: t.textFaint }}>{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}