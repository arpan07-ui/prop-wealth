import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-gradient text-black hover:bg-brand-neon shadow-brand-glow hover:shadow-brand-neon border border-brand-accent/20",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm",
    outline: "border border-brand-accent text-brand-accent hover:bg-brand-accent/10 shadow-brand-glow",
    ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-bold uppercase tracking-wider",
    md: "px-5 py-2.5 text-sm font-bold uppercase tracking-widest",
    lg: "px-8 py-4 text-base font-black uppercase tracking-[0.1em]",
    xl: "px-10 py-5 text-lg font-black uppercase tracking-[0.2em]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
