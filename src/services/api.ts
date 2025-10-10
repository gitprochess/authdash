import { SignupData, LoginData, OTPData, SSHConfig, Container, MySQLContainerConfig, DatabaseContainer } from '../types';

const API_BASE = 'https://auth.deploidx.com/api';
const DATABASE_API_BASE = 'https://databaseapi.deploidx.com/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(response.status, errorData.message || 'Request failed');
  }
  return response.json();
};

export const authApi = {
  signup: async (data: SignupData) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  verifyOTP: async (data: OTPData) => {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  login: async (data: LoginData) => {
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = 'Login failed';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || 'Login failed';
      } catch {
        errorMessage = errorText || 'Login failed';
      }
      
      throw new ApiError(response.status, errorMessage);
    }
    
    const result = await response.json();
    
    return result;
  },
};

export const sshApi = {
  save: async (data: SSHConfig, token: string) => {
    const response = await fetch(`${API_BASE}/auth/user/savessh`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await handleResponse(response);
    
    return result;
  },

  list: async (token: string): Promise<SSHConfig[]> => {
    
    const response = await fetch(`${API_BASE}/auth/user/ssh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    
    const result = await handleResponse(response);
    
    let sshConfigs: SSHConfig[] = [];
    
    if (result.ssh && typeof result.ssh === 'object') {
      const sshConfig = result.ssh;
      
      if (typeof sshConfig.port === 'number') {
        sshConfig.port = sshConfig.port.toString();
      }
      
      sshConfigs = [sshConfig];
    } else if (Array.isArray(result)) {
      sshConfigs = result;
    } else if (result.data && Array.isArray(result.data)) {
      sshConfigs = result.data;
    } else if (Array.isArray(result.ssh)) {
      sshConfigs = result.ssh;
    } else {
      // Unexpected SSH list response format
    }
    
    return sshConfigs;
  },
};

export const chatApi = {
  sendMessage: async (message: string, token?: string) => {
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header with Bearer token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // No JWT token available - sending request without authentication
    }
    
    
    const response = await fetch('https://ai.deploidx.com/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = `Chat API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage);
    }
    
    const result = await response.json();
    
    return result;
  },
};

export const containerApi = {
  fetchContainers: async (token: string): Promise<Container[]> => {

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header with Bearer token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication token required');
    }


    const response = await fetch('https://aimiddleware.deploidx.com/get-project-info', {
      method: 'POST',
      headers,
      body: '{}',
    });


    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage = `Container API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new ApiError(response.status, errorMessage);
    }

    const data = await response.json();

    let containers: Container[] = [];

    if (Array.isArray(data)) {
      containers = data.map(item => ({
        projectName: item.projectName,
        hostPort: item.hostPort,
        containerId: item.containerId,
        status: item.status || 'unknown'
      }));
    } else if (data.projectName && data.hostPort && data.containerId) {
      containers = [{
        projectName: data.projectName,
        hostPort: data.hostPort,
        containerId: data.containerId,
        status: data.status || 'unknown'
      }];
    }

    return containers;
  },

  redeployContainer: async (projectName: string, token: string) => {

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication token required');
    }

    const payload = {
      directoryName: projectName,
      dockerImageName: projectName
    };

    const response = await fetch('https://airedeploy.deploidx.com/redeploy', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });


    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage = `Failed to redeploy container: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new ApiError(response.status, errorMessage);
    }

    const result = await response.json();

    return result;
  },

  stopContainer: async (containerId: string, token: string) => {
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header with Bearer token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication token required');
    }
    
    const payload = { containerId };
    
    const response = await fetch('https://aimiddleware.deploidx.com/container-stop', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = `Failed to stop container: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage);
    }
    
    const result = await response.json();
    
    return result;
  },
};

export const databaseApi = {
  createMySQLContainer: async (config: MySQLContainerConfig, token: string) => {
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication token required');
    }
    
    
    const response = await fetch(`${DATABASE_API_BASE}/create-mysql-db`, {
      method: 'POST',
      headers,
      body: JSON.stringify(config),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = `Failed to create MySQL container: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage);
    }
    
    const result = await response.json();
    
    return result;
  },

  fetchDatabaseContainers: async (token: string): Promise<DatabaseContainer[]> => {
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication token required');
    }
    
    
    const response = await fetch(`${DATABASE_API_BASE}/db-containers`, {
      method: 'POST',
      headers,
      body: '{}',
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = `Database containers API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage);
    }
    
    const data = await response.json();
    
    let containers: DatabaseContainer[] = [];
    
    // Handle the actual API response format: { "containers": [...] }
    if (data.containers && Array.isArray(data.containers)) {
      containers = data.containers.map((item: any) => ({
        containerName: item.containerName,
        networkName: item.network, // API uses 'network' field
        projectName: item.projectName,
        mysqlVersion: item.dbType || 'unknown', // API uses 'dbType' field
        hostPort: item.hostPort || 0,
        status: item.status || 'running', // Default to running if not specified
        createdAt: item.createdAt,
        containerId: item.containerId // Store container ID for reference
      }));
      console.log('✅ Parsed containers from API response:', containers);
    } else if (Array.isArray(data)) {
      // Fallback: direct array response
      containers = data.map((item: any) => ({
        containerName: item.containerName,
        networkName: item.network || item.networkName,
        projectName: item.projectName,
        mysqlVersion: item.dbType || item.mysqlVersion || 'unknown',
        hostPort: item.hostPort || 0,
        status: item.status || 'running',
        createdAt: item.createdAt,
        containerId: item.containerId
      }));
      console.log('✅ Parsed containers from direct array:', containers);
    } else if (data.containerName && data.network) {
      // Single container response
      containers = [{
        containerName: data.containerName,
        networkName: data.network,
        projectName: data.projectName || 'unknown',
        mysqlVersion: data.dbType || 'unknown',
        hostPort: data.hostPort || 0,
        status: data.status || 'running',
        createdAt: data.createdAt,
        containerId: data.containerId
      }];
    } else {
      // Unexpected database containers response format
    }
    
    return containers;
  },

  deleteDatabaseContainer: async (containerName: string, networkName: string, token: string) => {
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication token required');
    }
    
    const payload = { containerName, networkName };
    
    const response = await fetch(`${DATABASE_API_BASE}/delete-db-container`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = `Failed to delete database container: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage);
    }
    
    const result = await response.json();
    
    return result;
  },
};