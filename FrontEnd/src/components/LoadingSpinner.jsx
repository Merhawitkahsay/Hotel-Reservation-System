import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false }) => {
  const containerClass = fullPage ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center" : "flex justify-center p-8";
  
  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-text-secondary" size={40} />
        <span className="text-primary font-serif italic font-medium">Loading Luxury...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

