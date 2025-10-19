import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LandingPage } from './components/Landing/LandingPage';
import { SignupForm } from './components/Auth/SignupForm';
import { OTPForm } from './components/Auth/OTPForm';
import { CyaphireLogo } from './components/UI/CyaphireLogo';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [signupStep, setSignupStep] = useState<'signup' | 'otp'>('signup');
  const [signupEmail, setSignupEmail] = useState('');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (currentPath === '/deploidx/admin') {
    const handleSignupSuccess = (email: string) => {
      setSignupEmail(email);
      setSignupStep('otp');
    };

    const handleOTPSuccess = () => {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
      setSignupStep('signup');
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--qp-bg-main)' }}>
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <CyaphireLogo size="lg" />
          </div>

          {signupStep === 'signup' ? (
            <SignupForm onSignupSuccess={handleSignupSuccess} />
          ) : (
            <OTPForm
              email={signupEmail}
              onVerifySuccess={handleOTPSuccess}
              onBack={() => setSignupStep('signup')}
            />
          )}
        </div>
      </div>
    );
  }

  return <LandingPage onAuthSuccess={() => {}} />;
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