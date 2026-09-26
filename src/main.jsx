import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { BrowserRouter as Router } from "react-router-dom";



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <Router>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </Router>
    </LanguageProvider>
  </StrictMode>,
)
