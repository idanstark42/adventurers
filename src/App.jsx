import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import './App.css'

import Home from './pages/home'
import Edit from './pages/edit'
import Show from './pages/show'
import AuthCallback from './pages/auth-callback'

import { LiloProvider } from './logic/lilo'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

function App() {
  return <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
    <Router>
      <Routes>
        <Route path="/edit/:id" element={<LiloProvider collection='adventurers'><Edit /></LiloProvider>} />
        <Route path="/show/:id" element={<LiloProvider collection='adventurers'><Show /></LiloProvider>} />
        <Route path='/auth/callback' element={<AuthCallback />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  </PayPalScriptProvider>
}

export default App
