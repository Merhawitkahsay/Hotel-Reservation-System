import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom'; // Added Outlet

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    if (userRole === 'guest') {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your account type (<span className="text-primary font-bold">{user.role}</span>) 
            does not have permission to access the requested page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  // THE CRITICAL CHANGE:
  // If children exists (wrapped), render children. 
  // If no children (nested route), render Outlet.
  return children ? children : <Outlet />; 
};

export default ProtectedRoute;