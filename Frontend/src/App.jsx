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

// Auth Pages
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'

// Legal Pages
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

// Admin Dashboard
import AdminDashboard from './pages/AdminDashboard'
import AdminHome from './pages/admin-dashboard/AdminHome'
import AdminUsers from './pages/admin-dashboard/Users'
import AdminClips from './pages/admin-dashboard/Clips'
import AdminPayments from './pages/admin-dashboard/Payments'
import AdminReports from './pages/admin-dashboard/Reports'
import AdminSettings from './pages/admin-dashboard/Settings'
import AdminManagement from './pages/admin-dashboard/AdminManagement'
import PlatformSettings from './pages/admin-dashboard/PlatformSettings'
import SystemLogs from './pages/admin-dashboard/SystemLogs'
import SuperTools from './pages/admin-dashboard/SuperTools'
import UserReports from './pages/admin-dashboard/UserReports'
import JobsQueue from './pages/admin-dashboard/JobsQueue'
import RolesAccess from './pages/admin-dashboard/RolesAccess'

import ProtectedRoute from './components/auth/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Index />} />

      {/* Auth Routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Legal Routes */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* User Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="videos" element={<MyVideos />} />
        <Route path="clips" element={<Clips />} />
        <Route path="usage" element={<Usage />} />
        <Route path="templates" element={<Templates />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRoles={["admin", "superadmin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="clips" element={<AdminClips />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="user-reports" element={<UserReports />} />
        <Route path="jobs-queue" element={<JobsQueue />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Super Admin Only Routes */}
        <Route 
          path="admin-management" 
          element={
            <ProtectedRoute requiredRoles={["superadmin"]}>
              <AdminManagement />
            </ProtectedRoute>
          } 
        />
        <Route path="roles-access" element={<RolesAccess />} />
        <Route path="platform-settings" element={<PlatformSettings />} />
        <Route path="system-logs" element={<SystemLogs />} />
        <Route path="super-tools" element={<SuperTools />} />
      </Route>
    </Routes>
  )
}

export default App

