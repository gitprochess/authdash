import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LoginForm } from './components/Auth/LoginForm';
import { CyaphireLogo } from './components/UI/CyaphireLogo';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--qp-bg-main)' }}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <CyaphireLogo size="lg" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
