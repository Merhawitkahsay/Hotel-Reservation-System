import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BedDouble, CalendarDays, FileText, LogOut, Settings } from 'lucide-react';
import { Brush, Wrench } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();

  // Helper to determine active link style
  const getLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive 
        ? "bg-text-secondary text-white shadow-md" 
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 flex items-center justify-center border-b border-white/10">
           <h2 className="text-2xl font-serif font-bold text-white tracking-wider">
             ህድሞና<span className="text-text-secondary">ADMIN</span>
           </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin/dashboard" className={getLinkClass('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/guests" className={getLinkClass('guests')}>
            <Users size={20} /> Guests
          </Link>
          <Link to="/admin/rooms" className={getLinkClass('rooms')}>
            <BedDouble size={20} /> Rooms
          </Link>
          <Link to="/admin/reservations" className={getLinkClass('reservations')}>
            <CalendarDays size={20} /> Reservations
          </Link>
          <Link to="/admin/audit-logs" className={getLinkClass('audit-logs')}>
            <ShieldCheck size={20} /> Audit Logs
          </Link>
          <Link to="/admin/emails" className={getLinkClass('emails')}>
            <Mail size={20} /> Email Service
          </Link>
          <Link to="/admin/housekeeping" className={getLinkClass('housekeeping')}>
            <Brush size={20} /> 
            <span>Housekeeping</span>
          </Link>
          <Link to="/admin/reports" className={getLinkClass('reports')}>
            <FileText size={20} /> Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname.split('/').pop()}
          </h2>
          <div className="flex items-center gap-4">
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Settings size={20} />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-700">Admin User</p>
                  <p className="text-xs text-gray-500">Manager</p>
                </div>
                <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  AU
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;