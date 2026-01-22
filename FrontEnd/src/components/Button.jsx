import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyles = "px-6 py-2.5 rounded font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-md",
    secondary: "bg-text-secondary text-white hover:bg-opacity-90 shadow-md",
    outline: "border border-text-secondary text-text-secondary hover:bg-text-secondary hover:text-white",
    ghost: "text-primary hover:bg-gray-100"
  };


  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;