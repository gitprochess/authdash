import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mongodbService } from '../../services/mongodb';

export const DeploymentLimitBanner: React.FC = () => {
  const { token } = useAuth();
  const [deploymentInfo, setDeploymentInfo] = useState<{
    limit: number;
    current: number;
    canDeploy: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDeploymentInfo();
    }
  }, [token]);

  const fetchDeploymentInfo = async () => {
    if (!token) return;

    try {
      const info = await mongodbService.getUserDeploymentInfo(token);
      setDeploymentInfo({
        limit: info.deploymentLimit,
        current: info.activeDeployments,
        canDeploy: info.canDeploy,
      });
    } catch (error) {
      console.error('Failed to fetch deployment info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !deploymentInfo) return null;

  const percentage = (deploymentInfo.current / deploymentInfo.limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = deploymentInfo.current >= deploymentInfo.limit;

  return (
    <div
      className="glass-curved p-4 mb-4"
      style={{
        background: isAtLimit
          ? 'rgba(220, 38, 38, 0.1)'
          : isNearLimit
          ? 'rgba(245, 158, 11, 0.1)'
          : 'rgba(16, 185, 129, 0.1)',
        borderColor: isAtLimit
          ? 'rgba(220, 38, 38, 0.3)'
          : isNearLimit
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(16, 185, 129, 0.3)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: isAtLimit
                ? 'rgba(220, 38, 38, 0.2)'
                : isNearLimit
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(16, 185, 129, 0.2)',
            }}
          >
            {isAtLimit ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : isNearLimit ? (
              <Package className="w-5 h-5 text-amber-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Deployment Usage
            </h3>
            <p className="text-xs text-gray-400">
              {deploymentInfo.current} of {deploymentInfo.limit} deployments active
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${
                isAtLimit
                  ? 'text-red-400'
                  : isNearLimit
                  ? 'text-amber-400'
                  : 'text-green-400'
              }`}
            >
              {deploymentInfo.current}/{deploymentInfo.limit}
            </div>
            <div className="text-xs text-gray-400">Active</div>
          </div>

          {isAtLimit && (
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isAtLimit
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : isNearLimit
                ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {isAtLimit && (
        <div className="mt-3 text-xs text-red-300 flex items-center space-x-2">
          <AlertTriangle className="w-3 h-3" />
          <span>
            You've reached your deployment limit. Remove inactive deployments or
            upgrade your plan to deploy more applications.
          </span>
        </div>
      )}
    </div>
  );
};
