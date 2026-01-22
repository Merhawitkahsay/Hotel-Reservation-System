import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/authContext'; 
import Button from './button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isStaff = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'receptionist';

  // Logic for the Profile Link
{!isStaff && isAuthenticated && (
   <Link to="/profile" className="flex items-center gap-2">
      <span>Hi, {user?.first_name || 'Guest'}</span>
   </Link>
)}
  const isActive = (path) => 
    location.pathname === path ? "text-text-secondary" : "text-gray-600 hover:text-primary";

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-primary tracking-wider">
              ህድሞና<span className="text-text-secondary">Reservation</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-bold tracking-widest transition-colors ${isActive('/')}`}>HOME</Link>
            <Link to="/rooms" className={`text-sm font-bold tracking-widest transition-colors ${isActive('/rooms')}`}>ROOMS</Link>
            <Link to="/about" className={`text-sm font-bold tracking-widest transition-colors ${isActive('/about')}`}>ABOUT</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isStaff && (
                  <Link to="/admin/dashboard">
                    <Button variant="primary" className="text-xs px-5 py-2 flex items-center gap-2">
                      <User size={16} /> DASHBOARD
                    </Button>
                  </Link>
                )}
                
                {/* Guest Profile Link */}
                {!isStaff && (
                   <Link 
                    to="/profile" 
                    className="flex items-center gap-2 group cursor-pointer px-3"
                   >
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <User size={14} />
                     </div>
                     <span className="text-xs font-black text-gray-700 uppercase tracking-widest group-hover:text-primary transition-colors">
                       Hi, {user?.first_name || user?.name || 'Guest'}
                     </span>
                   </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <LogOut size={16} /> LOGOUT
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-primary hover:text-text-secondary transition-colors">
                  LOGIN
                </Link>
                <Link to="/register">
                  <Button variant="secondary" className="text-xs px-6 py-2">
                    REGISTER
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-700">Home</Link>
            <Link to="/rooms" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-700">Rooms</Link>
            {!isStaff && <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-700">My Profile</Link>}
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  {isStaff && (
                    <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">Go to Dashboard</Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;