import React, { useState } from 'react';
import { X, Save, Server, Loader2 } from 'lucide-react';
import { SSHConfig } from '../../types';

interface AddSSHFormProps {
  onSave: (config: SSHConfig) => Promise<void>;
  onCancel: () => void;
}

export const AddSSHForm: React.FC<AddSSHFormProps> = ({ onSave, onCancel }) => {
  const [config, setConfig] = useState<SSHConfig>({
    host: '',
    port: '22',
    username: '',
    password: '',
    baseDir: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await onSave(config);
      setSuccess('SSH configuration saved successfully!');
      
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to save SSH configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 vision-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-neon-blue" />
          <h3 className="text-xl font-semibold text-white">
            Add SSH Server
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Host Address
          </label>
          <input
            type="text"
            name="host"
            placeholder="e.g., 192.168.1.100"
            value={config.host}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Port
          </label>
          <input
            type="text"
            name="port"
            placeholder="22"
            value={config.port}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="root"
            value={config.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={config.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Base Directory
          </label>
          <input
            type="text"
            name="baseDir"
            placeholder="/home/user"
            value={config.baseDir}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm backdrop-blur-sm">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-aqua-green/20 border border-aqua-green/30 rounded-lg text-aqua-green text-sm backdrop-blur-sm">
            ✅ {success}
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 glass border border-white/10 text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 futuristic-btn text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 bolt-shine"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save SSH</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};