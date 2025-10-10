import React from 'react';
import { Settings, Palette, Zap, Bell, RefreshCw, Monitor, Save } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useTheme();

  const handleToggle = (setting: keyof typeof settings) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  const settingsOptions = [
    {
      id: 'animations' as keyof typeof settings,
      label: 'Animations',
      description: 'Enable smooth animations and transitions',
      icon: Zap,
    },
    {
      id: 'notifications' as keyof typeof settings,
      label: 'Notifications',
      description: 'Show system notifications and alerts',
      icon: Bell,
    },
    {
      id: 'autoRefresh' as keyof typeof settings,
      label: 'Auto Refresh',
      description: 'Automatically refresh data every 30 seconds',
      icon: RefreshCw,
    },
    {
      id: 'compactMode' as keyof typeof settings,
      label: 'Compact Mode',
      description: 'Use a more compact interface layout',
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-white" />
        <div>
          <h2 className="text-3xl font-bold text-white">Application Settings</h2>
          <p className="text-gray-300 text-sm mt-1">
            Customize your DeploidX experience with themes and preferences
          </p>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="glass rounded-2xl p-6 vision-glow">
        <ThemeSelector />
      </div>

      {/* General Settings */}
      <div className="glass rounded-2xl p-6 vision-glow">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-white" />
          <h3 className="text-xl font-semibold text-white">General Settings</h3>
        </div>

        <div className="space-y-4">
          {settingsOptions.map((option) => {
            const Icon = option.icon;
            const isEnabled = settings[option.id] as boolean;
            
            return (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 glass-strong rounded-lg border border-white/10 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-300" />
                  <div>
                    <h4 className="font-medium text-white">{option.label}</h4>
                    <p className="text-sm text-gray-300">{option.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggle(option.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                    isEnabled 
                      ? 'bg-gradient-to-r from-vivid-purple to-neon-blue' 
                      : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Summary */}
      <div className="glass rounded-2xl p-6 vision-glow">
        <div className="flex items-center space-x-3 mb-4">
          <Save className="w-6 h-6 text-aqua-green" />
          <h3 className="text-xl font-semibold text-white">Settings Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 glass-strong rounded-lg">
            <Palette className="w-6 h-6 text-vivid-purple mx-auto mb-2" />
            <p className="text-xs text-gray-300">Theme</p>
            <p className="text-sm font-medium text-white capitalize">
              {settings.theme.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
          
          <div className="text-center p-3 glass-strong rounded-lg">
            <Zap className={`w-6 h-6 mx-auto mb-2 ${settings.animations ? 'text-aqua-green' : 'text-gray-400'}`} />
            <p className="text-xs text-gray-300">Animations</p>
            <p className="text-sm font-medium text-white">
              {settings.animations ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          
          <div className="text-center p-3 glass-strong rounded-lg">
            <Bell className={`w-6 h-6 mx-auto mb-2 ${settings.notifications ? 'text-aqua-green' : 'text-gray-400'}`} />
            <p className="text-xs text-gray-300">Notifications</p>
            <p className="text-sm font-medium text-white">
              {settings.notifications ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          
          <div className="text-center p-3 glass-strong rounded-lg">
            <RefreshCw className={`w-6 h-6 mx-auto mb-2 ${settings.autoRefresh ? 'text-aqua-green' : 'text-gray-400'}`} />
            <p className="text-xs text-gray-300">Auto Refresh</p>
            <p className="text-sm font-medium text-white">
              {settings.autoRefresh ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-aqua-green/10 border border-aqua-green/20 rounded-lg">
          <p className="text-sm text-aqua-green text-center">
            ✅ Settings are automatically saved to your browser
          </p>
        </div>
      </div>
    </div>
  );
};