import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Edit,
  Shield,
  Package,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService, AdminUser } from '../../services/admin';
import { UserEditModal } from './UserEditModal';
import { PackageManager } from './PackageManager';

const ADMIN_EMAILS = ['n4nikhilkana@gmail.com', 'admin@cyaphire.com'];

export const SuperAdminDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'packages'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (isAdmin && token) {
      fetchUsers();
    }
  }, [currentPage, searchQuery, isAdmin, token]);

  const fetchUsers = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await adminService.getAllUsers(
        token,
        currentPage,
        50,
        searchQuery
      );
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const calculateStats = () => {
    const totalDeployments = users.reduce(
      (sum, user) => sum + (user.activeDeployments || 0),
      0
    );
    const verifiedUsers = users.filter((user) => user.isVerified).length;
    const avgDeploymentLimit =
      users.reduce((sum, user) => sum + (user.deploymentLimit || 1), 0) /
      (users.length || 1);

    return {
      totalDeployments,
      verifiedUsers,
      avgDeploymentLimit: avgDeploymentLimit.toFixed(1),
    };
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-curved p-8 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <span>Super Admin Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Manage users, packages, and deployment limits
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex gap-4 border-b border-bolt-dark-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-bolt-dark-300 hover:text-bolt-dark-100'
          }`}
        >
          <Users className="w-5 h-5" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'packages'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-bolt-dark-300 hover:text-bolt-dark-100'
          }`}
        >
          <Layers className="w-5 h-5" />
          Package Management
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-curved p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">{totalUsers}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>

            <div className="glass-curved p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {stats.totalDeployments}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Active Deployments</p>
            </div>

            <div className="glass-curved p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold text-white">
                  {stats.verifiedUsers}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Verified Users</p>
            </div>

            <div className="glass-curved p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-amber-400" />
                <span className="text-2xl font-bold text-white">
                  {stats.avgDeploymentLimit}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Avg Deployment Limit</p>
            </div>
          </div>

          <div className="glass-curved p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-bolt-dark-900 border border-bolt-dark-700 rounded-lg text-bolt-dark-50 placeholder-bolt-dark-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/30"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bolt-dark-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                      Contact
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-300">
                      Package
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-300">
                      Deployments
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-bolt-dark-800 hover:bg-bolt-dark-900/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-white font-medium">
                            {user.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-300 text-sm">
                          {user.profession || 'N/A'}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {user.contactNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user.isVerified ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            <XCircle className="w-3 h-3" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-white font-bold">
                          {user.deploymentLimit || 1}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {user.deploymentLimit === 1
                            ? 'Free'
                            : user.deploymentLimit === 3
                            ? 'Pro'
                            : user.deploymentLimit === 10
                            ? 'Enterprise'
                            : 'Custom'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-white font-medium">
                            {user.activeDeployments || 0}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-400">
                            {user.deploymentLimit || 1}
                          </span>
                        </div>
                        <div className="mt-1">
                          <div className="w-24 mx-auto bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${
                                (user.activeDeployments || 0) >=
                                (user.deploymentLimit || 1)
                                  ? 'bg-red-500'
                                  : (user.activeDeployments || 0) /
                                      (user.deploymentLimit || 1) >=
                                    0.8
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                              }`}
                              style={{
                                width: `${Math.min(
                                  ((user.activeDeployments || 0) /
                                    (user.deploymentLimit || 1)) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-bolt-dark-900 text-white rounded-lg hover:bg-bolt-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
        </>
      ) : (
        <PackageManager />
      )}

      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};
