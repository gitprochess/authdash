import React, { useState } from 'react';
import { X, Save, TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService, AdminUser } from '../../services/admin';

interface UserEditModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}

const PACKAGE_TIERS = [
  { label: 'Free', value: 1, color: 'text-gray-400' },
  { label: 'Starter', value: 2, color: 'text-blue-400' },
  { label: 'Pro', value: 3, color: 'text-purple-400' },
  { label: 'Business', value: 5, color: 'text-indigo-400' },
  { label: 'Enterprise', value: 10, color: 'text-amber-400' },
  { label: 'Unlimited', value: 999, color: 'text-emerald-400' },
];

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [deploymentLimit, setDeploymentLimit] = useState(
    user.deploymentLimit || 1
  );
  const [activeDeployments, setActiveDeployments] = useState(
    user.activeDeployments || 0
  );
  const [isVerified, setIsVerified] = useState(user.isVerified);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    if (!token) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.updateUser(token, user.id, {
        deploymentLimit,
        activeDeployments,
        isVerified,
      });

      setSuccess('User updated successfully!');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (value: number) => {
    setDeploymentLimit(value);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-curved max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-bolt-dark-950/95 backdrop-blur-sm border-b border-bolt-dark-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Package className="w-6 h-6 text-purple-400" />
              <span>Manage User</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Update package and deployment settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bolt-dark-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-bolt-dark-900/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Profession:</span>
                <span className="text-white">{user.profession || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contact:</span>
                <span className="text-white">
                  {user.contactNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Package Tier
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PACKAGE_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => handlePackageSelect(tier.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    deploymentLimit === tier.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-bolt-dark-700 bg-bolt-dark-900 hover:border-bolt-dark-600'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-lg font-bold ${tier.color}`}>
                      {tier.label}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {tier.value === 999 ? '∞' : tier.value} deployments
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deployment Limit
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  setDeploymentLimit(Math.max(1, deploymentLimit - 1))
                }
                className="p-2 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors"
              >
                <TrendingDown className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={deploymentLimit}
                onChange={(e) => setDeploymentLimit(parseInt(e.target.value) || 1)}
                min="1"
                className="flex-1 px-4 py-3 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/30"
              />
              <button
                onClick={() => setDeploymentLimit(deploymentLimit + 1)}
                className="p-2 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Active Deployments
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  setActiveDeployments(Math.max(0, activeDeployments - 1))
                }
                className="p-2 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors"
              >
                <TrendingDown className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={activeDeployments}
                onChange={(e) =>
                  setActiveDeployments(parseInt(e.target.value) || 0)
                }
                min="0"
                className="flex-1 px-4 py-3 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/30"
              />
              <button
                onClick={() => setActiveDeployments(activeDeployments + 1)}
                className="p-2 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Current deployments: {user.deployments?.length || 0} (
              {user.deployments?.join(', ') || 'None'})
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-bolt-dark-900/50 rounded-lg">
            <div>
              <div className="text-white font-medium">Verification Status</div>
              <div className="text-gray-400 text-sm">
                {isVerified
                  ? 'User account is verified'
                  : 'User account is not verified'}
              </div>
            </div>
            <button
              onClick={() => setIsVerified(!isVerified)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isVerified ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isVerified ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
