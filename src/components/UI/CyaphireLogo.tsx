import React from 'react';

interface CyaphireLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CyaphireLogo: React.FC<CyaphireLogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2">
        <span className={`${textSizes[size]} font-bold text-bolt-dark-50`}>
          Cyaphire
        </span>
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-pulse`}>
          AI
        </span>
        <span className={`${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-base'} font-bold text-cyan-400`}>
          X
        </span>
      </div>
      <span className="text-xs text-bolt-dark-400 font-medium tracking-wider mt-1 opacity-80">
        powered by DeploidX
      </span>
    </div>
  );
};