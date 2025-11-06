import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { OTPForm } from './components/Auth/OTPForm';
import { CyaphireLogo } from './components/UI/CyaphireLogo';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'otp'>('login');
  const [signupEmail, setSignupEmail] = useState('');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  const handleSignupSuccess = (email: string) => {
    setSignupEmail(email);
    setAuthView('otp');
  };

  const handleOTPSuccess = () => {
    setAuthView('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--qp-bg-main)' }}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <CyaphireLogo size="lg" />
        </div>

        {authView === 'login' && (
          <LoginForm onSwitchToSignup={() => setAuthView('signup')} />
        )}

        {authView === 'signup' && (
          <SignupForm
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}

        {authView === 'otp' && (
          <OTPForm
            email={signupEmail}
            onVerifySuccess={handleOTPSuccess}
            onBack={() => setAuthView('signup')}
          />
        )}
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