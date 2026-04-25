import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

// ─── Static imports (needed immediately for route guards) ────────────────────
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'

// ─── Lazy-loaded Pages ───────────────────────────────────────────────────────
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

// 404
const NotFound = lazy(() => import('./pages/NotFound'))

// ─── Suspense spinner ────────────────────────────────────────────────────────
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f9fafb',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(0,0,0,0.08)',
      borderTop: '3px solid #10b981',
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

        {/* ── Public ─────────────────────────────────────────────────────── */}
        <Route path="/" element={<Index />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* ── Auth pages — GuestRoute redirects already-logged-in users ──── */}
        <Route path="/signup" element={
          <GuestRoute><SignUp /></GuestRoute>
        } />
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/forgot-password" element={
          <GuestRoute><ForgotPassword /></GuestRoute>
        } />
        {/*
          /verify-email is intentionally NOT wrapped in GuestRoute.
          A logged-in user should still be able to hit this page if they
          clicked an old verification link in their email.
        */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ── User Dashboard — only non-admin roles ───────────────────────── */}
        {/*
          requiredRoles blocks admins: if logged in as admin and you hit any
          /dashboard URL, ProtectedRoute redirects you to /admin instead.
        */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><DashboardHome /></ProtectedRoute>
          } />
          <Route path="videos" element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><MyVideos /></ProtectedRoute>
          } />
          <Route path="clips" element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><Clips /></ProtectedRoute>
          } />
          <Route path="usage" element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><Usage /></ProtectedRoute>
          } />
          <Route path="templates" element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><Templates /></ProtectedRoute>
          } />
          <Route path="billing" element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><Billing /></ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute requiredRoles={['user', 'premium', 'pro']}><Settings /></ProtectedRoute>
          } />
        </Route>

        {/* ── Admin Dashboard ─────────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="clips" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminClips />
            </ProtectedRoute>
          } />
          <Route path="payments" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminPayments />
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="user-reports" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <UserReports />
            </ProtectedRoute>
          } />
          <Route path="jobs-queue" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <JobsQueue />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="roles-access" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <RolesAccess />
            </ProtectedRoute>
          } />
          <Route path="platform-settings" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <PlatformSettings />
            </ProtectedRoute>
          } />
          <Route path="system-logs" element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <SystemLogs />
            </ProtectedRoute>
          } />

          {/* ── Superadmin-only routes ─────────────────────────────────── */}
          <Route path="admin-management" element={
            <ProtectedRoute requiredRoles={['superadmin']}>
              <AdminManagement />
            </ProtectedRoute>
          } />
          <Route path="super-tools" element={
            <ProtectedRoute requiredRoles={['superadmin']}>
              <SuperTools />
            </ProtectedRoute>
          } />
        </Route>

        {/* ── 404 — catch all unmatched routes ────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  )
}

export default App
