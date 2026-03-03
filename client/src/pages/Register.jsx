import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

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

  const inputStyle = {
    background: '#191919',
    border: '1px solid #2D426388',
    color: '#ECDBBA',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#191919' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f1f1f', color: '#ECDBBA', border: '1px solid #2D4263' },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl font-black mb-4"
            style={{ background: '#C84B31', color: '#ECDBBA' }}
          >
            U
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: '#ECDBBA' }}>UZY</h1>
          <p className="mt-2 text-sm" style={{ color: '#ECDBBA55' }}>Start tracking your applications</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-8 border"
          style={{ background: '#1f1f1f', borderColor: '#2D426366' }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: '#ECDBBA' }}>Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#ECDBBA66' }}>
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
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#ECDBBA66' }}>
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
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#ECDBBA66' }}>
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
                  style={{ color: '#ECDBBA44' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: '#C84B31', color: '#ECDBBA' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#ECDBBA44' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#C84B31' }}>
              Sign in
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-xs mt-6" style={{ color: '#ECDBBA22' }}>
          Track every application. Miss nothing.
        </p>
      </motion.div>
    </div>
  )
}