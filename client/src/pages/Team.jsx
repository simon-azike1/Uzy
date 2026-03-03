import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Linkedin, MessageCircle, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] },
})

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] },
})

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] },
})

const TEAM = [
    {
        name: 'Azike Simon S.',
        role: 'Founder & CEO',
        tag: 'Product & Vision',
        bio: 'Simon built the first version of Uzy after struggling to track hundreds of job applications during his degree program. He now leads product strategy, vision, and growth.',
        quote: 'The job search process is broken for candidates. We are here to fix our side of it.',
        avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQGH49VTeTOyZQ/profile-displayphoto-crop_800_800/B4EZwLfj1IIMAI-/0/1769719359083?e=1773878400&v=beta&t=Yrctxd5EdAdEwkVjuFcAwBrvvPGVbhKDfBKYbsMNpYs',
        initials: 'S',
        accentColor: '#C84B31',
        linkedin: 'https://www.linkedin.com/in/simonzik/?locale=en',
        whatsapp: 'https://wa.me/212751780853',
      },
      {
        name: 'Marcelina Kehinde A.',
        role: 'Head of Product',
        tag: 'UX & Interface',
        bio: 'Marcelina brings strong product and design expertise to Uzy. She ensures every interaction — from onboarding to dashboard tracking — feels simple, intuitive, and human.',
        quote: 'If a user has to think twice about what to do next, we have already failed them.',
        avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQHWHWhzeTUjgg/profile-displayphoto-shrink_800_800/B4EZmIs_EMIQAg-/0/1758935119317?e=1773878400&v=beta&t=w_hT0TvWgED2OSnI2J_8ZUqOQKO-OUQl_MQ7oWAZrXI',
        initials: 'T',
        accentColor: '#2D4263',
        linkedin: 'https://www.linkedin.com/in/marcelina-adebisi-0393b037a/',
        whatsapp: 'https://wa.me/2349056195484',
      },
      {
        name: 'Quadri Kobiowu K.',
        role: 'Lead Engineer',
        tag: 'Backend & Infrastructure',
        bio: 'Quadri architects everything that runs under the hood at Uzy — from the email parsing engine to real-time sync infrastructure. He brings a production-first mindset to every line of code.',
        quote: 'Speed and reliability are not features — they are the foundation everything else is built on.',
        avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQHqHvLeuxs9mw/profile-displayphoto-crop_800_800/B4DZyp3JRiHcAI-/0/1772376333586?e=1773878400&v=beta&t=vxjBz1tII4vwBRZEP7rAPSWiZ-9FgCmVeWonvjsqIJ8',
        initials: 'K',
        accentColor: '#C84B31',
        linkedin: 'https://www.linkedin.com/in/quadri-kobiowu-955313233/',
        whatsapp: 'https://wa.me/2349162340933',
      },
      {
        name: 'Adegoke Julius A.',
        role: 'Design Lead',
        tag: 'Brand & Visual Design',
        bio: 'Julius leads visual design and brand identity at Uzy. He ensures the product not only works beautifully, but feels beautifully crafted.',
        quote: 'Design is not decoration — it is how the product communicates.',
        avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQGaK_tlcCi2jQ/profile-displayphoto-crop_800_800/B4DZwqhQMgIoAQ-/0/1770239887931?e=1773878400&v=beta&t=0v8ymYOF1cQkSMUxqU7n49B2etd8Yr0NxA_c78atd0o', // add real image if available
        initials: 'A',
        accentColor: '#2D4263',
        linkedin: 'https://www.linkedin.com/in/adegoke-julius/',
        whatsapp: 'https://wa.me/2348104303528',
      },
]

const VALUES = [
  { number: '01', title: 'We move fast', desc: 'Ship early. Learn from users. Iterate weekly. We do not wait for perfect.' },
  { number: '02', title: 'We earn trust', desc: 'Especially with career data. Privacy is a principle, not a policy checkbox.' },
  { number: '03', title: 'We stay lean', desc: 'Small team, high output. Every person here does the work of three and enjoys it.' },
]

