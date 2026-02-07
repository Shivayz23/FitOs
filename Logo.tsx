import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-20 h-20 rounded-2xl',
    xl: 'w-32 h-32 rounded-3xl'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-500/20 ${className}`}>
        {/* Using a stable icon URL for the white bicep */}
        <img 
            src="https://img.icons8.com/ios-filled/100/ffffff/flex-biceps.png" 
            alt="FitOs Logo" 
            className={`${iconSizes[size]} object-contain`}
        />
    </div>
  );
};