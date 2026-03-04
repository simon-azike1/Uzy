import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, CheckCircle2, XCircle, Clock, Search,
  Plus, MoreVertical, Trash2, Star, Bell, LogOut,
  User, MapPin, AlertCircle, ChevronDown, X,
  LayoutDashboard, TrendingUp, Mail, Link, Unlink,
  CheckCheck, Loader2, BarChart2, Activity, Target, Zap,
  Settings, Lock, Palette, Briefcase as BriefcaseIcon, Save, Eye, EyeOff, Download
} from 'lucide-react'
import NotificationBell from '../components/NotificationBell'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  PieChart, Pie, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const T = {
  bg: '#191919', surface: '#1f1f1f', surface2: '#252525',
  border: '#2D426344', border2: '#2D426366',
  primary: '#2D4263', accent: '#C84B31',
  text: '#ECDBBA', muted: '#ECDBBA88', faint: '#ECDBBA33',
}

const STATUS_CONFIG = {
  applied:        { label: 'Applied',      color: '#2D4263', dot: 'bg-[#2D4263]',    badge: 'bg-[#2D4263]/30 text-[#ECDBBA] border-[#2D4263]' },
  'under-review': { label: 'Under Review', color: '#F59E0B', dot: 'bg-amber-400',    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  accepted:       { label: 'Accepted',     color: '#10B981', dot: 'bg-green-400',    badge: 'bg-green-500/10 text-green-300 border-green-500/30' },
  rejected:       { label: 'Rejected',     color: '#C84B31', dot: 'bg-[#C84B31]',    badge: 'bg-[#C84B31]/10 text-[#C84B31] border-[#C84B31]/30' },
  'no-response':  { label: 'No Response',  color: '#ECDBBA44', dot: 'bg-[#ECDBBA]/30', badge: 'bg-[#ECDBBA]/5 text-[#ECDBBA]/50 border-[#ECDBBA]/10' },
}
const PRIORITY_STARS = { high: 3, medium: 2, low: 1 }
const AVATAR_COLORS = ['#C84B31','#2D4263','#10B981','#F59E0B','#8B5CF6','#EC4899','#06B6D4','#84CC16']

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const apiFetch = (path, opts = {}) => {
  const user = JSON.parse(localStorage.getItem('uzy_user') || '{}')
  const token = user?.token
  return fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts.headers },
  }).then(r => r.json())
}
const applicationApi = {
  getAll:   (p = {}) => apiFetch(`/applications?${new URLSearchParams(p)}`),
  getStats: ()        => apiFetch('/applications/stats'),
  create:   (d)       => apiFetch('/applications', { method: 'POST', body: JSON.stringify(d) }),
  update:   (id, d)   => apiFetch(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  remove:   (id)      => apiFetch(`/applications/${id}`, { method: 'DELETE' }),
}
const exportCSV = () => {
  const user = JSON.parse(localStorage.getItem('uzy_user') || '{}')
  const token = user?.token
  const url = `${API_BASE}/applications/export/csv`
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `uzy-applications-${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
    })
}

const emailApi = {
  getStatus:        () => apiFetch('/email/status'),
  connectGoogle:    () => apiFetch('/email/google/connect'),
  disconnectGoogle: () => apiFetch('/email/google/disconnect', { method: 'DELETE' }),
}
const profileApi = {
  get:            ()  => apiFetch('/profile'),
  update:         (d) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(d) }),
  changePassword: (d) => apiFetch('/profile/password', { method: 'PUT', body: JSON.stringify(d) }),
}

// ─── Analytics helpers
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const buildMonthlyData = (apps) => {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { name: MONTHS[d.getMonth()], count: apps.filter(a => { const ad = new Date(a.appliedDate); return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear() }).length }
  })
}
const buildStatusData = (apps) => Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({ name: cfg.label, value: apps.filter(a => a.status === key).length, color: cfg.color, key })).filter(d => d.value > 0)
const buildCompanyData = (apps) => { const m = {}; apps.forEach(a => { m[a.company] = (m[a.company] || 0) + 1 }); return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([name,count])=>({name,count})) }
const buildWeeklyHeatmap = (apps) => { const grid = []; const now = new Date(); for (let w=7;w>=0;w--) { const week = []; for (let d=0;d<7;d++) { const date = new Date(now); date.setDate(now.getDate()-(w*7+(6-d))); week.push({ date: date.toDateString(), count: apps.filter(a=>new Date(a.appliedDate).toDateString()===date.toDateString()).length }) } grid.push(week) } return grid }
const getResponseRate = (apps) => !apps.length ? 0 : Math.round(apps.filter(a=>['accepted','rejected','under-review'].includes(a.status)).length / apps.length * 100)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return <div className="rounded-xl border px-3 py-2 text-xs shadow-xl" style={{ background: T.surface2, borderColor: T.border2, color: T.text }}><p className="font-bold mb-1">{label}</p>{payload.map((p,i)=><p key={i} style={{color:p.color||T.accent}}>{p.name}: {p.value}</p>)}</div>
}

// ─── Settings Tab
const SettingsTab = ({ onProfileUpdate }) => {
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [toast, setToast]       = useState(null)
  const [showPw, setShowPw]     = useState({ current: false, new: false })
  const [activeSection, setActiveSection] = useState('profile')

  const [form, setForm] = useState({ name: '', email: '', avatarColor: '#C84B31' })
  const [prefs, setPrefs] = useState({ targetRole: '', industry: '', salaryMin: '', salaryMax: '', jobType: 'full-time' })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

  useEffect(() => {
    profileApi.get().then(res => {
      if (res.success) {
        setProfile(res.data)
        setForm({ name: res.data.name, email: res.data.email, avatarColor: res.data.avatarColor || '#C84B31' })
        setPrefs({
          targetRole: res.data.preferences?.targetRole || '',
          industry:   res.data.preferences?.industry   || '',
          salaryMin:  res.data.preferences?.salaryMin  || '',
          salaryMax:  res.data.preferences?.salaryMax  || '',
          jobType:    res.data.preferences?.jobType    || 'full-time',
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    const res = await profileApi.update({ name: form.name, email: form.email, avatarColor: form.avatarColor })
    if (res.success) { showToast('Profile updated!'); onProfileUpdate(res.data) }
    else showToast(res.message || 'Failed to update', 'error')
    setSaving(false)
  }

  const handleSavePrefs = async () => {
    setSaving(true)
    const res = await profileApi.update({ preferences: { ...prefs, salaryMin: Number(prefs.salaryMin) || null, salaryMax: Number(prefs.salaryMax) || null } })
    if (res.success) showToast('Preferences saved!')
    else showToast(res.message || 'Failed to save', 'error')
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (!pw.currentPassword || !pw.newPassword) return showToast('Both fields required', 'error')
    setPwSaving(true)
    const res = await profileApi.changePassword(pw)
    if (res.success) { showToast('Password changed!'); setPw({ currentPassword: '', newPassword: '' }) }
    else showToast(res.message || 'Failed', 'error')
    setPwSaving(false)
  }

  const SECTIONS = [
    { id: 'profile',     icon: User,           label: 'Profile'      },
    { id: 'preferences', icon: BriefcaseIcon,  label: 'Job Prefs'    },
    { id: 'security',    icon: Lock,           label: 'Security'     },
    { id: 'appearance',  icon: Palette,        label: 'Appearance'   },
  ]

  if (loading) return (
    <div className="py-24 text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-6 h-6 rounded-full mx-auto" style={{ border: '2px solid ' + T.accent, borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border"
            style={{ background: toast.type === 'error' ? '#C84B3120' : '#2D426320', borderColor: toast.type === 'error' ? '#C84B3144' : '#2D426344', color: T.text }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 shrink-0">
          <div className="rounded-2xl border overflow-hidden" style={{ background: T.surface, borderColor: T.border }}>
            {/* Avatar preview */}
            <div className="p-6 flex flex-col items-center border-b" style={{ borderColor: T.border }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-3"
                style={{ background: form.avatarColor, color: '#fff' }}>
                {form.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <p className="text-sm font-bold text-center" style={{ color: T.text }}>{form.name}</p>
              <p className="text-xs text-center mt-0.5" style={{ color: T.faint }}>{form.email}</p>
            </div>
            <nav className="p-2">
              {SECTIONS.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setActiveSection(id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: activeSection === id ? '#C84B3115' : 'transparent', color: activeSection === id ? T.accent : T.muted }}
                  onMouseEnter={e => { if (activeSection !== id) e.currentTarget.style.background = T.border }}
                  onMouseLeave={e => { if (activeSection !== id) e.currentTarget.style.background = 'transparent' }}>
                  <Icon size={15} />{label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">

            {/* Profile */}
            {activeSection === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
                <h3 className="font-black text-base mb-1" style={{ color: T.text }}>Profile Information</h3>
                <p className="text-xs mb-6" style={{ color: T.faint }}>Update your name and email address</p>
                <div className="space-y-4">
                  {[['Full Name', 'name', 'text'], ['Email Address', 'email', 'email']].map(([label, key, type]) => (
                    <div key={key}>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: T.muted }}>{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                        style={{ background: T.bg, border: '1px solid ' + T.border2, color: T.text }} />
                    </div>
                  ))}
                </div>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: T.accent, color: T.text }}>
                  {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Changes</>}
                </button>
              </motion.div>
            )}

            {/* Preferences */}
            {activeSection === 'preferences' && (
              <motion.div key="prefs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
                <h3 className="font-black text-base mb-1" style={{ color: T.text }}>Job Search Preferences</h3>
                <p className="text-xs mb-6" style={{ color: T.faint }}>Help us tailor your experience</p>
                <div className="space-y-4">
                  {[['Target Role', 'targetRole', 'e.g. Frontend Engineer'], ['Industry', 'industry', 'e.g. Technology']].map(([label, key, placeholder]) => (
                    <div key={key}>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: T.muted }}>{label}</label>
                      <input value={prefs[key]} onChange={e => setPrefs(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                        style={{ background: T.bg, border: '1px solid ' + T.border2, color: T.text }} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: T.muted }}>Job Type</label>
                    <select value={prefs.jobType} onChange={e => setPrefs(p => ({ ...p, jobType: e.target.value }))}
                      className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      style={{ background: T.bg, border: '1px solid ' + T.border2, color: T.text }}>
                      {[['full-time','Full Time'],['part-time','Part Time'],['contract','Contract'],['internship','Internship'],['remote','Remote']].map(([v,l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['Min Salary ($)', 'salaryMin'],['Max Salary ($)', 'salaryMax']].map(([label, key]) => (
                      <div key={key}>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: T.muted }}>{label}</label>
                        <input type="number" value={prefs[key]} onChange={e => setPrefs(p => ({ ...p, [key]: e.target.value }))}
                          placeholder="0"
                          className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                          style={{ background: T.bg, border: '1px solid ' + T.border2, color: T.text }} />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleSavePrefs} disabled={saving}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: T.accent, color: T.text }}>
                  {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Preferences</>}
                </button>
              </motion.div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
                <h3 className="font-black text-base mb-1" style={{ color: T.text }}>Change Password</h3>
                <p className="text-xs mb-6" style={{ color: T.faint }}>Choose a strong password of at least 6 characters</p>
                <div className="space-y-4">
                  {[['Current Password','currentPassword','current'],['New Password','newPassword','new']].map(([label, key, vis]) => (
                    <div key={key}>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: T.muted }}>{label}</label>
                      <div className="relative">
                        <input
                          type={showPw[vis] ? 'text' : 'password'}
                          value={pw[key]}
                          onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none"
                          style={{ background: T.bg, border: '1px solid ' + T.border2, color: T.text }} />
                        <button onClick={() => setShowPw(p => ({ ...p, [vis]: !p[vis] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: T.faint }}>
                          {showPw[vis] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleChangePassword} disabled={pwSaving}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: T.accent, color: T.text }}>
                  {pwSaving ? <><Loader2 size={14} className="animate-spin" />Updating...</> : <><Lock size={14} />Update Password</>}
                </button>
              </motion.div>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
                <h3 className="font-black text-base mb-1" style={{ color: T.text }}>Avatar Color</h3>
                <p className="text-xs mb-6" style={{ color: T.faint }}>Pick a color for your profile avatar</p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
                    style={{ background: form.avatarColor, color: '#fff' }}>
                    {form.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {AVATAR_COLORS.map(color => (
                      <button key={color} onClick={() => setForm(p => ({ ...p, avatarColor: color }))}
                        className="w-9 h-9 rounded-xl transition-all"
                        style={{
                          background: color,
                          outline: form.avatarColor === color ? '2px solid ' + T.text : '2px solid transparent',
                          outlineOffset: '2px',
                          transform: form.avatarColor === color ? 'scale(1.1)' : 'scale(1)',
                        }} />
                    ))}
                  </div>
                </div>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: T.accent, color: T.text }}>
                  {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Appearance</>}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

// ─── Analytics Tab
const AnalyticsTab = ({ applications, stats }) => {
  const monthlyData  = buildMonthlyData(applications)
  const statusData   = buildStatusData(applications)
  const companyData  = buildCompanyData(applications)
  const grid         = buildWeeklyHeatmap(applications)
  const responseRate = getResponseRate(applications)
  const maxHeat      = Math.max(...grid.flat().map(c => c.count), 1)
  const heatColor    = (count) => { if (!count) return T.border; const i = count/maxHeat; return i<0.33?'#C84B3140':i<0.66?'#C84B3180':'#C84B31' }

  const kpis = [
    { label: 'Response Rate',  value: responseRate + '%',  icon: Activity,       color: '#10B981' },
    { label: 'Avg per Month',  value: applications.length ? Math.round(applications.length / Math.max(monthlyData.filter(m=>m.count>0).length,1)) : 0, icon: TrendingUp, color: T.accent },
    { label: 'Top Status',     value: statusData[0]?.name || '—',                icon: Target,    color: '#F59E0B' },
    { label: 'Most Applied',   value: companyData[0]?.name?.slice(0,12) || '—',  icon: Zap,       color: '#2D4263' },
  ]

  if (!applications.length) return (
    <div className="py-24 text-center">
      <BarChart2 size={36} className="mx-auto mb-4" style={{ color: T.faint }} />
      <p className="text-base font-bold mb-2" style={{ color: T.muted }}>No data yet</p>
      <p className="text-sm" style={{ color: T.faint }}>Add applications to see your analytics</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-5 border" style={{ background: T.surface, borderColor: T.border }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: kpi.color + '20' }}>
              <kpi.icon size={15} style={{ color: kpi.color }} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: T.muted }}>{kpi.label}</p>
            <p className="text-2xl font-black" style={{ color: T.text }}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-2 rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.accent }}>Activity</p>
          <h3 className="text-base font-black mb-6" style={{ color: T.text }}>Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C84B31" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C84B31" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Applications" stroke="#C84B31" strokeWidth={2} fill="url(#areaGrad)"
                dot={{ fill: '#C84B31', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#C84B31' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.accent }}>Breakdown</p>
          <h3 className="text-base font-black mb-4" style={{ color: T.text }}>By Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusData.map(s => (
              <div key={s.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs" style={{ color: T.muted }}>{s.name}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: T.text }}>{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.accent }}>Companies</p>
          <h3 className="text-base font-black mb-6" style={{ color: T.text }}>Most Applied To</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={companyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Applications" radius={[0,6,6,0]}>
                {companyData.map((_, i) => <Cell key={i} fill={i===0?'#C84B31':'#2D4263'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.accent }}>Consistency</p>
          <h3 className="text-base font-black mb-6" style={{ color: T.text }}>Activity Heatmap</h3>
          <div className="space-y-1.5">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, di) => (
              <div key={day} className="flex items-center gap-1.5">
                <span className="text-[10px] w-6 shrink-0" style={{ color: T.faint }}>{day}</span>
                <div className="flex gap-1.5 flex-1">
                  {grid.map((week, wi) => (
                    <div key={wi} title={week[di]?.date + ': ' + week[di]?.count + ' apps'}
                      className="flex-1 rounded aspect-square" style={{ background: heatColor(week[di]?.count), minWidth: '12px', maxWidth: '20px' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[10px]" style={{ color: T.faint }}>Less</span>
            {[0,0.25,0.5,0.75,1].map((v,i)=>(
              <div key={i} className="w-3 h-3 rounded-sm" style={{ background: v===0?T.border:'#C84B31'+Math.round(v*255).toString(16).padStart(2,'0') }} />
            ))}
            <span className="text-[10px]" style={{ color: T.faint }}>More</span>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.border }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.accent }}>Performance</p>
            <h3 className="text-base font-black" style={{ color: T.text }}>Response Metrics</h3>
          </div>
          <span className="text-3xl font-black" style={{ color: T.accent }}>{responseRate}%</span>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Response Rate',   value: responseRate,                                                                         color: '#10B981' },
            { label: 'Rejection Rate',  value: stats.total ? Math.round((stats.rejected||0)/stats.total*100) : 0,                    color: '#C84B31' },
            { label: 'Under Review',    value: stats.total ? Math.round((stats.underReview||0)/stats.total*100) : 0,                 color: '#F59E0B' },
            { label: 'Acceptance Rate', value: stats.total ? Math.round((stats.accepted||0)/stats.total*100) : 0,                    color: '#2D4263' },
          ].map(row => (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: T.muted }}>{row.label}</span>
                <span className="text-xs font-bold" style={{ color: T.text }}>{row.value}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.border }}>
                <motion.div initial={{ width: 0 }} animate={{ width: row.value + '%' }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.23,1,0.32,1] }}
                  className="h-full rounded-full" style={{ background: row.color }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Email Banner
const EmailConnectBanner = ({ onConnected }) => {
  const [status, setStatus]           = useState(null)
  const [connecting, setConnecting]   = useState(false)
  const [disconnecting, setDisc]      = useState(false)
  const [toast, setToast]             = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000) }

  useEffect(() => { emailApi.getStatus().then(d => setStatus(d)).catch(() => {}) }, [])

  useEffect(() => {
    const ec = searchParams.get('emailConnected'), ee = searchParams.get('emailError'), found = searchParams.get('found')
    if (ec) { showToast('Gmail connected! ' + found + ' application' + (found==='1'?'':'s') + ' detected.'); emailApi.getStatus().then(d=>{setStatus(d);onConnected()}).catch(()=>{}); setSearchParams({}) }
    if (ee) { showToast('Failed to connect Gmail.','error'); setSearchParams({}) }
  }, [])

  const handleConnect = async () => { setConnecting(true); try { const d = await emailApi.connectGoogle(); if (d.url) window.location.href=d.url } catch { showToast('Failed','error'); setConnecting(false) } }
  const handleDisconnect = async () => { setDisc(true); try { await emailApi.disconnectGoogle(); setStatus(p=>({...p,google:{connected:false,email:null}})); showToast('Gmail disconnected.') } catch { showToast('Failed','error') } setDisc(false) }

  const isConnected = status?.google?.connected

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border"
            style={{background:toast.type==='error'?'#C84B3120':'#2D426320',borderColor:toast.type==='error'?'#C84B3144':'#2D426344',color:T.text}}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.25,duration:0.4}}
        className="rounded-2xl border p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{background:isConnected?'#2D426312':'#C84B3108',borderColor:isConnected?'#2D426344':'#C84B3122'}}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:isConnected?'#2D426333':'#C84B3120'}}>
            <Mail size={18} style={{color:isConnected?T.text:T.accent}} />
          </div>
          <div>
            {isConnected ? (
              <>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold" style={{color:T.text}}>Gmail Connected</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:'#25D36620',color:'#25D366'}}><CheckCheck size={9}/> Active</span>
                </div>
                <p className="text-xs" style={{color:T.faint}}>{status?.google?.email} — auto-detecting job applications</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold mb-0.5" style={{color:T.text}}>Connect Gmail to auto-detect applications</p>
                <p className="text-xs" style={{color:T.faint}}>We scan your inbox for job confirmation emails and add them automatically</p>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {isConnected ? (
            <button onClick={handleDisconnect} disabled={disconnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
              style={{background:'#C84B3115',color:T.accent,border:'1px solid #C84B3133'}}>
              {disconnecting?<><Loader2 size={13} className="animate-spin"/>Disconnecting...</>:<><Unlink size={13}/>Disconnect</>}
            </button>
          ) : (
            <button onClick={handleConnect} disabled={connecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
              style={{background:T.accent,color:T.text}}>
              {connecting?<><Loader2 size={13} className="animate-spin"/>Connecting...</>:<><Link size={13}/>Connect Gmail</>}
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
}

const StatCard = ({ icon: Icon, label, value, accent, delay }) => (
  <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay,duration:0.4,ease:[0.23,1,0.32,1]}}
    className="rounded-2xl p-5 border hover:border-[#2D4263] transition-colors" style={{background:T.surface,borderColor:T.border}}>
    <div className="inline-flex p-2 rounded-xl mb-3" style={{background:accent?'#C84B3122':'#2D426344'}}>
      <Icon size={16} style={{color:accent?T.accent:T.text}} />
    </div>
    <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{color:T.muted}}>{label}</p>
    <p className="text-3xl font-black" style={{color:T.text}}>{value??'—'}</p>
  </motion.div>
)

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.applied
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.badge}`}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{cfg.label}</span>
}

const AddModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({company:'',role:'',industry:'',location:'',status:'applied',priority:'medium',jobUrl:'',notes:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(p=>({...p,[k]:v}))
  const handleSubmit = async () => {
    if (!form.company.trim()||!form.role.trim()){setError('Company and Role are required.');return}
    setLoading(true);setError('')
    try{const res=await applicationApi.create(form);onAdd(res.data||{...form,_id:Date.now().toString(),appliedDate:new Date().toISOString()});onClose()}
    catch{setError('Failed to add. Try again.')}finally{setLoading(false)}
  }
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <motion.div className="absolute inset-0 backdrop-blur-sm" style={{background:'#191919cc'}} onClick={onClose}/>
      <motion.div className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border" style={{background:T.surface,borderColor:T.primary}}
        initial={{scale:0.96,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.96,opacity:0,y:16}} transition={{type:'spring',damping:28,stiffness:320}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{color:T.text}}>Add Application</h2>
          <button onClick={onClose} style={{color:T.faint}}><X size={18}/></button>
        </div>
        <div className="space-y-4">
          {[['Company *','company'],['Job Role *','role'],['Industry','industry'],['Location','location'],['Job URL','jobUrl']].map(([label,key])=>(
            <div key={key}>
              <label className="text-xs font-medium mb-1.5 block" style={{color:T.muted}}>{label}</label>
              <input value={form[key]} onChange={e=>set(key,e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                style={{background:T.bg,border:'1px solid '+T.border2,color:T.text}}/>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[['Status','status',Object.entries(STATUS_CONFIG).map(([v,c])=>[v,c.label])],['Priority','priority',[['high','High'],['medium','Medium'],['low','Low']]]].map(([label,key,opts])=>(
              <div key={key}>
                <label className="text-xs font-medium mb-1.5 block" style={{color:T.muted}}>{label}</label>
                <select value={form[key]} onChange={e=>set(key,e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{background:T.bg,border:'1px solid '+T.border2,color:T.text}}>
                  {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{color:T.muted}}>Notes</label>
            <textarea rows={3} value={form.notes} onChange={e=>set('notes',e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none"
              style={{background:T.bg,border:'1px solid '+T.border2,color:T.text}}/>
          </div>
          {error&&<p className="text-sm" style={{color:T.accent}}>{error}</p>}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{border:'1px solid '+T.primary,color:T.muted}}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50" style={{background:T.accent,color:T.text}}>
            {loading?'Adding...':'Add Application'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Dashboard
export default function Dashboard() {
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab]         = useState('dashboard')
  const [applications, setApplications]   = useState([])
  const [stats, setStats]                 = useState({total:0,applied:0,underReview:0,accepted:0,rejected:0})
  const [search, setSearch]               = useState('')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [showAddModal, setShowAddModal]   = useState(false)
  const [activeMenu, setActiveMenu]       = useState(null)
  const [loading, setLoading]             = useState(true)
  const [avatarColor, setAvatarColor]     = useState('#C84B31')

  const handleLogout = () => { logout(); navigate('/') }

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, appsRes, profileRes] = await Promise.all([applicationApi.getStats(), applicationApi.getAll(), profileApi.get()])
      if (statsRes.success)  setStats(statsRes.data)
      if (appsRes.success)   setApplications(appsRes.data)
      if (profileRes.success) setAvatarColor(profileRes.data.avatarColor || '#C84B31')
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const handleProfileUpdate = (data) => {
    setAvatarColor(data.avatarColor || '#C84B31')
  }

  const filtered = applications.filter(app =>
    (!search || app.company.toLowerCase().includes(search.toLowerCase()) || app.role.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus==='all'||app.status===filterStatus)
  )

  const handleDelete = async (id) => { setApplications(p=>p.filter(a=>a._id!==id)); setActiveMenu(null); await applicationApi.remove(id) }
  const handleStatusChange = async (id, status) => { setApplications(p=>p.map(a=>a._id===id?{...a,status}:a)); setActiveMenu(null); await applicationApi.update(id,{status}) }

  const TABS = [
    { id:'dashboard', icon:LayoutDashboard, label:'Dashboard' },
    { id:'analytics',  icon:TrendingUp,     label:'Analytics'  },
    { id:'email',      icon:Mail,           label:'Email'      },
    { id:'settings',   icon:Settings,       label:'Settings'   },
  ]

  const TAB_TITLES = {
    dashboard: { title: <>Welcome back, <span style={{color:T.accent}}>{user?.name}</span></>, sub: 'Here is your job search overview' },
    analytics: { title: 'Analytics',     sub: 'Insights from your job search activity' },
    email:     { title: 'Email Settings',sub: 'Manage your connected email accounts' },
    settings:  { title: 'Settings',      sub: 'Manage your profile and preferences' },
  }

  return (
    <div className="min-h-screen" style={{background:T.bg,color:T.text}}>
      <aside className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-5 gap-4 z-20 border-r"
        style={{background:'#1a1a1a',borderColor:T.border}}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 font-black text-sm"
          style={{background:avatarColor,color:'#fff'}}>
          {user?.name?.[0]?.toUpperCase()||'U'}
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {TABS.map(({id,icon:Icon,label})=>(
            <button key={id} title={label} onClick={()=>setActiveTab(id)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{background:activeTab===id?'#2D426344':'transparent',color:activeTab===id?T.text:T.faint,border:activeTab===id?'1px solid #2D426366':'1px solid transparent'}}>
              <Icon size={18}/>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} title="Logout" className="w-10 h-10 rounded-xl flex items-center justify-center" style={{color:T.faint}}>
          <LogOut size={18}/>
        </button>
      </aside>

      <main className="ml-16 p-8">
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.35}}
          className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{color:T.text}}>{TAB_TITLES[activeTab].title}</h1>
            <p className="text-sm mt-0.5" style={{color:T.faint}}>{TAB_TITLES[activeTab].sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 border" style={{background:T.surface,borderColor:T.border}}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs"
                style={{background:avatarColor,color:'#fff'}}>
                {user?.name?.[0]?.toUpperCase()||'U'}
              </div>
              <span className="text-sm font-medium" style={{color:T.text}}>{user?.name}</span>
            </div>
          </div>
        </motion.div>

        {activeTab==='dashboard' && (
          <>
            <EmailConnectBanner onConnected={loadData}/>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {icon:Briefcase,label:'Total Applied',value:stats.total,accent:false,delay:0},
                {icon:Clock,label:'Under Review',value:stats.underReview,accent:false,delay:0.05},
                {icon:CheckCircle2,label:'Accepted',value:stats.accepted,accent:false,delay:0.1},
                {icon:XCircle,label:'Rejected',value:stats.rejected,accent:true,delay:0.15},
              ].map(card=><StatCard key={card.label} {...card}/>)}
            </div>
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.4}}
              className="rounded-2xl overflow-hidden border" style={{background:T.surface,borderColor:T.border}}>
              <div className="flex items-center gap-3 p-5 border-b" style={{borderColor:'#2D426330'}}>
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:T.faint}}/>
                  <input className="w-full rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none"
                    style={{background:T.bg,border:'1px solid '+T.border2,color:T.text}}
                    placeholder="Search by company or role..." value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <div className="relative">
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                    className="appearance-none rounded-xl pl-4 pr-8 py-2 text-sm focus:outline-none cursor-pointer"
                    style={{background:T.bg,border:'1px solid '+T.border2,color:T.muted}}>
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([v,c])=><option key={v} value={v}>{c.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:T.faint}}/>
                </div>
                <button onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{background:T.surface2,border:'1px solid '+T.border2,color:T.muted}}>
                  <Download size={15}/>CSV
                </button>
                <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{background:T.accent,color:T.text}}><Plus size={15}/>Add</button>
              </div>
              {loading?(
                <div className="py-20 text-center">
                  <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:'linear'}}
                    className="w-6 h-6 rounded-full mx-auto mb-3" style={{border:'2px solid '+T.accent,borderTopColor:'transparent'}}/>
                  <p className="text-sm" style={{color:T.faint}}>Loading applications...</p>
                </div>
              ):(
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{borderBottom:'1px solid #2D426330'}}>
                        {['Company','Role','Status','Priority','Applied','Location',''].map(h=>(
                          <th key={h} className="text-left text-xs font-medium px-5 py-3 uppercase tracking-wider" style={{color:T.faint}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {filtered.map((app,i)=>(
                          <motion.tr key={app._id} layout initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:8}}
                            transition={{delay:i*0.03}} className="group transition-colors" style={{borderBottom:'1px solid #2D426320'}}
                            onMouseEnter={e=>e.currentTarget.style.background='#2D426310'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border"
                                  style={{background:'#2D426322',borderColor:T.border2,color:T.accent}}>
                                  {app.company[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold" style={{color:T.text}}>{app.company}</p>
                                  {app.autoDetected&&<span className="text-[10px] flex items-center gap-1" style={{color:'#C84B3166'}}><Mail size={9}/>auto-detected</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{color:T.muted}}>{app.role}</td>
                            <td className="px-5 py-4"><StatusBadge status={app.status}/></td>
                            <td className="px-5 py-4">
                              <div className="flex gap-0.5">
                                {[1,2,3].map(n=><Star key={n} size={12} style={{color:n<=(PRIORITY_STARS[app.priority]||1)?T.accent:T.faint,fill:n<=(PRIORITY_STARS[app.priority]||1)?T.accent:'none'}}/>)}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{color:T.faint}}>
                              {new Date(app.appliedDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1 text-sm" style={{color:T.faint}}><MapPin size={11}/>{app.location||'—'}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="relative">
                                <button onClick={()=>setActiveMenu(activeMenu===app._id?null:app._id)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                  style={{color:T.muted}}><MoreVertical size={14}/></button>
                                <AnimatePresence>
                                  {activeMenu===app._id&&(
                                    <motion.div initial={{opacity:0,scale:0.95,y:-4}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:-4}}
                                      transition={{duration:0.15}} className="absolute right-0 top-8 w-48 rounded-xl shadow-xl z-10 overflow-hidden p-1 border"
                                      style={{background:'#1a1a1a',borderColor:T.border2}}>
                                      <p className="text-[10px] px-3 py-1.5 font-semibold uppercase tracking-wider" style={{color:T.faint}}>Change Status</p>
                                      {Object.entries(STATUS_CONFIG).map(([v,c])=>(
                                        <button key={v} onClick={()=>handleStatusChange(app._id,v)}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg" style={{color:T.muted}}
                                          onMouseEnter={e=>e.currentTarget.style.background='#2D426322'}
                                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}/>{c.label}
                                        </button>
                                      ))}
                                      <hr style={{borderColor:T.border2,margin:'4px 0'}}/>
                                      <button onClick={()=>handleDelete(app._id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg"
                                        style={{color:T.accent}}
                                        onMouseEnter={e=>e.currentTarget.style.background='#C84B3110'}
                                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                        <Trash2 size={13}/>Delete
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                  {filtered.length===0&&!loading&&(
                    <div className="py-16 text-center">
                      <AlertCircle size={28} className="mx-auto mb-3" style={{color:T.faint}}/>
                      <p className="text-sm" style={{color:T.faint}}>No applications found</p>
                      <button onClick={()=>setShowAddModal(true)} className="mt-4 px-4 py-2 rounded-xl text-sm" style={{background:'#C84B3115',color:T.accent}}>Add your first application</button>
                    </div>
                  )}
                </div>
              )}
              <div className="px-5 py-3 flex items-center justify-between border-t" style={{borderColor:'#2D426330'}}>
                <p className="text-xs" style={{color:T.faint}}>{filtered.length} of {applications.length} applications</p>
                <div className="flex items-center gap-1">
                  {[['all','All'],['applied','Applied'],['under-review','Under Review'],['accepted','Accepted'],['rejected','Rejected']].map(([val,label])=>(
                    <button key={val} onClick={()=>setFilterStatus(val)} className="px-3 py-1 rounded-lg text-xs transition-colors"
                      style={{background:filterStatus===val?'#C84B3120':'transparent',color:filterStatus===val?T.accent:T.faint}}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab==='analytics' && <AnalyticsTab applications={applications} stats={stats}/>}

        {activeTab==='email' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <EmailConnectBanner onConnected={loadData}/>
            <div className="rounded-2xl border p-6 mt-2" style={{background:T.surface,borderColor:T.border}}>
              <h3 className="font-black text-base mb-2" style={{color:T.text}}>How email detection works</h3>
              <p className="text-sm leading-relaxed mb-4" style={{color:T.muted}}>
                When you connect Gmail, Uzy scans your inbox for job application confirmation emails from the past 3 months.
                We look for subject lines like "Thank you for applying", "Application received", and similar patterns.
                Detected applications are automatically added to your dashboard.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[{step:'01',title:'Connect',desc:'Authorize Gmail access via Google OAuth'},{step:'02',title:'Scan',desc:'We scan the past 3 months of emails'},{step:'03',title:'Done',desc:'Applications appear in your dashboard'}].map(s=>(
                  <div key={s.step} className="rounded-xl p-4 border" style={{background:T.surface2,borderColor:T.border}}>
                    <p className="text-2xl font-black mb-2" style={{color:T.accent+'33'}}>{s.step}</p>
                    <p className="font-bold text-sm mb-1" style={{color:T.text}}>{s.title}</p>
                    <p className="text-xs" style={{color:T.faint}}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab==='settings' && <SettingsTab onProfileUpdate={handleProfileUpdate}/>}
      </main>

      <AnimatePresence>
        {showAddModal&&<AddModal onClose={()=>setShowAddModal(false)} onAdd={app=>setApplications(p=>[app,...p])}/>}
      </AnimatePresence>
      {activeMenu&&<div className="fixed inset-0 z-[5]" onClick={()=>setActiveMenu(null)}/>}
    </div>
  )
}