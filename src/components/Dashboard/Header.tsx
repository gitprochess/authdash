import React from 'react';
import { LogOut, User, Server, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CyaphireLogo } from '../UI/CyaphireLogo';

export const Header: React.FC = () => {
  const { user, logout, currentSSHHost } = useAuth();

  return (
    <header className="glass-strong border-b border-purple-900/30 relative z-10 shadow-lg shadow-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <CyaphireLogo size="sm" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* SSH Status Indicator */}
            <div className={`flex items-center space-x-2 text-xs px-3 py-2 rounded-lg glass border ${
              currentSSHHost ? 'text-green-400 border-green-600/30 shadow-green-900/20' : 'text-yellow-400 border-yellow-600/30 shadow-yellow-900/20'
            } shadow-lg`}>
              {currentSSHHost ? (
                <>
                  <Server className="w-4 h-4" />
                  <span className="hidden sm:block font-mono">{currentSSHHost}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:block">No SSH Server</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-bolt-dark-50 glass px-3 py-2 rounded-lg border border-purple-800/30">
              <User className="w-5 h-5 text-purple-400" />
              <span className="hidden sm:block font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-bolt-dark-300 hover:text-bolt-dark-50 glass rounded-lg transition-all duration-200 hover:bg-bolt-dark-900 border border-transparent hover:border-purple-800/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};