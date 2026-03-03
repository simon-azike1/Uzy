import { createContext, useContext, useState } from 'react'

export const DARK = {
  bg:          '#191919',
  surface:     '#1f1f1f',
  surfaceHigh: '#272727',
  border:      '#2D426344',
  borderHover: '#2D4263',
  primary:     '#2D4263',
  accent:      '#C84B31',
  text:        '#ECDBBA',
  textMuted:   '#ECDBBA88',
  textFaint:   '#ECDBBA44',
}

export const LIGHT = {
  bg:          '#F5F0E8',
  surface:     '#FFFFFF',
  surfaceHigh: '#FAF7F2',
  border:      '#2D426322',
  borderHover: '#2D4263',
  primary:     '#2D4263',
  accent:      '#C84B31',
  text:        '#1a1a2e',
  textMuted:   '#1a1a2e99',
  textFaint:   '#1a1a2e44',
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true)
  const theme = dark ? DARK : LIGHT

  return (
    <ThemeContext.Provider value={{ dark, theme, toggleTheme: () => setDark(d => !d) }}>
      <div style={{ background: theme.bg, color: theme.text, transition: 'background 0.3s, color 0.3s', minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)