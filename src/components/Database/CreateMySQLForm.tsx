import React, { useState } from 'react';
import { X, Save, Database, Loader2, Eye, EyeOff, Globe } from 'lucide-react';
import { MySQLContainerConfig } from '../../types';

interface CreateMySQLFormProps {
  onSave: (config: MySQLContainerConfig) => Promise<void>;
  onCancel: () => void;
  currentHost: string;
}

const MYSQL_VERSIONS = [
  '8.0',
  '8.0.35',
  '8.0.34',
  '8.0.33',
  '8.0.32',
  '8.0.31',
  '8.0.30',
  '5.7',
  '5.7.44',
  '5.7.43',
  '5.7.42',
  '5.7.41',
  '5.7.40',
  '5.6',
  '5.6.51',
  'latest'
];

export const CreateMySQLForm: React.FC<CreateMySQLFormProps> = ({ onSave, onCancel, currentHost }) => {
  const [config, setConfig] = useState<MySQLContainerConfig>({
    projectName: '',
    mysqlVersion: '8.0',
    mysqlRootPassword: '',
    mysqlDbName: '',
    mysqlUser: '',
    mysqlPassword: '',
    hostPort: 3306,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    root: false,
    user: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig({ 
      ...config, 
      [name]: name === 'hostPort' ? parseInt(value) || 0 : value 
    });
  };

  const togglePasswordVisibility = (field: 'root' | 'user') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const generateRandomPort = () => {
    const port = Math.floor(Math.random() * (9999 - 3000) + 3000);
    setConfig({ ...config, hostPort: port });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!config.projectName.trim()) {
      setError('Project name is required');
      setLoading(false);
      return;
    }
    
    if (!config.mysqlRootPassword.trim()) {
      setError('MySQL root password is required');
      setLoading(false);
      return;
    }
    
    if (!config.mysqlDbName.trim()) {
      setError('Database name is required');
      setLoading(false);
      return;
    }
    
    if (!config.mysqlUser.trim()) {
      setError('MySQL user is required');
      setLoading(false);
      return;
    }
    
    if (!config.mysqlPassword.trim()) {
      setError('MySQL user password is required');
      setLoading(false);
      return;
    }
    
    if (config.hostPort < 1024 || config.hostPort > 65535) {
      setError('Host port must be between 1024 and 65535');
      setLoading(false);
      return;
    }
    
    try {
      await onSave(config);
      setSuccess('MySQL container created successfully!');
      
      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to create MySQL container');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 vision-glow max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-aqua-green" />
          <h3 className="text-2xl font-semibold text-white">
            Create MySQL Container
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Host Info Banner */}
      <div className="mb-6 p-3 glass-strong rounded-lg border border-aqua-green/20">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-aqua-green" />
          <span className="text-sm text-gray-300">
            Database will be created on host: <span className={`font-mono ${currentHost !== 'No SSH server configured' ? 'text-aqua-green' : 'text-yellow-400'}`}>{currentHost}</span>
          </span>
        </div>
        {currentHost === 'No SSH server configured' && (
          <div className="mt-2 text-xs text-yellow-400">
            ⚠️ Please configure an SSH server in the SSH tab before creating databases
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="projectName"
              placeholder="e.g., my-app-db"
              value={config.projectName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          {/* MySQL Version */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              MySQL Version *
            </label>
            <select
              name="mysqlVersion"
              value={config.mysqlVersion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 backdrop-blur-sm"
            >
              {MYSQL_VERSIONS.map(version => (
                <option key={version} value={version} className="bg-gray-800 text-white">
                  MySQL {version}
                </option>
              ))}
            </select>
          </div>

          {/* Host Port */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Host Port *
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="hostPort"
                placeholder="3306"
                value={config.hostPort}
                onChange={handleChange}
                min="1024"
                max="65535"
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 input-shine backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={generateRandomPort}
                className="px-3 py-3 glass border border-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 text-sm bolt-shine"
                title="Generate random port"
              >
                Random
              </button>
            </div>
          </div>

          {/* Database Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Database Name *
            </label>
            <input
              type="text"
              name="mysqlDbName"
              placeholder="e.g., appdb"
              value={config.mysqlDbName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          {/* MySQL User */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              MySQL User *
            </label>
            <input
              type="text"
              name="mysqlUser"
              placeholder="e.g., devuser"
              value={config.mysqlUser}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 input-shine backdrop-blur-sm"
            />
          </div>

          {/* Root Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Root Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.root ? "text" : "password"}
                name="mysqlRootPassword"
                placeholder="Enter root password"
                value={config.mysqlRootPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 input-shine backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('root')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-aqua-green transition-colors"
              >
                {showPasswords.root ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              User Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.user ? "text" : "password"}
                name="mysqlPassword"
                placeholder="Enter user password"
                value={config.mysqlPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-aqua-green focus:ring-1 focus:ring-aqua-green transition-all duration-200 input-shine backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('user')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-aqua-green transition-colors"
              >
                {showPasswords.user ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Connection Info Preview */}
        <div className="glass-strong rounded-lg p-4 border border-aqua-green/20">
          <h4 className="text-sm font-medium text-aqua-green mb-2">Connection Preview</h4>
          <div className="text-xs text-gray-300 space-y-1 font-mono">
            <div>Host: <span className={currentHost !== 'No SSH server configured' ? 'text-white' : 'text-yellow-400'}>{currentHost}</span></div>
            <div>Port: <span className="text-white">{config.hostPort || 'Not set'}</span></div>
            <div>Database: <span className="text-white">{config.mysqlDbName || 'Not set'}</span></div>
            <div>Username: <span className="text-white">{config.mysqlUser || 'Not set'}</span></div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm backdrop-blur-sm">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-aqua-green/20 border border-aqua-green/30 rounded-lg text-aqua-green text-sm backdrop-blur-sm">
            ✅ {success}
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-4 glass border border-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || currentHost === 'No SSH server configured'}
            className="flex-1 py-3 px-4 futuristic-btn text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 bolt-shine font-medium"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{currentHost === 'No SSH server configured' ? 'Configure SSH First' : 'Create MySQL Container'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};