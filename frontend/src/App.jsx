import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import api from './utils/api';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Support = lazy(() => import('./pages/Support'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const Profile = lazy(() => import('./pages/user/Profile'));
const SavedProjects = lazy(() => import('./pages/user/SavedProjects'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminAddProject = lazy(() => import('./pages/admin/AdminAddProject'));
const AdminEditProject = lazy(() => import('./pages/admin/AdminEditProject'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = AUTH_ROUTES.some((r) => location.pathname.startsWith(r));

  useEffect(() => { api.post('/analytics/track').catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <main id="main-content" tabIndex={-1}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/support" element={<Support />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedProjects /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
              <Route path="/admin/projects/add" element={<AdminRoute><AdminAddProject /></AdminRoute>} />
              <Route path="/admin/projects/edit/:id" element={<AdminRoute><AdminEditProject /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
                    <p className="text-gray-400 text-xl mb-8">Page not found</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;