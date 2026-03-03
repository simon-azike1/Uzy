import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', form)
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
         
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-8 border"
          style={{ background: '#1f1f1f', borderColor: '#2D426366' }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: '#ECDBBA' }}>Sign in to UZY</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#ECDBBA66' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="alex@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={{ background: '#191919', border: '1px solid #2D426388', color: '#ECDBBA' }}
                onFocus={e => e.target.style.borderColor = '#C84B31'}
                onBlur={e => e.target.style.borderColor = '#2D426388'}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#ECDBBA66' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none transition-colors"
                  style={{ background: '#191919', border: '1px solid #2D426388', color: '#ECDBBA' }}
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
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#ECDBBA44' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#C84B31' }}>
              Create one
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