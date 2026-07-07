import {Routes , Route, } from 'react-router-dom'
import './App.css'


import InitialPage from './pages/InitialPage'
import AuthPage from './pages/AuthPage'
import DashBoardPage from './pages/DashboardPage'
import EventosPage from './pages/EventosPage'
import EventosDetailsPage from './pages/EventosDetailsPage'
import PerfilPage from './pages/PerfilPage'

function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<InitialPage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/dashboard" element={<DashBoardPage />} />
    <Route path="/eventos" element={<EventosPage />} />
    <Route path="/eventos/:id" element={<EventosDetailsPage />} />
    <Route path="/perfil" element={<PerfilPage />} />
    </Routes>
    </>
  )
}

export default App
