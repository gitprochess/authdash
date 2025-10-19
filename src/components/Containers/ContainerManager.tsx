import React, { useState, useEffect } from 'react';
import { Container, RefreshCw, ExternalLink, Play, Square, AlertCircle, Skull, Loader2, Globe, RotateCw } from 'lucide-react';
import { Container as ContainerType } from '../../types';
import { containerApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const ContainerManager: React.FC = () => {
  const { token, currentSSHHost } = useAuth();
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stoppingContainers, setStoppingContainers] = useState<Set<string>>(new Set());
  const [redeployingContainers, setRedeployingContainers] = useState<Set<string>>(new Set());

  // Get the host to display (SSH host or fallback)
  const displayHost = currentSSHHost || 'No SSH server configured';

  useEffect(() => {
    if (token) {
      fetchContainers();
    } else {
      setLoading(false);
      setError('Authentication required to fetch containers');
    }
  }, [token]);

  const fetchContainers = async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const containerData = await containerApi.fetchContainers(token);
      
      setContainers(containerData);
      
      if (containerData.length === 0) {
        console.log('ℹ️ No containers found');
      }
    } catch (error: any) {
      
      let errorMessage = 'Failed to load containers';
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

  const handleRedeployContainer = async (projectName: string) => {
    if (!token) {
      alert('Authentication required to redeploy containers');
      return;
    }

    if (!projectName) {
      alert('Project name is missing. Cannot redeploy container.');
      return;
    }

    const confirmed = window.confirm(
      `🔄 REDEPLOY CONTAINER CONFIRMATION 🔄\n\n` +
      `Project: ${projectName}\n\n` +
      `Are you sure you want to redeploy this container?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRedeployingContainers(prev => new Set([...prev, projectName]));

      const response = await containerApi.redeployContainer(projectName, token);

      alert(`Container "${projectName}" is being redeployed successfully!`);

      await fetchContainers();

    } catch (error: any) {

      let errorMessage = 'Failed to redeploy container';
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You may not have permission to redeploy this container.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Failed to redeploy container "${projectName}": ${errorMessage}`);
    } finally {
      setRedeployingContainers(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectName);
        return newSet;
      });
    }
  };

  const handleStopContainer = async (containerId: string, projectName: string) => {
    if (!token) {
      alert('Authentication required to stop containers');
      return;
    }

    if (!containerId) {
      alert('Container ID is missing. Cannot stop container.');
      console.error('❌ Container ID is undefined or empty:', containerId);
      return;
    }

    // Log the specific container being stopped

    // Confirm before stopping with detailed info
    const confirmed = window.confirm(
      `⚠️ STOP CONTAINER CONFIRMATION ⚠️\n\n` +
      `Project: ${projectName}\n` +
      `Container ID: ${containerId}\n\n` +
      `Are you sure you want to stop this container?`
    );

    if (!confirmed) {
      return;
    }

    try {
      // Add container to stopping set using the specific container ID
      setStoppingContainers(prev => new Set([...prev, containerId]));


      const response = await containerApi.stopContainer(containerId, token);

      // Refresh containers list to get updated status
      await fetchContainers();

    } catch (error: any) {

      let errorMessage = 'Failed to stop container';
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You may not have permission to stop this container.';
      } else if (error.status === 404) {
        errorMessage = 'Container not found. It may have already been stopped.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Failed to stop container "${projectName}": ${errorMessage}`);
    } finally {
      // Remove container from stopping set using the specific container ID
      setStoppingContainers(prev => {
        const newSet = new Set(prev);
        newSet.delete(containerId);
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

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'running':
        return <Play className="w-4 h-4" />;
      case 'stopped':
        return <Square className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vivid-purple"></div>
        <p className="text-gray-300">Loading containers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Container Management
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Monitor and manage your deployed applications
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
            onClick={fetchContainers}
            disabled={loading || !token}
            className="flex items-center space-x-2 px-3 py-2 glass border border-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50 bolt-shine"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">❌ Error loading containers</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchContainers}
              disabled={loading || !token}
              className="px-3 py-1 bg-red-500/30 hover:bg-red-500/40 rounded text-sm transition-colors disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {containers.map((container, index) => {
          // Use the specific container's ID for tracking stopping state
          const isBeingStopped = stoppingContainers.has(container.containerId);
          const isBeingRedeployed = redeployingContainers.has(container.projectName);

          return (
            <div
              key={`${container.projectName}-${container.hostPort}-${container.containerId}-${index}`}
              className="glass-curved p-6 hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Container className="w-5 h-5 text-vivid-purple" />
                  <h3 className="font-semibold text-white truncate">
                    {container.projectName}
                  </h3>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${getStatusColor(container.status || 'unknown')}`}>
                  {getStatusIcon(container.status || 'unknown')}
                  <span className="capitalize">{container.status || 'unknown'}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Project:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {container.projectName}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Port:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                    {container.hostPort}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Container ID:</span>
                  <span className="ml-2 text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-xs">
                    {container.containerId}
                  </span>
                </div>
                
                <div className="pt-3 space-y-2">
                  <a
                    href={`http://${displayHost}:${container.hostPort}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                      currentSSHHost
                        ? 'futuristic-btn text-white bolt-shine'
                        : 'bg-gray-600/50 text-gray-300 cursor-not-allowed'
                    }`}
                    onClick={!currentSSHHost ? (e) => e.preventDefault() : undefined}
                    title={!currentSSHHost ? 'Configure SSH server first' : `Open app at ${displayHost}:${container.hostPort}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{currentSSHHost ? 'Open App' : 'No SSH Server'}</span>
                  </a>

                  {/* Redeploy button */}
                  <button
                    onClick={() => handleRedeployContainer(container.projectName)}
                    disabled={isBeingRedeployed || !token}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-blue-600/80 hover:bg-blue-600/90 text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
                    title={`Redeploy container ${container.projectName}`}
                  >
                    {isBeingRedeployed ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redeploying...</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4" />
                        <span>Redeploy</span>
                      </>
                    )}
                  </button>

                  {/* Kill button with dynamic container ID */}
                  <button
                    onClick={() => {
                      console.log('🎯 Kill button clicked for:', {
                        containerId: container.containerId,
                        projectName: container.projectName,
                        index: index
                      });
                      handleStopContainer(container.containerId, container.projectName);
                    }}
                    disabled={isBeingStopped || !token || !container.containerId}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-red-500/80 hover:bg-red-500/90 text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bolt-shine"
                    title={`Stop container ${container.containerId}`}
                  >
                    {isBeingStopped ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Stopping...</span>
                      </>
                    ) : (
                      <>
                        <Skull className="w-4 h-4" />
                        <span>Kill Container</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Host: {currentSSHHost || 'Not configured'}</span>
                  <span>ID: {container.containerId.substring(0, 8)}...</span>
                </div>
              </div>
            </div>
          );
        })}

        {containers.length === 0 && !error && !loading && (
          <div className="col-span-full text-center py-12">
            <Container className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No containers found</p>
            <p className="text-gray-400 text-sm">Your deployed applications will appear here</p>
            <button
              onClick={fetchContainers}
              disabled={!token}
              className="mt-4 px-4 py-2 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine disabled:opacity-50"
            >
              Refresh Containers
            </button>
          </div>
        )}
      </div>

      {containers.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Total containers: {containers.length} • Host: {currentSSHHost || 'Not configured'}
        </div>
      )}
    </div>
  );
};