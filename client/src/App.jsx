import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Existing pages
import Home      from './pages/Home'
import Register  from './pages/Register'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'

// New pages (create these one by one)
import About         from './pages/About'
 import Services      from './pages/Services'
import Pricing       from './pages/Pricing'
import Team          from './pages/Team'
import Contact       from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiePolicy  from './pages/CookiePolicy'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <Routes>
            {/* Redirect root to /home */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Public pages */}
            <Route path="/home"          element={<Home />}          />
            <Route path="/about"         element={<About />}         />
            <Route path="/services"      element={<Services />}      />
            <Route path="/pricing"       element={<Pricing />}       />
            <Route path="/team"           element={<Team />}          />
            <Route path="/contact"        element={<Contact />}       />
            <Route path="/privacy-policy" element={<PrivacyPolicy />}       />
            <Route path="/cookie-policy"       element={<CookiePolicy />}       />
           

            {/* Auth pages */}
            <Route path="/register" element={<Register />} />
            <Route path="/login"    element={<Login />}    />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App