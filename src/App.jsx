import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

import HomeScreen from './pages/home'
import AdventurerScreen from './pages/adventurer'

import { DataProvider } from './logic/data-access'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adventurer/:id" element={<DataProvider><AdventurerScreen /></DataProvider>} />
        <Route path="/*" element={<HomeScreen />} />
      </Routes>
    </Router>
  )
}

export default App
