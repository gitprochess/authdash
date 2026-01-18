import React, { useState, useEffect } from 'react';
import { Plus, Server, Eye, EyeOff, RefreshCw, CheckCircle, Globe } from 'lucide-react';
import { SSHConfig } from '../../types';
import { sshApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AddSSHForm } from './AddSSHForm';

export const SSHManager: React.FC = () => {
  const { token, user, currentSSHHost, setCurrentSSHHost, sshConfigs, setSshConfigs, sshFetching } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  useEffect(() => {
    console.log('🔍 SSHManager mounted - token:', !!token, 'sshConfigs:', sshConfigs.length, 'sshFetching:', sshFetching);
    console.log('🔍 SSH configs details:', sshConfigs);

    // If we have configs already (from login), use them immediately
    if (sshConfigs.length > 0) {
      setLoading(false);
      setError('');
      console.log('✅ Using SSH configs loaded during login:', sshConfigs.length, 'servers');
      console.log('✅ SSH configs content:', sshConfigs);
      return;
    }

    // If currently fetching during login, keep loading
    if (sshFetching) {
      console.log('⏳ SSH configs are being fetched during login, waiting...');
      return;
    }

    // Only fetch if we don't have configs and not fetching
    if (token && sshConfigs.length === 0 && !sshFetching) {
      console.log('📡 No SSH configs found, fetching from API...');
      fetchSSHConfigs();
    } else if (!token) {
      setLoading(false);
      setError('No authentication token available');
    }
  }, [token, sshConfigs.length, sshFetching]);

  const fetchSSHConfigs = async () => {
    if (!token) {
      setLoading(false);
      setError('Authentication required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const configs = await sshApi.list(token);
      
      setSshConfigs(configs || []);
      
      if (configs.length === 0) {
        console.log('ℹ️ No SSH configurations found');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load SSH configurations');
      setSshConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSSH = async (config: SSHConfig) => {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    try {
      const response = await sshApi.save(config, token);
      
      await fetchSSHConfigs();
      
      // Auto-set as current host if it's the first one
      if (!currentSSHHost) {
        setCurrentSSHHost(config.host);
      }
      
      setShowAddForm(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleSetCurrentHost = (host: string) => {
    setCurrentSSHHost(host);
  };

  const togglePasswordVisibility = (index: number) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(index)) {
      newVisible.delete(index);
    } else {
      newVisible.add(index);
    }
    setVisiblePasswords(newVisible);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vivid-purple"></div>
        <p className="text-gray-300">Loading SSH configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            SSH Configurations
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Manage your server connections for {user?.name}
          </p>
          {currentSSHHost && (
            <div className="flex items-center space-x-2 mt-2">
              <Globe className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                Current Host: <span className="font-mono">{currentSSHHost}</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchSSHConfigs}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 glass border border-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50 bolt-shine"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          {sshConfigs.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine"
            >
              <Plus className="w-4 h-4" />
              <span>Add SSH</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">❌ Error loading SSH configurations</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchSSHConfigs}
              disabled={loading}
              className="px-3 py-1 bg-red-500/30 hover:bg-red-500/40 rounded text-sm transition-colors disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <AddSSHForm
              onSave={handleAddSSH}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sshConfigs.map((config: SSHConfig, index: number) => {
          const isCurrentHost = currentSSHHost === config.host;
          
          return (
            <div
              key={config.id || `ssh-${index}`}
              className={`glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-200 vision-glow ${
                isCurrentHost ? 'ring-2 ring-aqua-green/50 bg-aqua-green/5' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Server className={`w-5 h-5 ${isCurrentHost ? 'text-aqua-green' : 'text-neon-blue'}`} />
                  <h3 className="font-semibold text-white">SSH Server #{index + 1}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {isCurrentHost && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Active</span>
                    </div>
                  )}
                  <div className="w-2 h-2 bg-aqua-green rounded-full animate-pulse active-glow" title="Available"></div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Host:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {config.host}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Port:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {config.port}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Username:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {config.username}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-gray-400">Password:</span>
                    <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                      {visiblePasswords.has(index) ? config.password : '••••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePasswordVisibility(index)}
                    className="p-1 text-gray-400 hover:text-vivid-purple transition-colors ml-2"
                    title={visiblePasswords.has(index) ? 'Hide password' : 'Show password'}
                  >
                    {visiblePasswords.has(index) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div>
                  <span className="text-gray-400">Base Dir:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {config.baseDir}
                  </span>
                </div>

                {!isCurrentHost && (
                  <div className="pt-3">
                    <button
                      onClick={() => handleSetCurrentHost(config.host)}
                      className="w-full py-2 px-4 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine text-sm font-medium"
                    >
                      Set as Current Host
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sshConfigs.length === 0 && !error && !loading && (
          <div className="col-span-full text-center py-12">
            <Server className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No SSH configurations yet</p>
            <p className="text-gray-400 text-sm">Add your first SSH server to get started</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine"
            >
              Add SSH Server
            </button>
          </div>
        )}
      </div>

      {sshConfigs.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Total SSH configurations: {sshConfigs.length}
          {currentSSHHost && (
            <span className="ml-4 text-aqua-green">
              • Current host: {currentSSHHost}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
