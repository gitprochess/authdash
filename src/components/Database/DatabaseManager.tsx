import React, { useState, useEffect } from 'react';
import { Database, Plus, RefreshCw, ExternalLink, Trash2, Loader2, Server, Key, User, Globe } from 'lucide-react';
import { DatabaseContainer } from '../../types';
import { databaseApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CreateMySQLForm } from './CreateMySQLForm';

export const DatabaseManager: React.FC = () => {
  const { token, currentSSHHost } = useAuth();
  const [containers, setContainers] = useState<DatabaseContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingContainers, setDeletingContainers] = useState<Set<string>>(new Set());

  // Get the host to display (SSH host or fallback)
  const displayHost = currentSSHHost || 'No SSH server configured';

  useEffect(() => {
    if (token) {
      fetchDatabaseContainers();
    } else {
      setLoading(false);
      setError('Authentication required to fetch database containers');
    }
  }, [token]);

  const fetchDatabaseContainers = async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const containerData = await databaseApi.fetchDatabaseContainers(token);
      
      setContainers(containerData);
      
      if (containerData.length === 0) {
        console.log('ℹ️ No database containers found');
      }
    } catch (error: any) {
      
      let errorMessage = 'Failed to load database containers';
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setContainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMySQL = async (config: any) => {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    try {
      const response = await databaseApi.createMySQLContainer(config, token);
      
      await fetchDatabaseContainers();
      setShowCreateForm(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteContainer = async (containerName: string, networkName: string, projectName: string) => {
    if (!token) {
      alert('Authentication required to delete containers');
      return;
    }

    if (!containerName || !networkName) {
      alert('Container name or network name is missing. Cannot delete container.');
      console.error('❌ Container name or network name is undefined:', { containerName, networkName });
      return;
    }


    const confirmed = window.confirm(
      `⚠️ DELETE DATABASE CONTAINER CONFIRMATION ⚠️\n\n` +
      `Project: ${projectName}\n` +
      `Container: ${containerName}\n` +
      `Network: ${networkName}\n\n` +
      `⚠️ WARNING: This will permanently delete the database and all its data!\n\n` +
      `Are you sure you want to delete this database container?`
    );
    
    if (!confirmed) {
      return;
    }

    try {
      setDeletingContainers(prev => new Set([...prev, containerName]));
      
      
      const response = await databaseApi.deleteDatabaseContainer(containerName, networkName, token);
      
      await fetchDatabaseContainers();
      
    } catch (error: any) {
      
      let errorMessage = 'Failed to delete database container';
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You may not have permission to delete this container.';
      } else if (error.status === 404) {
        errorMessage = 'Container not found. It may have already been deleted.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Failed to delete database "${projectName}": ${errorMessage}`);
    } finally {
      setDeletingContainers(prev => {
        const newSet = new Set(prev);
        newSet.delete(containerName);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'running':
        return 'bg-aqua-green/20 text-aqua-green border-aqua-green/30';
      case 'stopped':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-green"></div>
        <p className="text-gray-300">Loading database containers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Database Management
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Create and manage MySQL database containers
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Globe className="w-4 h-4 text-aqua-green" />
            <span className="text-sm text-gray-300">
              Host: <span className={`font-mono ${currentSSHHost ? 'text-aqua-green' : 'text-yellow-400'}`}>{displayHost}</span>
              {!currentSSHHost && (
                <span className="text-yellow-400 ml-2">(configure SSH server in SSH tab)</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-gray-400 glass px-2 py-1 rounded">
            <div className={`w-1 h-1 rounded-full ${token ? 'bg-aqua-green' : 'bg-red-400'}`}></div>
            <span>{token ? 'Authenticated' : 'Not authenticated'}</span>
          </div>
          <button
            onClick={fetchDatabaseContainers}
            disabled={loading || !token}
            className="flex items-center space-x-2 px-3 py-2 glass border border-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50 bolt-shine"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine"
          >
            <Plus className="w-4 h-4" />
            <span>Create MySQL</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">❌ Error loading database containers</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchDatabaseContainers}
              disabled={loading || !token}
              className="px-3 py-1 bg-red-500/30 hover:bg-red-500/40 rounded text-sm transition-colors disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl my-8">
            <CreateMySQLForm
              onSave={handleCreateMySQL}
              onCancel={() => setShowCreateForm(false)}
              currentHost={displayHost}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {containers.map((container, index) => {
          const isBeingDeleted = deletingContainers.has(container.containerName);
          
          return (
            <div
              key={`${container.containerName}-${container.networkName}-${index}`}
              className="glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-200 vision-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-aqua-green" />
                  <h3 className="font-semibold text-white truncate">
                    {container.projectName}
                  </h3>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${getStatusColor(container.status || 'running')}`}>
                  <Server className="w-3 h-3" />
                  <span className="capitalize">{container.status || 'running'}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">MySQL Version:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {container.mysqlVersion}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Port:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {container.hostPort}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Container:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-xs">
                    {container.containerName}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Network:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-xs">
                    {container.networkName}
                  </span>
                </div>

                {container.containerId && (
                  <div>
                    <span className="text-gray-400">Container ID:</span>
                    <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-xs">
                      {container.containerId.substring(0, 12)}...
                    </span>
                  </div>
                )}
                
                <div className="pt-3 space-y-2">
                  {/* Connection Info */}
                  <div className="glass-strong rounded-lg p-3 border border-aqua-green/20">
                    <h4 className="text-xs font-medium text-aqua-green mb-2 flex items-center">
                      <Key className="w-3 h-3 mr-1" />
                      Connection Info
                    </h4>
                    <div className="text-xs text-gray-300 space-y-1 font-mono">
                      <div>Host: <span className={currentSSHHost ? 'text-white' : 'text-yellow-400'}>{displayHost}</span></div>
                      <div>Port: <span className="text-white">{container.hostPort}</span></div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      console.log('🎯 Delete button clicked for database container:', {
                        containerName: container.containerName,
                        networkName: container.networkName,
                        projectName: container.projectName,
                        index: index
                      });
                      handleDeleteContainer(container.containerName, container.networkName, container.projectName);
                    }}
                    disabled={isBeingDeleted || !token || !container.containerName || !container.networkName}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-red-500/80 hover:bg-red-500/90 text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bolt-shine"
                    title={`Delete database container ${container.containerName}`}
                  >
                    {isBeingDeleted ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Database</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {container.createdAt && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Created: {new Date(container.createdAt).toLocaleDateString()}</span>
                    <span>Host: {currentSSHHost || 'Not configured'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {containers.length === 0 && !error && !loading && (
          <div className="col-span-full text-center py-12">
            <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No database containers found</p>
            <p className="text-gray-400 text-sm">Create your first MySQL database to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={!token}
              className="mt-4 px-4 py-2 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine disabled:opacity-50"
            >
              Create MySQL Container
            </button>
          </div>
        )}
      </div>

      {containers.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Total database containers: {containers.length} • Host: {currentSSHHost || 'Not configured'}
        </div>
      )}
    </div>
  );
};