export default function Team() {
  const { theme: t } = useTheme()

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #C84B3144, transparent)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="text-[20vw] font-black opacity-[0.025] leading-none tracking-tighter"
            style={{ color: t.accent }}
          >
            TEAM
          </span>
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.p
            {...fadeUp(0)}
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: t.accent }}
          >
            The People
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 max-w-3xl"
            style={{ color: t.text }}
          >
            Small team.{' '}
            <span style={{ color: t.accent }}>Serious craft.</span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg max-w-xl leading-relaxed"
            style={{ color: t.textMuted }}
          >
            We are a tight-knit team of builders who have all lived through difficult job searches.
            That shared experience drives everything we build at Uzy.
          </motion.p>
        </div>
      </section>

      {/* Team Cards */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {TEAM.map((member, i) => {
            const isEven = i % 2 === 0
            const anim = isEven ? fadeLeft(0.05) : fadeRight(0.05)

            return (
              <motion.div
                key={member.name}
                {...anim}
                className="rounded-3xl border overflow-hidden"
                style={{ background: t.surface, borderColor: t.border }}
              >
                <div className="grid md:grid-cols-5">

                  {/* Photo Column */}
                  <div
                    className="md:col-span-2 relative min-h-64 flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'linear-gradient(160deg, ' + member.accentColor + '22, ' + t.bg + ')',
                      order: isEven ? 0 : 1,
                      borderRight: isEven ? '1px solid ' + t.border : 'none',
                      borderLeft: isEven ? 'none' : '1px solid ' + t.border,
                    }}
                  >
                    <div
                      className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-10"
                      style={{ background: member.accentColor }}
                    />

                    <div className="relative z-10 flex flex-col items-center py-10 px-6">
                      <div className="relative">
                        <div
                          className="w-36 h-36 rounded-2xl border-2 shadow-xl flex items-center justify-center overflow-hidden"
                          style={{
                            borderColor: member.accentColor + '55',
                            background: member.accentColor + '22',
                          }}
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.style.display = 'none' }}
                          />
                          <span
                            className="absolute text-3xl font-black"
                            style={{ color: member.accentColor }}
                          >
                            {member.initials}
                          </span>
                        </div>
                        <div
                          className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2"
                          style={{ background: member.accentColor, borderColor: t.surface }}
                        />
                      </div>

                      <div className="text-center mt-5">
                        <p className="font-black text-lg leading-tight" style={{ color: t.text }}>
                          {member.name}
                        </p>
                        <span
                          className="text-xs font-semibold mt-2 px-3 py-1 rounded-full inline-block"
                          style={{ background: member.accentColor + '18', color: member.accentColor }}
                        >
                          {member.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-5">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
                          style={{ background: t.bg, borderColor: t.border, color: t.textMuted }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#0A66C2'
                            e.currentTarget.style.color = '#0A66C2'
                            e.currentTarget.style.background = '#0A66C210'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = t.border
                            e.currentTarget.style.color = t.textMuted
                            e.currentTarget.style.background = t.bg
                          }}
                        >
                          <Linkedin size={15} />
                        </a>
                        <a
                          href={member.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
                          style={{ background: t.bg, borderColor: t.border, color: t.textMuted }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#25D366'
                            e.currentTarget.style.color = '#25D366'
                            e.currentTarget.style.background = '#25D36610'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = t.border
                            e.currentTarget.style.color = t.textMuted
                            e.currentTarget.style.background = t.bg
                          }}
                        >
                          <MessageCircle size={15} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div
                    className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center"
                    style={{ order: isEven ? 1 : 0 }}
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ background: member.accentColor + '15', color: member.accentColor }}
                      >
                        {member.tag}
                      </span>
                      <ArrowUpRight size={13} style={{ color: t.textFaint }} />
                    </div>

                    <p className="text-base leading-relaxed mb-8" style={{ color: t.textMuted }}>
                      {member.bio}
                    </p>

                    <div
                      className="rounded-2xl p-5 border relative overflow-hidden"
                      style={{
                        background: member.accentColor + '08',
                        borderColor: member.accentColor + '22',
                      }}
                    >
                      <div
                        className="absolute top-3 right-4 text-5xl font-black leading-none opacity-10"
                        style={{ color: member.accentColor }}
                      >
                        "
                      </div>
                      <p
                        className="text-sm font-semibold leading-relaxed italic relative"
                        style={{ color: t.text }}
                      >
                        {member.quote}
                      </p>
                    </div>

                    <div
                      className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t"
                      style={{ borderColor: t.border }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: t.textFaint }}>
                        Connect:
                      </p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: '#0A66C215', color: '#0A66C2' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0A66C225' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#0A66C215' }}
                      >
                        <Linkedin size={12} />
                        LinkedIn
                      </a>
                      <a
                        href={member.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: '#25D36615', color: '#25D366' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#25D36625' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#25D36615' }}
                      >
                        <MessageCircle size={12} />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 px-6" style={{ background: t.surfaceHigh }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>
              How We Work
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: t.text }}>
              What drives us.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.number}
                {...fadeUp(i * 0.1)}
                className="rounded-2xl p-7 border transition-all duration-300"
                style={{ background: t.surface, borderColor: t.border }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = t.border
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <p className="text-5xl font-black mb-5 leading-none" style={{ color: t.accent + '25' }}>
                  {v.number}
                </p>
                <h3 className="font-black text-lg mb-2" style={{ color: t.text }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Banner */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="rounded-3xl p-8 md:p-10 border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{ background: t.surface, borderColor: t.accent + '33' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at left, ' + t.accent + '06, transparent 60%)' }}
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.accent }}>
                We are hiring
              </p>
              <h3 className="text-2xl font-black mb-2" style={{ color: t.text }}>
                Want to build Uzy with us?
              </h3>
              <p className="text-sm" style={{ color: t.textMuted }}>
                We are always open to meeting talented people who care about great UX and real impact.
              </p>
            </div>
            <div className="relative shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm whitespace-nowrap"
                style={{ background: t.accent, color: '#ECDBBA' }}
              >
                Get in touch
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}