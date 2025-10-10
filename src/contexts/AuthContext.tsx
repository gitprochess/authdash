import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, SSHConfig } from '../types';
import { sshApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  currentSSHHost: string | null;
  setCurrentSSHHost: (host: string | null) => void;
  sshConfigs: SSHConfig[];
  setSshConfigs: (configs: SSHConfig[]) => void;
  fetchAndSetSSHHost: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SSH_HOST'; payload: string | null }
  | { type: 'SET_SSH_CONFIGS'; payload: SSHConfig[] }
  | { type: 'SET_SSH_FETCHING'; payload: boolean };

const authReducer = (state: AuthState & { currentSSHHost: string | null; sshConfigs: SSHConfig[]; sshFetching: boolean }, action: AuthAction): AuthState & { currentSSHHost: string | null; sshConfigs: SSHConfig[]; sshFetching: boolean } => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentSSHHost: null,
        sshConfigs: [],
        sshFetching: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_SSH_HOST':
      return {
        ...state,
        currentSSHHost: action.payload,
      };
    case 'SET_SSH_CONFIGS':
      return {
        ...state,
        sshConfigs: action.payload,
        // Auto-set the first SSH host as current if none is selected
        currentSSHHost: state.currentSSHHost || (action.payload.length > 0 ? action.payload[0].host : null),
      };
    case 'SET_SSH_FETCHING':
      return {
        ...state,
        sshFetching: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState & { currentSSHHost: string | null; sshConfigs: SSHConfig[]; sshFetching: boolean } = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  currentSSHHost: null,
  sshConfigs: [],
  sshFetching: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('deploidx_token');
    const userData = localStorage.getItem('deploidx_user');
    const savedSSHHost = localStorage.getItem('deploidx_current_ssh_host');
    const savedSSHConfigs = localStorage.getItem('deploidx_ssh_configs');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN', payload: { token, user } });
      } catch (error) {
        localStorage.removeItem('deploidx_token');
        localStorage.removeItem('deploidx_user');
      }
    }

    if (savedSSHHost) {
      dispatch({ type: 'SET_SSH_HOST', payload: savedSSHHost });
    }

    if (savedSSHConfigs) {
      try {
        const configs = JSON.parse(savedSSHConfigs);
        dispatch({ type: 'SET_SSH_CONFIGS', payload: configs });
      } catch (error) {
        console.error('Failed to load SSH configs:', error);
      }
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('deploidx_token', token);
    localStorage.setItem('deploidx_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { token, user } });
    
    // Automatically fetch SSH configurations after login
    fetchAndSetSSHHost();
  };

  const logout = () => {
    localStorage.removeItem('deploidx_token');
    localStorage.removeItem('deploidx_user');
    localStorage.removeItem('deploidx_current_ssh_host');
    localStorage.removeItem('deploidx_ssh_configs');
    dispatch({ type: 'LOGOUT' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setCurrentSSHHost = (host: string | null) => {
    if (host) {
      localStorage.setItem('deploidx_current_ssh_host', host);
    } else {
      localStorage.removeItem('deploidx_current_ssh_host');
    }
    dispatch({ type: 'SET_SSH_HOST', payload: host });
  };

  const setSshConfigs = (configs: SSHConfig[]) => {
    localStorage.setItem('deploidx_ssh_configs', JSON.stringify(configs));
    dispatch({ type: 'SET_SSH_CONFIGS', payload: configs });
  };

  const fetchAndSetSSHHost = async () => {
    if (!state.token) {
      console.warn('⚠️ No token available for SSH fetch');
      return;
    }

    try {
      dispatch({ type: 'SET_SSH_FETCHING', payload: true });
      
      const configs = await sshApi.list(state.token);
      
      setSshConfigs(configs || []);
      
      // Auto-set the first SSH host as current if available
      if (configs && configs.length > 0 && !state.currentSSHHost) {
        const firstHost = configs[0].host;
        setCurrentSSHHost(firstHost);
      }
      
    } catch (error: any) {
      // Don't show error to user for auto-fetch, just log it
    } finally {
      dispatch({ type: 'SET_SSH_FETCHING', payload: false });
    }
  };
  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      setLoading, 
      setCurrentSSHHost, 
      setSshConfigs,
      fetchAndSetSSHHost
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};