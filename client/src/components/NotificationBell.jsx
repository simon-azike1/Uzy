import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCheck, Briefcase, Calendar, BarChart2, Trash2 } from 'lucide-react'

const T = {
  bg: '#191919', surface: '#1f1f1f', surface2: '#252525',
  border: '#2D426344', border2: '#2D426366',
  accent: '#C84B31', text: '#ECDBBA', muted: '#ECDBBA88', faint: '#ECDBBA33',
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const apiFetch = (path, opts = {}) => {
  const user = JSON.parse(localStorage.getItem('uzy_user') || '{}')
  return fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}`, ...opts.headers },
  }).then(r => r.json())
}

const notifApi = {
  getAll:    ()   => apiFetch('/notifications'),
  markRead:  (id) => apiFetch(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => apiFetch('/notifications/read-all', { method: 'PUT' }),
  delete:    (id) => apiFetch(`/notifications/${id}`, { method: 'DELETE' }),
}

const TYPE_CONFIG = {
  'follow-up':      { icon: Briefcase,  color: '#F59E0B', bg: '#F59E0B15', label: 'Follow Up'   },
  'interview':      { icon: Calendar,   color: '#10B981', bg: '#10B98115', label: 'Interview'    },
  'weekly-summary': { icon: BarChart2,  color: '#2D4263', bg: '#2D426320', label: 'Weekly'       },
}

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date)
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function NotificationBell() {
  const [open, setOpen]               = useState(false)
  const [notifications, setNotifs]    = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading]         = useState(false)
  const ref = useRef(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await notifApi.getAll()
      if (res.success) { setNotifs(res.data); setUnreadCount(res.unreadCount) }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 60000) // poll every minute
    return () => clearInterval(interval)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkRead = async (id) => {
    setNotifs(p => p.map(n => n._id === id ? { ...n, read: true } : n))
    setUnreadCount(p => Math.max(0, p - 1))
    await notifApi.markRead(id)
  }

  const handleMarkAllRead = async () => {
    setNotifs(p => p.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    await notifApi.markAllRead()
  }

  const handleDelete = async (id) => {
    const n = notifications.find(n => n._id === id)
    setNotifs(p => p.filter(n => n._id !== id))
    if (!n.read) setUnreadCount(p => Math.max(0, p - 1))
    await notifApi.delete(id)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-9 h-9 rounded-xl flex items-center justify-center border relative transition-all"
        style={{ background: open ? '#2D426333' : T.surface, borderColor: open ? '#2D426366' : T.border, color: open ? T.text : T.faint }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: T.accent, color: '#fff' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
            style={{ background: T.surface, borderColor: T.border2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: T.border }}>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black" style={{ color: T.text }}>Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: T.accent + '22', color: T.accent }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: T.muted }}
                  onMouseEnter={e => e.currentTarget.style.color = T.text}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 rounded-full mx-auto" style={{ border: '2px solid ' + T.accent, borderTopColor: 'transparent' }} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={24} className="mx-auto mb-2" style={{ color: T.faint }} />
                  <p className="text-sm" style={{ color: T.faint }}>No notifications yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((n, i) => {
                    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG['follow-up']
                    const Icon = cfg.icon
                    return (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex gap-3 px-4 py-3 border-b group cursor-pointer transition-all"
                        style={{ borderColor: T.border, background: n.read ? 'transparent' : '#C84B3106' }}
                        onClick={() => { if (!n.read) handleMarkRead(n._id) }}
                      >
                        {/* Icon */}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: cfg.bg }}>
                          <Icon size={14} style={{ color: cfg.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold leading-snug" style={{ color: n.read ? T.muted : T.text }}>
                              {n.title}
                            </p>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: T.accent }} />}
                          </div>
                          <p className="text-[11px] mt-0.5 leading-snug" style={{ color: T.faint }}>{n.message}</p>
                          <p className="text-[10px] mt-1" style={{ color: T.faint + '99' }}>{timeAgo(n.createdAt)}</p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(n._id) }}
                          className="opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                          style={{ color: T.faint }}
                          onMouseEnter={e => e.currentTarget.style.color = T.accent}
                          onMouseLeave={e => e.currentTarget.style.color = T.faint}
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: T.border }}>
                <p className="text-[11px]" style={{ color: T.faint }}>{notifications.length} total notification{notifications.length !== 1 ? 's' : ''}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}