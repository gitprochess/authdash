import React from 'react';
import { LogOut, User, Server, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CyaphireLogo } from '../UI/CyaphireLogo';

export const Header: React.FC = () => {
  const { user, logout, currentSSHHost } = useAuth();

  return (
    <header className="border-b backdrop-blur-md relative z-20 shadow-lg flex-shrink-0" style={{ borderColor: 'var(--qp-border)', background: 'var(--qp-bg-topbar)' }}>
      <div className="px-3 sm:px-4 md:px-6 flex justify-between items-center h-14">
        <div className="flex items-center">
          <CyaphireLogo size="sm" />
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {/* SSH Status - Quantum Theme */}
          <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200`}
            style={{
              background: currentSSHHost ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.05)',
              borderColor: currentSSHHost ? '#22c55e' : '#f59e0b',
              color: currentSSHHost ? '#22c55e' : '#fbbf24'
            }}>
            {currentSSHHost ? (
              <>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }}></div>
                <Server className="w-3.5 h-3.5" />
                <span className="hidden md:block font-mono text-xs">{currentSSHHost}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="hidden md:block text-xs">No SSH</span>
              </>
            )}
          </div>

          {/* Auth Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border" style={{ background: 'rgba(108, 99, 255, 0.05)', borderColor: 'var(--qp-border)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--qp-secondary)' }}></div>
            <span className="text-xs" style={{ color: 'var(--qp-text-primary)' }}>Auth</span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border" style={{ background: 'rgba(26, 27, 36, 0.6)', borderColor: 'var(--qp-border)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center profile-gradient">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--qp-text-primary)' }}>{user?.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-1.5 border rounded-lg transition-all duration-200 group"
            style={{ color: 'var(--qp-text-secondary)', background: 'rgba(26, 27, 36, 0.4)', borderColor: 'var(--qp-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--qp-border)'; e.currentTarget.style.background = 'rgba(26, 27, 36, 0.4)'; }}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
