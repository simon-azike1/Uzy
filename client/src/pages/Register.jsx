import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', { name, email, password })
      login(data)
      toast.success(`Welcome to UZY, ${data.name}!`)
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const { theme: t } = useTheme()

  const inputStyle = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    color: t.text,
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: t.bg, color: t.text }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: t.surface, color: t.text, border: `1px solid ${t.border}` },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
      
       
        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-8 border"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: t.text }}>Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Kim"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C84B31'}
                onBlur={e => e.target.style.borderColor = '#2D426388'}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>
                Email
              </label>
              <input
                type="email"
                placeholder="alex@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C84B31'}
                onBlur={e => e.target.style.borderColor = '#2D426388'}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: t.textFaint }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none transition-colors"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C84B31'}
                  onBlur={e => e.target.style.borderColor = '#2D426388'}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: t.textFaint }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: t.accent, color: t.text }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: t.textFaint }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: t.accent }}>
              Sign in
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-xs mt-6" style={{ color: t.textFaint }}>
          Track every application. Miss nothing.
        </p>
      </motion.div>
    </div>
  )
}