const MONGODB_API_BASE = 'https://auth.deploidx.com/api';

export interface UserDeploymentInfo {
  email: string;
  deploymentLimit: number;
  activeDeployments: number;
  canDeploy: boolean;
}

export const mongodbService = {
  getUserDeploymentInfo: async (token: string): Promise<UserDeploymentInfo> => {
    const response = await fetch(`${MONGODB_API_BASE}/user/deployment-info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch deployment info' }));
      throw new Error(errorData.message || 'Failed to fetch deployment info');
    }

    return response.json();
  },

  checkDeploymentLimit: async (token: string): Promise<{ allowed: boolean; message: string; limit: number; current: number }> => {
    const response = await fetch(`${MONGODB_API_BASE}/user/check-deployment-limit`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to check deployment limit' }));
      throw new Error(errorData.message || 'Failed to check deployment limit');
    }

    return response.json();
  },

  incrementDeploymentCount: async (token: string, projectName: string): Promise<void> => {
    const response = await fetch(`${MONGODB_API_BASE}/user/increment-deployment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to record deployment' }));
      throw new Error(errorData.message || 'Failed to record deployment');
    }
  },

  decrementDeploymentCount: async (token: string, projectName: string): Promise<void> => {
    const response = await fetch(`${MONGODB_API_BASE}/user/decrement-deployment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update deployment count' }));
      throw new Error(errorData.message || 'Failed to update deployment count');
    }
  },
};
