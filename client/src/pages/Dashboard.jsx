import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, CheckCircle2, XCircle, Clock, Search,
  Plus, MoreVertical, Trash2, Star, Bell, LogOut,
  User, MapPin, AlertCircle, ChevronDown, X,
  LayoutDashboard, TrendingUp, Mail
} from 'lucide-react'

// ─── Theme: #191919 | #2D4263 | #C84B31 | #ECDBBA

const STATUS_CONFIG = {
  applied:        { label: 'Applied',      dot: 'bg-[#2D4263]',    badge: 'bg-[#2D4263]/30 text-[#ECDBBA] border-[#2D4263]' },
  'under-review': { label: 'Under Review', dot: 'bg-amber-400',    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  accepted:       { label: 'Accepted',     dot: 'bg-green-400',    badge: 'bg-green-500/10 text-green-300 border-green-500/30' },
  rejected:       { label: 'Rejected',     dot: 'bg-[#C84B31]',    badge: 'bg-[#C84B31]/10 text-[#C84B31] border-[#C84B31]/30' },
  'no-response':  { label: 'No Response',  dot: 'bg-[#ECDBBA]/30', badge: 'bg-[#ECDBBA]/5 text-[#ECDBBA]/50 border-[#ECDBBA]/10' },
}
const PRIORITY_STARS = { high: 3, medium: 2, low: 1 }

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const apiFetch = (path, opts = {}) => {
  const token = localStorage.getItem('token')
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

const StatCard = ({ icon: Icon, label, value, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="rounded-2xl p-5 border border-[#2D4263]/40 hover:border-[#2D4263] transition-colors"
    style={{ background: '#1f1f1f' }}
  >
    <div className="inline-flex p-2 rounded-xl mb-3" style={{ background: accent ? '#C84B3122' : '#2D426344' }}>
      <Icon size={16} style={{ color: accent ? '#C84B31' : '#ECDBBA' }} />
    </div>
    <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#ECDBBA99' }}>{label}</p>
    <p className="text-3xl font-black" style={{ color: '#ECDBBA' }}>{value ?? '—'}</p>
  </motion.div>
)

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.applied
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

const AddModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ company: '', role: '', industry: '', location: '', status: 'applied', priority: 'medium', jobUrl: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.role.trim()) { setError('Company and Role are required.'); return }
    setLoading(true); setError('')
    try {
      const res = await applicationApi.create(form)
      onAdd(res.data || { ...form, _id: Date.now().toString(), appliedDate: new Date().toISOString() })
      onClose()
    } catch { setError('Failed to add. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 backdrop-blur-sm" style={{ background: '#191919cc' }} onClick={onClose} />
      <motion.div className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border"
        style={{ background: '#1f1f1f', borderColor: '#2D4263' }}
        initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: '#ECDBBA' }}>Add Application</h2>
          <button onClick={onClose} style={{ color: '#ECDBBA66' }}><X size={18} /></button>
        </div>
        <div className="space-y-4">
          {[['Company *','company'],['Job Role *','role'],['Industry','industry'],['Location','location'],['Job URL','jobUrl']].map(([label, key]) => (
            <div key={key}>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#ECDBBA88' }}>{label}</label>
              <input value={form[key]} onChange={e => set(key, e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                style={{ background: '#191919', border: '1px solid #2D426388', color: '#ECDBBA' }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[['Status','status',Object.entries(STATUS_CONFIG).map(([v,c])=>[v,c.label])],['Priority','priority',[['high','High'],['medium','Medium'],['low','Low']]]].map(([label, key, opts]) => (
              <div key={key}>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#ECDBBA88' }}>{label}</label>
                <select value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{ background: '#191919', border: '1px solid #2D426388', color: '#ECDBBA' }}>
                  {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#ECDBBA88' }}>Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none"
              style={{ background: '#191919', border: '1px solid #2D426388', color: '#ECDBBA' }} />
          </div>
          {error && <p className="text-sm" style={{ color: '#C84B31' }}>{error}</p>}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ border: '1px solid #2D4263', color: '#ECDBBA88' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
            style={{ background: '#C84B31', color: '#ECDBBA' }}>
            {loading ? 'Adding...' : 'Add Application'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({ total: 0, applied: 0, underReview: 0, accepted: 0, rejected: 0 })
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => { logout(); ('/') }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [statsRes, appsRes] = await Promise.all([applicationApi.getStats(), applicationApi.getAll()])
        if (statsRes.success) setStats(statsRes.data)
        if (appsRes.success) setApplications(appsRes.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = applications.filter(app =>
    (!search || app.company.toLowerCase().includes(search.toLowerCase()) || app.role.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === 'all' || app.status === filterStatus)
  )

  const handleDelete = async (id) => { setApplications(p => p.filter(a => a._id !== id)); setActiveMenu(null); await applicationApi.remove(id) }
  const handleStatusChange = async (id, status) => { setApplications(p => p.map(a => a._id === id ? { ...a, status } : a)); setActiveMenu(null); await applicationApi.update(id, { status }) }

  return (
    <div className="min-h-screen" style={{ background: '#191919', color: '#ECDBBA' }}>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-5 gap-4 z-20 border-r"
        style={{ background: '#1a1a1a', borderColor: '#2D426344' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 font-black text-sm"
              style={{ background: '#C84B31', color: '#ECDBBA' }}>U</div>
        <nav className="flex flex-col gap-2 flex-1">
          {[{icon:LayoutDashboard,active:true,label:'Dashboard'},{icon:Briefcase,active:false,label:'Applications'},{icon:TrendingUp,active:false,label:'Analytics'},{icon:Mail,active:false,label:'Email'}]
            .map(({ icon: Icon, active, label }) => (
              <button key={label} title={label} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{ background: active ? '#2D426344' : 'transparent', color: active ? '#ECDBBA' : '#ECDBBA44', border: active ? '1px solid #2D426366' : '1px solid transparent' }}>
                <Icon size={18} />
              </button>
          ))}
        </nav>
        <button onClick={handleLogout} title="Logout" className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ color: '#ECDBBA44' }}><LogOut size={18} /></button>
      </aside>

      <main className="ml-16 p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#ECDBBA' }}>
              Welcome back, <span style={{ color: '#C84B31' }}>{user?.name}</span> 
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#ECDBBA55' }}>Here's your job search overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: '#1f1f1f', borderColor: '#2D426344', color: '#ECDBBA66' }}><Bell size={16} /></button>
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 border"
              style={{ background: '#1f1f1f', borderColor: '#2D426344' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#2D426344' }}>
                <User size={12} style={{ color: '#ECDBBA' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#ECDBBA' }}>{user?.name}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Briefcase,    label: 'Total Applied',  value: stats.total,       accent: false, delay: 0    },
            { icon: Clock,        label: 'Under Review',   value: stats.underReview, accent: false, delay: 0.05 },
            { icon: CheckCircle2, label: 'Accepted',        value: stats.accepted,    accent: false, delay: 0.1  },
            { icon: XCircle,      label: 'Rejected',        value: stats.rejected,    accent: true,  delay: 0.15 },
          ].map(card => <StatCard key={card.label} {...card} />)}
        </div>

        {/* Table Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl overflow-hidden border" style={{ background: '#1f1f1f', borderColor: '#2D426344' }}>

          <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: '#2D426330' }}>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ECDBBA33' }} />
              <input className="w-full rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none"
                style={{ background: '#191919', border: '1px solid #2D426366', color: '#ECDBBA' }}
                placeholder="Search by company or role..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="relative">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="appearance-none rounded-xl pl-4 pr-8 py-2 text-sm focus:outline-none cursor-pointer"
                style={{ background: '#191919', border: '1px solid #2D426366', color: '#ECDBBA88' }}>
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#ECDBBA33' }} />
            </div>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: '#C84B31', color: '#ECDBBA' }}>
              <Plus size={15} /> Add
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-6 h-6 rounded-full mx-auto mb-3" style={{ border: '2px solid #C84B31', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: '#ECDBBA44' }}>Loading applications...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #2D426330' }}>
                    {['Company','Role','Status','Priority','Applied','Location',''].map(h => (
                      <th key={h} className="text-left text-xs font-medium px-5 py-3 uppercase tracking-wider" style={{ color: '#ECDBBA44' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((app, i) => (
                      <motion.tr key={app._id} layout
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ delay: i * 0.03 }} className="group transition-colors"
                        style={{ borderBottom: '1px solid #2D426320' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2D426310'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border"
                              style={{ background: '#2D426322', borderColor: '#2D426366', color: '#C84B31' }}>
                              {app.company[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: '#ECDBBA' }}>{app.company}</p>
                              {app.autoDetected && <span className="text-[10px] flex items-center gap-1" style={{ color: '#C84B3166' }}><Mail size={9} /> auto-detected</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm" style={{ color: '#ECDBBA88' }}>{app.role}</td>
                        <td className="px-5 py-4"><StatusBadge status={app.status} /></td>
                        <td className="px-5 py-4">
                          <div className="flex gap-0.5">
                            {[1,2,3].map(n => <Star key={n} size={12} style={{ color: n<=(PRIORITY_STARS[app.priority]||1)?'#C84B31':'#ECDBBA22', fill: n<=(PRIORITY_STARS[app.priority]||1)?'#C84B31':'none' }} />)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm" style={{ color: '#ECDBBA44' }}>
                          {new Date(app.appliedDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-sm" style={{ color: '#ECDBBA44' }}>
                            <MapPin size={11} />{app.location||'—'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <button onClick={() => setActiveMenu(activeMenu===app._id?null:app._id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              style={{ color: '#ECDBBA55' }}><MoreVertical size={14} /></button>
                            <AnimatePresence>
                              {activeMenu===app._id && (
                                <motion.div initial={{opacity:0,scale:0.95,y:-4}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:-4}}
                                  transition={{duration:0.15}} className="absolute right-0 top-8 w-48 rounded-xl shadow-xl z-10 overflow-hidden p-1 border"
                                  style={{background:'#1a1a1a',borderColor:'#2D426366'}}>
                                  <p className="text-[10px] px-3 py-1.5 font-semibold uppercase tracking-wider" style={{color:'#ECDBBA44'}}>Change Status</p>
                                  {Object.entries(STATUS_CONFIG).map(([v,c]) => (
                                    <button key={v} onClick={()=>handleStatusChange(app._id,v)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg"
                                      style={{color:'#ECDBBA88'}}
                                      onMouseEnter={e=>e.currentTarget.style.background='#2D426322'}
                                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}/>{c.label}
                                    </button>
                                  ))}
                                  <hr style={{borderColor:'#2D426344',margin:'4px 0'}}/>
                                  <button onClick={()=>handleDelete(app._id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg"
                                    style={{color:'#C84B31'}}
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
                  <AlertCircle size={28} className="mx-auto mb-3" style={{color:'#ECDBBA22'}}/>
                  <p className="text-sm" style={{color:'#ECDBBA44'}}>No applications found</p>
                  <button onClick={()=>setShowAddModal(true)} className="mt-4 px-4 py-2 rounded-xl text-sm"
                    style={{background:'#C84B3115',color:'#C84B31'}}>Add your first application</button>
                </div>
              )}
            </div>
          )}

          <div className="px-5 py-3 flex items-center justify-between border-t" style={{borderColor:'#2D426330'}}>
            <p className="text-xs" style={{color:'#ECDBBA33'}}>{filtered.length} of {applications.length} applications</p>
            <div className="flex items-center gap-1">
              {[['all','All'],['applied','Applied'],['under-review','Under Review'],['accepted','Accepted'],['rejected','Rejected']].map(([val,label])=>(
                <button key={val} onClick={()=>setFilterStatus(val)} className="px-3 py-1 rounded-lg text-xs transition-colors"
                  style={{background:filterStatus===val?'#C84B3120':'transparent',color:filterStatus===val?'#C84B31':'#ECDBBA44'}}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {showAddModal && <AddModal onClose={()=>setShowAddModal(false)} onAdd={app=>setApplications(p=>[app,...p])}/>}
      </AnimatePresence>
      {activeMenu && <div className="fixed inset-0 z-[5]" onClick={()=>setActiveMenu(null)}/>}
    </div>
  )
}