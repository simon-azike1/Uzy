import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageCircle, Linkedin, MapPin, Send, CheckCircle, ArrowRight, Clock, Headphones } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: delay || 0, ease: [0.23, 1, 0.32, 1] },
})

const CONTACT_METHODS = [
  { icon: Mail, label: 'Email Us', value: 'hello@uzy.app', sub: 'We reply within 24 hours', href: 'mailto:hello@uzy.app', color: '#C84B31' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+212 600 000 000', sub: 'Mon to Fri, 9am to 6pm', href: 'https://wa.me/212600000000', color: '#25D366' },
  { icon: Linkedin, label: 'LinkedIn', value: 'Uzy App', sub: 'Follow us for updates', href: 'https://linkedin.com/company/uzy', color: '#0A66C2' },
  { icon: MapPin, label: 'Location', value: 'Casablanca, Morocco', sub: 'Remote-first team', href: null, color: '#C84B31' },
]

const TOPICS = ['General Inquiry', 'Technical Support', 'Billing & Pricing', 'Feature Request', 'Partnership', 'Press & Media', 'Careers', 'Other']

const FAQS = [
  { q: 'How quickly do you respond?', a: 'We respond to all emails within 24 hours on business days. For urgent issues, WhatsApp is fastest.' },
  { q: 'Do you offer phone support?', a: 'We offer support via email, WhatsApp, and LinkedIn. Phone support is available on Team plan by appointment.' },
  { q: 'Can I request a product demo?', a: 'Yes. Select Partnership or General Inquiry in the form and mention you want a demo. We will schedule a call.' },
]

export default function Contact() {
  const { theme: t } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [openFaq, setOpenFaq] = useState(null)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.topic) e.topic = 'Please select a topic'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  const inputStyle = {
    background: t.surfaceHigh,
    border: '1px solid ' + t.border,
    color: t.text,
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, ' + t.accent + '44, transparent)' }}
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div
            className="w-96 h-96 rounded-full opacity-5"
            style={{ background: t.accent }}
          />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.p {...fadeUp(0)} className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.accent }}>
            Get In Touch
          </motion.p>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 max-w-3xl" style={{ color: t.text }}>
            We would love
            <br />
            <span style={{ color: t.accent }}>to hear from you.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg max-w-xl leading-relaxed" style={{ color: t.textMuted }}>
            Whether you have a question about features, pricing, need a demo,
            or just want to say hello — we are here and ready to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Method Cards */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONTACT_METHODS.map((method, i) => (
            <motion.div key={method.label} {...fadeUp(i * 0.08)}>
              {method.href ? (
                <a
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="block rounded-2xl p-5 border h-full transition-all duration-300"
                  style={{ background: t.surface, borderColor: t.border }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = method.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: method.color + '18' }}>
                    <method.icon size={16} style={{ color: method.color }} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: t.textFaint }}>{method.label}</p>
                  <p className="text-sm font-bold mb-1" style={{ color: t.text }}>{method.value}</p>
                  <p className="text-xs" style={{ color: t.textFaint }}>{method.sub}</p>
                </a>
              ) : (
                <div className="rounded-2xl p-5 border h-full" style={{ background: t.surface, borderColor: t.border }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: method.color + '18' }}>
                    <method.icon size={16} style={{ color: method.color }} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: t.textFaint }}>{method.label}</p>
                  <p className="text-sm font-bold mb-1" style={{ color: t.text }}>{method.value}</p>
                  <p className="text-xs" style={{ color: t.textFaint }}>{method.sub}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8">

          {/* Form Card */}
          <motion.div {...fadeUp(0.1)} className="md:col-span-3 rounded-3xl border p-8" style={{ background: t.surface, borderColor: t.border }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: t.accent + '18' }}>
                    <CheckCircle size={28} style={{ color: t.accent }} />
                  </div>
                  <h3 className="text-2xl font-black mb-3" style={{ color: t.text }}>Message sent!</h3>
                  <p className="text-sm leading-relaxed max-w-xs" style={{ color: t.textMuted }}>
                    Thanks for reaching out. We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: '', message: '' }) }}
                    className="mt-8 text-sm font-bold px-5 py-2.5 rounded-xl"
                    style={{ background: t.accent + '15', color: t.accent }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-black mb-2" style={{ color: t.text }}>Send us a message</h2>
                  <p className="text-sm mb-8" style={{ color: t.textMuted }}>Fill in the form below and we will get back to you shortly.</p>

                  <div className="space-y-5">

                    {/* Name + Email row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>Full Name</label>
                        <input
                          type="text"
                          placeholder="Alex Kim"
                          value={form.name}
                          onChange={e => set('name', e.target.value)}
                          style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = t.accent }}
                          onBlur={e => { e.target.style.borderColor = t.border }}
                        />
                        {errors.name && <p className="text-xs mt-1" style={{ color: '#C84B31' }}>{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>Email</label>
                        <input
                          type="email"
                          placeholder="alex@email.com"
                          value={form.email}
                          onChange={e => set('email', e.target.value)}
                          style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = t.accent }}
                          onBlur={e => { e.target.style.borderColor = t.border }}
                        />
                        {errors.email && <p className="text-xs mt-1" style={{ color: '#C84B31' }}>{errors.email}</p>}
                      </div>
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>Topic</label>
                      <select
                        value={form.topic}
                        onChange={e => set('topic', e.target.value)}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = t.accent }}
                        onBlur={e => { e.target.style.borderColor = t.border }}
                      >
                        <option value="">Select a topic...</option>
                        {TOPICS.map(tp => (
                          <option key={tp} value={tp}>{tp}</option>
                        ))}
                      </select>
                      {errors.topic && <p className="text-xs mt-1" style={{ color: '#C84B31' }}>{errors.topic}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>Message</label>
                      <textarea
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        style={{ ...inputStyle, resize: 'none' }}
                        onFocus={e => { e.target.style.borderColor = t.accent }}
                        onBlur={e => { e.target.style.borderColor = t.border }}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span>
                          {errors.message && <p className="text-xs" style={{ color: '#C84B31' }}>{errors.message}</p>}
                        </span>
                        <p className="text-xs" style={{ color: t.textFaint }}>{form.message.length} chars</p>
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
                      style={{ background: t.accent, color: '#ECDBBA' }}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-4 h-4 rounded-full border-2"
                            style={{ borderColor: '#ECDBBA', borderTopColor: 'transparent' }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Message
                        </>
                      )}
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div {...fadeUp(0.2)} className="md:col-span-2 flex flex-col gap-5">

            {/* Response times */}
            <div className="rounded-2xl p-6 border" style={{ background: t.surface, borderColor: t.border }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: t.accent + '18' }}>
                <Clock size={16} style={{ color: t.accent }} />
              </div>
              <h3 className="font-black text-base mb-4" style={{ color: t.text }}>Fast response times</h3>
              <div className="space-y-2.5">
                {[
                  { channel: 'Email', time: 'Within 24 hours' },
                  { channel: 'WhatsApp', time: 'Within 4 hours' },
                  { channel: 'LinkedIn', time: 'Within 48 hours' },
                ].map(row => (
                  <div key={row.channel} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: t.textMuted }}>{row.channel}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: t.accent + '15', color: t.accent }}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Already a user */}
            <div className="rounded-2xl p-6 border" style={{ background: t.surface, borderColor: t.border }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: t.accent + '18' }}>
                <Headphones size={16} style={{ color: t.accent }} />
              </div>
              <h3 className="font-black text-base mb-2" style={{ color: t.text }}>Already a user?</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: t.textMuted }}>
                Log in to your account for faster priority support and access to your ticket history.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold"
                style={{ color: t.accent }}
              >
                Go to your account
                <ArrowRight size={13} />
              </a>
            </div>

            {/* FAQ mini accordion */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: t.surface, borderColor: t.border }}>
              <div className="px-6 pt-5 pb-3">
                <h3 className="font-black text-base" style={{ color: t.text }}>Quick answers</h3>
              </div>
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="border-t" style={{ borderColor: t.border }}>
                  <button
                    className="w-full flex items-start justify-between px-6 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-semibold pr-3 leading-snug" style={{ color: t.text }}>
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl leading-none shrink-0"
                      style={{ color: t.accent }}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-6 pb-4 text-sm leading-relaxed" style={{ color: t.textMuted }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </section>

    </div>
  )
}