import React, { useState } from 'react';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { authApi } from '../../services/api';
import { CyaphireLogo } from '../UI/CyaphireLogo';

interface OTPFormProps {
  email: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export const OTPForm: React.FC<OTPFormProps> = ({ email, onVerifySuccess, onBack }) => {
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.verifyOTP({ email, otp });
      onVerifySuccess();
    } catch (error: any) {
      setError(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-2xl p-8 vision-glow">
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-vivid-purple mb-6 transition-colors duration-200 bolt-shine"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4 vision-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-300">
            We've sent a verification code to your email<br />
            <span className="font-medium text-vivid-purple">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              maxLength={6}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-2xl font-mono placeholder-gray-400 focus:outline-none focus:border-vivid-purple focus:ring-1 focus:ring-vivid-purple transition-all duration-200 tracking-widest input-shine backdrop-blur-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 futuristic-btn text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid-purple focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bolt-shine"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};