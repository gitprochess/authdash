import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Lock, Loader2 } from 'lucide-react';
import { SignupData } from '../../types';
import { authApi } from '../../services/api';
import { CyaphireLogo } from '../UI/CyaphireLogo';

interface SignupFormProps {
  onSignupSuccess: (email: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    profession: '',
    contactNumber: '',
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
      const response = await authApi.signup(formData);
      onSignupSuccess(formData.email);
    } catch (error: any) {
      setError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-2xl p-8 vision-glow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-300 text-sm">
            Join Cyaphire AI X for next-generation deployment management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          <div className="relative group">
            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" />
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              value={formData.profession}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" />
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 input-shine backdrop-blur-sm"
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
            className="w-full py-3 futuristic-btn text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bolt-shine"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};