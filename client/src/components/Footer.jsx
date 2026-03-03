import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', to: '/services'       },
    { label: 'Pricing',  to: '/pricing'        },
  ],
  Company: [
    { label: 'About',   to: '/about'   },
    { label: 'Team',    to: '/team'    },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Cookie Policy',  to: '/cookie-policy'  },
  ],
}

export default function Footer() {
  const { dark, theme: t, toggleTheme } = useTheme()
  const location = useLocation()

  // Hide footer on auth/app pages
  const hideOn = ['/login', '/register', '/dashboard']
  if (hideOn.includes(location.pathname)) return null

  return (
    <footer className="border-t py-14 px-6" style={{ borderColor: t.border, background: t.surface }}>
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">

          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="UZY Logo" 
                className="h-7 w-7 rounded-lg object-cover"
              />
              <span className="font-black text-base" style={{ color: t.text }}>UZY</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
              The smartest way to track your job applications. Automated, organized, and insightful.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <p className="font-bold mb-4 text-xs uppercase tracking-widest" style={{ color: t.textFaint }}>
                  {title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ label, to }) => (
                    <Link key={label} to={to}
                      className="transition-colors w-fit"
                      style={{ color: t.textMuted }}
                      onMouseEnter={e => e.currentTarget.style.color = t.accent}
                      onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-4"
          style={{ borderColor: t.border }}>
          <p className="text-xs" style={{ color: t.textFaint }}>
            © {new Date().getFullYear()} Uzy. All rights reserved.
          </p>
          <button onClick={toggleTheme}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{ borderColor: t.border, color: t.textMuted, background: t.bg }}>
            {dark ? <><Sun size={12} /> Switch to Light</> : <><Moon size={12} /> Switch to Dark</>}
          </button>
        </div>

      </div>
    </footer>
  )
}