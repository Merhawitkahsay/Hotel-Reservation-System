import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BedDouble, FileText, Brush, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../context/authContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Helper to check if user is allowed to see admin links
  const isStaff = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'receptionist';

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, staffOnly: true },
    { label: 'Guests', path: '/admin/guests', icon: <Users size={20} />, staffOnly: true },
    { label: 'Rooms', path: '/admin/rooms', icon: <BedDouble size={20} />, staffOnly: true },
    { label: 'Reports', path: '/admin/reports', icon: <FileText size={20} />, staffOnly: true },
    { label: 'Operations', isHeader: true, staffOnly: true },
    { label: 'Housekeeping', path: '/admin/housekeeping', icon: <Brush size={20} />, staffOnly: true },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <ShieldCheck size={20} />, staffOnly: true },
    { label: 'Email Service', path: '/admin/emails', icon: <Mail size={20} />, staffOnly: true },
  ];

  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      {links.map((link, i) => {
        // If the link is for staff only and the user is NOT staff, skip it
        if (link.staffOnly && !isStaff) return null;

        return link.isHeader ? (
          <p key={i} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mt-6 mb-2">
            {link.label}
          </p>
        ) : (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              location.pathname.includes(link.path) 
                ? "bg-text-secondary text-white shadow-lg" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;