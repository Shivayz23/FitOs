import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glass';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-full font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#bef264] text-black hover:bg-[#a3e635]", // Lime-300 to 400
    secondary: "bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]",
    outline: "border border-zinc-700 text-zinc-300 hover:border-[#bef264] hover:text-[#bef264]",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};