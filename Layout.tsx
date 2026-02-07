import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-black flex justify-center font-sans">
      <div className={`w-full max-w-md bg-black flex flex-col h-screen overflow-hidden relative ${className}`}>
        {children}
      </div>
    </div>
  );
};