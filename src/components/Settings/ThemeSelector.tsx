import React from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeType } from '../../types';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Palette className="w-6 h-6 text-white" />
        <h3 className="text-xl font-semibold text-white">Theme Selection</h3>
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </div>
      
      <p className="text-gray-300 text-sm">
        Choose from our collection of beautiful themes to customize your DeploidX experience
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableThemes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 ${
              currentTheme === theme.id
                ? 'border-white/30 bg-white/10 vision-glow'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
            }`}
          >
            {/* Theme Preview */}
            <div className="relative mb-4 h-24 rounded-lg overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ background: theme.preview.background }}
              >
                <div className="absolute inset-2 rounded border border-white/20">
                  <div className="flex h-full">
                    <div 
                      className="w-1/3 rounded-l"
                      style={{ backgroundColor: theme.preview.primary + '40' }}
                    />
                    <div 
                      className="w-1/3"
                      style={{ backgroundColor: theme.preview.secondary + '40' }}
                    />
                    <div 
                      className="w-1/3 rounded-r"
                      style={{ backgroundColor: theme.preview.accent + '40' }}
                    />
                  </div>
                </div>
                
                {/* Color dots */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">{theme.name}</h4>
                {currentTheme === theme.id && (
                  <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {theme.description}
              </p>
            </div>

            {/* Selection Indicator */}
            {currentTheme === theme.id && (
              <div className="absolute inset-0 rounded-xl border-2 border-white/30 bg-white/5 pointer-events-none">
                <div className="absolute top-2 left-2 flex items-center space-x-1 bg-white/20 rounded-full px-2 py-1">
                  <Check className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">Active</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Theme Info */}
      <div className="glass-strong rounded-xl p-4 border border-white/20">
        <h4 className="font-medium text-white mb-2">Current Theme</h4>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {availableThemes.find(t => t.id === currentTheme) && (
              <>
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: availableThemes.find(t => t.id === currentTheme)!.preview.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: availableThemes.find(t => t.id === currentTheme)!.preview.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: availableThemes.find(t => t.id === currentTheme)!.preview.accent }}
                />
              </>
            )}
          </div>
          <div>
            <p className="text-white font-medium">
              {availableThemes.find(t => t.id === currentTheme)?.name}
            </p>
            <p className="text-xs text-gray-300">
              {availableThemes.find(t => t.id === currentTheme)?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};