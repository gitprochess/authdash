export interface User {
  id: string;
  name: string;
  email: string;
  profession: string;
  contactNumber: string;
  deploymentLimit?: number;
  activeDeployments?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  profession: string;
  contactNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface SSHConfig {
  id?: string;
  host: string;
  port: string;
  username: string;
  password: string;
  baseDir: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Container {
  projectName: string;
  hostPort: number;
  containerId: string;
  status?: string;
}

export interface MySQLContainerConfig {
  projectName: string;
  mysqlVersion: string;
  mysqlRootPassword: string;
  mysqlDbName: string;
  mysqlUser: string;
  mysqlPassword: string;
  hostPort: number;
}

export interface DatabaseContainer {
  containerName: string;
  networkName: string;
  projectName: string;
  mysqlVersion: string;
  hostPort: number;
  status: string;
  createdAt?: string;
  containerId?: string; // Added to store container ID from API response
}

export type ThemeType = 
  | 'cyaphire'
  | 'vercel'
  | 'vercel-dark'
  | 'default' 
  | 'dark' 
  | 'midnight' 
  | 'ocean' 
  | 'sunset' 
  | 'forest' 
  | 'cyberpunk' 
  | 'minimal' 
  | 'aurora';

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    main: string;
    button: string;
    card: string;
  };
}

export interface AppSettings {
  theme: ThemeType;
  animations: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  compactMode: boolean;
}