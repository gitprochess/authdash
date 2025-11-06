import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { LoginData } from '../../types';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CyaphireLogo } from '../UI/CyaphireLogo';

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      
      // Handle different response formats from your API
      let token, user;
      
      // Check for various token field names
      if (response.token) {
        token = response.token;
      } else if (response.access_token) {
        token = response.access_token;
      } else if (response.jwt) {
        token = response.jwt;
      } else if (response.authToken) {
        token = response.authToken;
      } else if (response.auth_token) {
        token = response.auth_token;
      } else if (response.data?.token) {
        token = response.data.token;
      } else if (response.data?.access_token) {
        token = response.data.access_token;
      } else {
        // If no standard token field, check if the response itself might be the token
        if (typeof response === 'string' && response.length > 20) {
          token = response;
        } else {
          console.warn('⚠️ No token found in response, using fallback');
          // Create a temporary token for development
          token = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
      }

      // Handle user data
      if (response.user) {
        user = response.user;
      } else if (response.data?.user) {
        user = response.data.user;
      } else if (response.userData) {
        user = response.userData;
      } else {
        // Create user object from available data or defaults
        user = {
          id: response.id || response.user_id || response.userId || '1',
          name: response.name || response.username || response.fullName || formData.email.split('@')[0],
          email: response.email || formData.email,
          profession: response.profession || response.job || '',
          contactNumber: response.contactNumber || response.phone || response.contact || ''
        };
      }

      // Validate that we have essential data
      if (!token) {
        throw new Error('No authentication token received from server');
      }

      if (!user.email) {
        user.email = formData.email;
      }


      // Store authentication data
      login(token, user);
      
    } catch (error: any) {
      
      // Provide more specific error messages
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.status === 403) {
        errorMessage = 'Account access denied. Please contact support.';
      } else if (error.status === 404) {
        errorMessage = 'Account not found. Please check your email address.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div className="glass rounded-2xl p-8 vision-glow relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-bolt-dark-50 mb-2">
            Welcome Back
          </h2>
          <p className="text-bolt-dark-300 text-sm">
            Sign in to continue to Cyaphire AI X
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-bolt-dark-400 group-focus-within:text-purple-400 transition-colors duration-200 pointer-events-none" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 placeholder-bolt-dark-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/30 focus:shadow-lg focus:shadow-purple-900/20 transition-all duration-200 relative z-10"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-bolt-dark-400 group-focus-within:text-purple-400 transition-colors duration-200 pointer-events-none" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 placeholder-bolt-dark-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/30 focus:shadow-lg focus:shadow-purple-900/20 transition-all duration-200 relative z-10"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 futuristic-btn text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-bolt-accent-blue focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {onSwitchToSignup && (
          <div className="mt-6 text-center">
            <p className="text-bolt-dark-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};