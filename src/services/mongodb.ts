const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface UserDeploymentInfo {
  email: string;
  deploymentLimit: number;
  activeDeployments: number;
  canDeploy: boolean;
}

export const mongodbService = {
  getUserDeploymentInfo: async (token: string): Promise<UserDeploymentInfo> => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/deployment-info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch deployment info' }));
      throw new Error(errorData.message || 'Failed to fetch deployment info');
    }

    return response.json();
  },

  checkDeploymentLimit: async (token: string): Promise<{ allowed: boolean; message: string; limit: number; current: number }> => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/check-deployment-limit`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to check deployment limit' }));
      throw new Error(errorData.message || 'Failed to check deployment limit');
    }

    return response.json();
  },

  incrementDeploymentCount: async (token: string, projectName: string): Promise<void> => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/increment-deployment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ projectName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to record deployment' }));
      throw new Error(errorData.message || 'Failed to record deployment');
    }
  },

  decrementDeploymentCount: async (token: string, projectName: string): Promise<void> => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/decrement-deployment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ projectName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update deployment count' }));
      throw new Error(errorData.message || 'Failed to update deployment count');
    }
  },
};
