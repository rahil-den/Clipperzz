import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy-loaded Pages
const Index = lazy(() => import('./pages'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const MyVideos = lazy(() => import('./pages/dashboard/MyVideos'))
const Clips = lazy(() => import('./pages/dashboard/Clips'))
const Usage = lazy(() => import('./pages/dashboard/Usage'))
const Templates = lazy(() => import('./pages/dashboard/Templates'))
const Billing = lazy(() => import('./pages/dashboard/Billing'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))

// Auth Pages (lazy)
const SignUp = lazy(() => import('./pages/Auth/SignUp'))
const Login = lazy(() => import('./pages/Auth/Login'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'))

// Legal Pages (lazy)
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))

// Admin Dashboard (lazy)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminHome = lazy(() => import('./pages/admin-dashboard/AdminHome'))
const AdminUsers = lazy(() => import('./pages/admin-dashboard/Users'))
const AdminClips = lazy(() => import('./pages/admin-dashboard/Clips'))
const AdminPayments = lazy(() => import('./pages/admin-dashboard/Payments'))
const AdminReports = lazy(() => import('./pages/admin-dashboard/Reports'))
const AdminSettings = lazy(() => import('./pages/admin-dashboard/Settings'))
const AdminManagement = lazy(() => import('./pages/admin-dashboard/AdminManagement'))
const PlatformSettings = lazy(() => import('./pages/admin-dashboard/PlatformSettings'))
const SystemLogs = lazy(() => import('./pages/admin-dashboard/SystemLogs'))
const SuperTools = lazy(() => import('./pages/admin-dashboard/SuperTools'))
const UserReports = lazy(() => import('./pages/admin-dashboard/UserReports'))
const JobsQueue = lazy(() => import('./pages/admin-dashboard/JobsQueue'))
const RolesAccess = lazy(() => import('./pages/admin-dashboard/RolesAccess'))

// Static import — needed immediately for route protection
import ProtectedRoute from './components/auth/ProtectedRoute'

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0a0a0a',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderTop: '3px solid #6c63ff',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  )
}

export default App

