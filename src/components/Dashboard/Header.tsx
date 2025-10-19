import React from 'react';
import { LogOut, User, Server, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CyaphireLogo } from '../UI/CyaphireLogo';

export const Header: React.FC = () => {
  const { user, logout, currentSSHHost } = useAuth();

  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur-md relative z-20 shadow-lg flex-shrink-0">
      <div className="px-6 flex justify-between items-center h-14">
        <div className="flex items-center">
          <CyaphireLogo size="sm" />
        </div>

        <div className="flex items-center space-x-3">
          {/* SSH Status */}
          <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            currentSSHHost
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
          }`}>
            {currentSSHHost ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">Auth</span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-white">{user?.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-400" />
            <span className="hidden sm:block text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};