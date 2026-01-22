import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // 1. Clear authentication tokens/storage here
    // localStorage.removeItem('token');
    // sessionStorage.clear();

    // 2. Simulate a brief delay for a professional feel
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      
      // 3. Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-12 rounded-2xl shadow-2xl text-center border border-gray-100">
        {/* Animated Icon Container */}
        <div className="relative mb-8 flex justify-center">
          <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
            <LogOut size={48} className="text-primary" />
          </div>
          <div className="absolute inset-0 h-24 w-24 border-4 border-text-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-primary mb-2">
          Signing Out
        </h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Please wait while we securely end your session. You will be redirected to the login page shortly.
        </p>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-3 py-3 px-6 bg-gray-50 rounded-lg text-sm font-medium text-gray-600">
          {isRedirecting ? (
            <span className="flex items-center gap-2 text-green-600 animate-in fade-in">
              <Loader2 className="animate-spin" size={18} /> Redirecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Processing secure logout...
            </span>
          )}
        </div>

        {/* Branding Footer */}
        <div className="mt-12">
          <span className="text-xl font-serif font-bold text-primary tracking-widest">
            LUX<span className="text-text-secondary">HOTEL</span>
          </span>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="mt-8 text-gray-400 text-xs uppercase tracking-[0.3em]">
        Defined by Luxury & Security
      </div>
    </div>
  );
};

export default Logout;