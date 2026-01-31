import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Index from './pages'
import Dashboard from './pages/Dashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import MyVideos from './pages/dashboard/MyVideos'
import Clips from './pages/dashboard/Clips'
import Usage from './pages/dashboard/Usage'
import Templates from './pages/dashboard/Templates'
import Billing from './pages/dashboard/Billing'
import Settings from './pages/dashboard/Settings'

const App = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Index />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="videos" element={<MyVideos />} />
        <Route path="clips" element={<Clips />} />
        <Route path="usage" element={<Usage />} />
        <Route path="templates" element={<Templates />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
