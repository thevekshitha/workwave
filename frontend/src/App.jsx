import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Component } from 'react';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import StandUpForm from './pages/dashboard/StandUpForm';
import TeamPage from './pages/dashboard/Team';
import SettingsPage from './pages/dashboard/Settings';
import TeamFeed from './pages/dashboard/TeamFeed';
import BlockersPage from './pages/dashboard/Blockers';
import AnalyticsPage from './pages/dashboard/Analytics';
import DashboardLayout from './components/layout/DashboardLayout';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-premium-beige p-4 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-premium max-w-md w-full border border-red-100">
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-premium-black mb-2">Something went wrong</h1>
            <p className="text-premium-gray mb-6">
              The application encountered an unexpected error.
            </p>
            <div className="bg-red-50 p-4 rounded-xl text-left mb-6 overflow-auto max-h-32">
              <code className="text-xs text-red-600 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="premium-button-primary w-full"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.group('🛡️ ProtectedRoute');
  console.log('user:', user);
  console.log('location.pathname:', location.pathname);
  console.log('loading:', loading);
  console.groupEnd();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-beige">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-black"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  console.log('✅ ProtectedRoute - Rendering children');
  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><TeamFeed /></ProtectedRoute>} />
            <Route path="/blockers" element={<ProtectedRoute><BlockersPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/standup" element={<ProtectedRoute><StandUpForm /></ProtectedRoute>} />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
