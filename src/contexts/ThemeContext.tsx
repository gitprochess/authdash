import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeType, Theme, AppSettings } from '../types';

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  settings: AppSettings;
  setTheme: (theme: ThemeType) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeAction =
  | { type: 'SET_THEME'; payload: ThemeType }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

interface ThemeState {
  currentTheme: ThemeType;
  settings: AppSettings;
}

const defaultSettings: AppSettings = {
  theme: 'cyaphire',
  animations: true,
  notifications: true,
  autoRefresh: true,
  compactMode: false,
};

const availableThemes: Theme[] = [
  {
    id: 'cyaphire',
    name: 'Cyaphire Dark',
    description: 'Modern dark theme with purple accents inspired by the future',
    preview: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a855f7',
      background: '#0a0a0a',
    },
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a855f7',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      surface: 'rgba(255, 255, 255, 0.03)',
      text: '#ffffff',
      textSecondary: '#a1a1aa',
      border: 'rgba(255, 255, 255, 0.08)',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    gradients: {
      main: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      button: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.7))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
    },
  },
  {
    id: 'vercel',
    name: 'Vercel Clean',
    description: 'Clean, modern design inspired by Vercel\'s UI',
    preview: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#0070f3',
      background: '#fafafa',
    },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#0070f3',
      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #fafafa 100%)',
      surface: 'rgba(0, 0, 0, 0.02)',
      text: '#000000',
      textSecondary: '#666666',
      border: 'rgba(0, 0, 0, 0.08)',
      success: '#00d924',
      warning: '#f5a623',
      error: '#e00',
    },
    gradients: {
      main: 'linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #fafafa 100%)',
      button: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(102, 102, 102, 0.7))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(250, 250, 250, 0.6))',
    },
  },
  {
    id: 'vercel-dark',
    name: 'Vercel Dark',
    description: 'Dark variant of Vercel\'s clean design',
    preview: {
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#0070f3',
      background: '#000000',
    },
    colors: {
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#0070f3',
      background: 'linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)',
      surface: 'rgba(255, 255, 255, 0.03)',
      text: '#ffffff',
      textSecondary: '#888888',
      border: 'rgba(255, 255, 255, 0.08)',
      success: '#00d924',
      warning: '#f5a623',
      error: '#e00',
    },
    gradients: {
      main: 'linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)',
      button: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(136, 136, 136, 0.05))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
    },
  },
  {
    id: 'default',
    name: 'DeploidX Classic',
    description: 'The original futuristic purple theme',
    preview: {
      primary: '#a635ff',
      secondary: '#396eff',
      accent: '#00ffb3',
      background: '#2c1d4e',
    },
    colors: {
      primary: '#a635ff',
      secondary: '#396eff',
      accent: '#00ffb3',
      background: 'linear-gradient(135deg, #2c1d4e 0%, #233b9c 50%, #2c1d4e 100%)',
      surface: 'rgba(255, 255, 255, 0.06)',
      text: '#ffffff',
      textSecondary: '#d1d5db',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#00ffb3',
      warning: '#fbbf24',
      error: '#ef4444',
    },
    gradients: {
      main: 'linear-gradient(135deg, #2c1d4e 0%, #233b9c 50%, #2c1d4e 100%)',
      button: 'linear-gradient(135deg, rgba(166, 53, 255, 0.8), rgba(57, 110, 255, 0.6))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
    },
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Pure dark theme for late-night coding',
    preview: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f0f23',
    },
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 50%, #0f0f23 100%)',
      surface: 'rgba(255, 255, 255, 0.03)',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: 'rgba(255, 255, 255, 0.08)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    gradients: {
      main: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 50%, #0f0f23 100%)',
      button: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.6))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
    },
  },
  {
    id: 'midnight',
    name: 'Deep Midnight',
    description: 'Ultra-dark theme with blue accents',
    preview: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#0ea5e9',
      background: '#030712',
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#0ea5e9',
      background: 'linear-gradient(135deg, #030712 0%, #1e293b 50%, #030712 100%)',
      surface: 'rgba(255, 255, 255, 0.02)',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.05)',
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
    },
    gradients: {
      main: 'linear-gradient(135deg, #030712 0%, #1e293b 50%, #030712 100%)',
      button: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.6))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.005))',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Deep blue ocean-inspired theme',
    preview: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: '#164e63',
    },
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #164e63 0%, #0c4a6e 50%, #164e63 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#f0f9ff',
      textSecondary: '#bae6fd',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    gradients: {
      main: 'linear-gradient(135deg, #164e63 0%, #0c4a6e 50%, #164e63 100%)',
      button: 'linear-gradient(135deg, rgba(8, 145, 178, 0.8), rgba(14, 116, 144, 0.6))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm sunset colors with orange and pink',
    preview: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#ec4899',
      background: '#7c2d12',
    },
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #7c2d12 0%, #92400e 50%, #7c2d12 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#fef7ff',
      textSecondary: '#fed7aa',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
    },
    gradients: {
      main: 'linear-gradient(135deg, #7c2d12 0%, #92400e 50%, #7c2d12 100%)',
      button: 'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.6))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
    },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural green theme inspired by forests',
    preview: {
      primary: '#16a34a',
      secondary: '#15803d',
      accent: '#059669',
      background: '#14532d',
    },
    colors: {
      primary: '#16a34a',
      secondary: '#15803d',
      accent: '#059669',
      background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #14532d 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#f0fdf4',
      textSecondary: '#bbf7d0',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
    },
    gradients: {
      main: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #14532d 100%)',
      button: 'linear-gradient(135deg, rgba(22, 163, 74, 0.8), rgba(21, 128, 61, 0.6))',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast neon cyberpunk aesthetic',
    preview: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#0080ff',
      background: '#0a0a0a',
    },
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#0080ff',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
      surface: 'rgba(255, 255, 255, 0.03)',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: 'rgba(255, 0, 128, 0.2)',
      success: '#00ff80',
      warning: '#ffff00',
      error: '#ff0040',
    },
    gradients: {
      main: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
      button: 'linear-gradient(135deg, rgba(255, 0, 128, 0.8), rgba(0, 255, 128, 0.3))',
      card: 'linear-gradient(135deg, rgba(255, 0, 128, 0.05), rgba(0, 255, 128, 0.02))',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Light',
    description: 'Clean and minimal light theme',
    preview: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#f9fafb',
    },
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)',
      surface: 'rgba(0, 0, 0, 0.02)',
      text: '#111827',
      textSecondary: '#6b7280',
      border: 'rgba(0, 0, 0, 0.1)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    gradients: {
      main: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)',
      button: 'linear-gradient(135deg, rgba(55, 65, 81, 0.9), rgba(107, 114, 128, 0.7))',
      card: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.01))',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Mystical aurora-inspired theme',
    preview: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#10b981',
      background: '#1e1b4b',
    },
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a8a 50%, #312e81 75%, #1e1b4b 100%)',
      surface: 'rgba(255, 255, 255, 0.04)',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: 'rgba(139, 92, 246, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    gradients: {
      main: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a8a 50%, #312e81 75%, #1e1b4b 100%)',
      button: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(6, 182, 212, 0.4))',
      card: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.02))',
    },
  },
];

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        settings: {
          ...state.settings,
          theme: action.payload,
        },
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

const initialState: ThemeState = {
  currentTheme: 'cyaphire',
  settings: defaultSettings,
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    const savedSettings = localStorage.getItem('deploidx_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
        if (settings.theme) {
          dispatch({ type: 'SET_THEME', payload: settings.theme });
        }
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('deploidx_settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const setTheme = (theme: ThemeType) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const currentThemeData = availableThemes.find(t => t.id === state.currentTheme) || availableThemes[0];

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const theme = currentThemeData;
    
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--gradient-main', theme.gradients.main);
    root.style.setProperty('--gradient-button', theme.gradients.button);
    root.style.setProperty('--gradient-card', theme.gradients.card);
    
    // Apply animations setting
    if (!state.settings.animations) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
    }
  }, [currentThemeData, state.settings.animations]);

  return (
    <ThemeContext.Provider value={{
      currentTheme: state.currentTheme,
      theme: currentThemeData,
      settings: state.settings,
      setTheme,
      updateSettings,
      availableThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};