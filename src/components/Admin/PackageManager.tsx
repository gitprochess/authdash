import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, DollarSign, Layers, Check, X, Loader2 } from 'lucide-react';
import { packagesService, Package as PackageType, CreatePackageData } from '../../services/packages';
import { useAuth } from '../../contexts/AuthContext';

export const PackageManager: React.FC = () => {
  const { token } = useAuth();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);

  const [formData, setFormData] = useState<CreatePackageData>({
    name: '',
    deploymentLimit: 1,
    price: 0,
    features: [],
    isActive: true,
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await packagesService.getAllPackages(token);
      setPackages(data.packages);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async () => {
    if (!token) return;

    try {
      setLoading(true);
      await packagesService.createPackage(token, formData);
      setShowCreateModal(false);
      resetForm();
      loadPackages();
    } catch (err: any) {
      setError(err.message || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePackage = async () => {
    if (!token || !editingPackage) return;

    try {
      setLoading(true);
      await packagesService.updatePackage(token, {
        packageId: editingPackage.id,
        ...formData,
      });
      setEditingPackage(null);
      resetForm();
      loadPackages();
    } catch (err: any) {
      setError(err.message || 'Failed to update package');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!token || !confirm('Are you sure you want to delete this package?')) return;

    try {
      setLoading(true);
      await packagesService.deletePackage(token, packageId);
      loadPackages();
    } catch (err: any) {
      setError(err.message || 'Failed to delete package');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      deploymentLimit: 1,
      price: 0,
      features: [],
      isActive: true,
    });
    setFeatureInput('');
  };

  const openEditModal = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      deploymentLimit: pkg.deploymentLimit,
      price: pkg.price,
      features: pkg.features,
      isActive: pkg.isActive,
    });
    setShowCreateModal(true);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-bolt-dark-50">Package Management</h2>
          <p className="text-bolt-dark-300 text-sm mt-1">Create and manage deployment packages</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingPackage(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Create Package
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {loading && packages.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-bolt-dark-50">{pkg.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          pkg.isActive
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-bolt-dark-300 hover:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-bolt-dark-300 hover:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-bolt-dark-200">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-bolt-dark-50">${pkg.price}</span>
                  <span className="text-sm">/month</span>
                </div>

                <div className="flex items-center gap-2 text-bolt-dark-200">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>
                    <span className="font-semibold text-bolt-dark-50">{pkg.deploymentLimit}</span>{' '}
                    Deployments
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-bolt-dark-200">Features:</h4>
                <ul className="space-y-1">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-bolt-dark-300">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-bolt-dark-50">
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPackage(null);
                  resetForm();
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-bolt-dark-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-bolt-dark-200 mb-2">
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Starter, Pro, Enterprise"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bolt-dark-200 mb-2">
                    Deployment Limit
                  </label>
                  <input
                    type="number"
                    value={formData.deploymentLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, deploymentLimit: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-2 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bolt-dark-200 mb-2">
                    Price (USD/month)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 focus:outline-none focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-bolt-dark-200 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="flex-1 px-4 py-2 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 focus:outline-none focus:border-blue-500"
                    placeholder="Add a feature..."
                  />
                  <button
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-bolt-dark-900 rounded-lg"
                    >
                      <span className="text-bolt-dark-50">{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-bolt-dark-700 bg-bolt-dark-900 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-bolt-dark-200">
                  Package is active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingPackage ? handleUpdatePackage : handleCreatePackage}
                  disabled={loading || !formData.name || !formData.deploymentLimit}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : editingPackage ? (
                    'Update Package'
                  ) : (
                    'Create Package'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-bolt-dark-800 hover:bg-bolt-dark-700 text-bolt-dark-200 font-semibold rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
