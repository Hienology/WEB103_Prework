import { Navigate, Route, Routes } from 'react-router-dom'
import AddCreatorPage from './pages/AddCreatorPage'
import EditCreatorPage from './pages/EditCreatorPage'
import HomePage from './pages/HomePage'
import ViewCreatorPage from './pages/ViewCreatorPage'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<AddCreatorPage />} />
        <Route path="/creators/:id" element={<ViewCreatorPage />} />
        <Route path="/creators/:id/edit" element={<EditCreatorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
