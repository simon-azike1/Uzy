import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { label: 'About',    to: '/about'    },
  { label: 'Services', to: '/services' },
  { label: 'Pricing',  to: '/pricing'  },
  { label: 'Team',     to: '/team'     },
  { label: 'Contact',  to: '/contact'  },
]

export default function Navbar() {
  const { dark, theme: t, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide navbar on auth pages
  const hideOn = ['/login', '/register', '/dashboard']
  if (hideOn.includes(location.pathname)) return null

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? (dark ? '#191919ee' : '#F5F0E8ee') : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${t.border}` : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/logo.png" 
            alt="UZY Logo" 
            className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => {
            const active = location.pathname === to
            return (
              <Link key={label} to={to}
                className="text-sm font-medium transition-colors relative"
                style={{ color: active ? t.accent : t.textMuted }}
                onMouseEnter={e => e.currentTarget.style.color = t.accent}
                onMouseLeave={e => e.currentTarget.style.color = active ? t.accent : t.textMuted}
              >
                {label}
                {active && (
                  <motion.div layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: t.accent }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
            style={{ background: t.surface, borderColor: t.border, color: t.textMuted }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link to="/login"
            className="hidden md:inline-flex items-center text-sm font-medium px-4 py-2 rounded-xl border transition-all"
            style={{ borderColor: t.border, color: t.textMuted, background: t.surface }}>
            Sign In
          </Link>
          <Link to="/register"
            className="hidden md:inline-flex items-center text-sm font-bold px-4 py-2 rounded-xl transition-all"
            style={{ background: t.accent, color: '#ECDBBA' }}>
            Get Started
          </Link>

          <button className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ background: t.surface, borderColor: t.border, color: t.text }}
            onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t px-6 py-5 flex flex-col gap-1"
            style={{ background: t.surface, borderColor: t.border }}>
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={label} to={to}
                className="text-sm font-medium py-2.5 px-3 rounded-xl transition-colors"
                style={{ color: location.pathname === to ? t.accent : t.textMuted }}
                onMouseEnter={e => e.currentTarget.style.background = `${t.accent}10`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 mt-1 border-t" style={{ borderColor: t.border }}>
              <Link to="/login" className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl border"
                style={{ borderColor: t.border, color: t.text }}>Sign In</Link>
              <Link to="/register" className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl"
                style={{ background: t.accent, color: '#ECDBBA' }}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}