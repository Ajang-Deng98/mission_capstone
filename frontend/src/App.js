import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import './i18n';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OfflineIndicator from './components/OfflineIndicator';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonorDashboard from './pages/DonorDashboard';
import OrganisationDashboard from './pages/OrganisationDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Services
import { syncService } from './services/offlineService';
import apiService from './services/apiService';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component / مكون المسار المحمي
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'donor':
        return <Navigate to="/donor" replace />;
      case 'organisation':
        return <Navigate to="/organisation" replace />;
      case 'field_officer':
        return <Navigate to="/field-officer" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

// Dashboard Router Component / مكون موجه لوحة التحكم
const DashboardRouter = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  switch (user.role) {
    case 'donor':
      return <Navigate to="/donor" replace />;
    case 'organisation':
      return <Navigate to="/organisation" replace />;
    case 'field_officer':
      return <Navigate to="/field-officer" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Dashboard />;
  }
};

function AppContent() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const publicPages = ['/', '/about', '/how-it-works', '/projects', '/login', '/register'];
  const showFooter = publicPages.includes(location.pathname);

  useEffect(() => {
    // Set document direction based on language / تعيين اتجاه المستند حسب اللغة
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Add appropriate font class
    document.body.className = i18n.language === 'ar' ? 'font-arabic' : 'font-english';
  }, [i18n.language]);

  useEffect(() => {
    // Setup offline/online listeners / إعداد مستمعي الاتصال/عدم الاتصال
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initialize app / تهيئة التطبيق
    const initializeApp = async () => {
      try {
        // App initialization without offline service
        console.log('App initialized successfully');
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`App min-h-screen bg-gray-50 ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <OfflineIndicator isOnline={isOnline} />
      
      <main className="pt-16">
        <Routes>
          {/* Public Routes / المسارات العامة */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
          <Route path="/how-it-works" element={<PublicRoute><HowItWorks /></PublicRoute>} />
          <Route path="/projects" element={<PublicRoute><Projects /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Protected Routes / المسارات المحمية */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Role-specific Routes / المسارات الخاصة بالأدوار */}
          <Route 
            path="/donor/*" 
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/organisation/*" 
            element={
              <ProtectedRoute allowedRoles={['organisation']}>
                <OrganisationDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/field-officer/*" 
            element={
              <ProtectedRoute allowedRoles={['field_officer']}>
                <FieldOfficerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route / مسار شامل */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;