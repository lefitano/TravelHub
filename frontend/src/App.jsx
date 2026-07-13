import {Routes , Route, } from 'react-router-dom'
import './App.css'

import ProtectedRoute from './components/ProtectedRoute'
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
    <Route path="/dashboard" element={<ProtectedRoute><DashBoardPage /></ProtectedRoute>}/>
    <Route path="/eventos" element={<ProtectedRoute><EventosPage /></ProtectedRoute>} />
    <Route path="/eventos/:id" element={<ProtectedRoute><EventosDetailsPage /></ProtectedRoute>}/>
    <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
    </Routes>
    </>
  )
}

export default App
