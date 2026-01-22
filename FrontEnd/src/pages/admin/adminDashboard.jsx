import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { 
  BedDouble, Users, CalendarDays, TrendingUp, 
  Settings, ShieldCheck, Loader2, ClipboardList 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dbStats, setDbStats] = useState({
    total_bookings: 0, total_revenue: 0, active_guests: 0, rooms_available: 0
  });

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      if (res.data?.success) setDbStats(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Bookings', value: dbStats.total_bookings, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Revenue', value: `${(dbStats.total_revenue || 0).toLocaleString()} ETB`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Guests', value: dbStats.active_guests, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Rooms Available', value: dbStats.rooms_available, icon: BedDouble, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const actions = [
    { title: 'Room Management', desc: 'Update existing rooms', icon: BedDouble, path: '/rooms', color: 'bg-blue-600' },
    { title: 'Reservations', desc: 'Manage guest bookings', icon: CalendarDays, path: '/admin/reservations', color: 'bg-purple-600' },
    { title: 'Guest Directory', desc: 'Manage profiles', icon: Users, path: '/admin/guests', color: 'bg-orange-600' },
    { title: 'Report Audit Log', desc: 'Review system activities', icon: ClipboardList, path: '/admin/audit-logs', color: 'bg-amber-600' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-600" size={48} /></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 font-serif uppercase tracking-tighter italic">Admin <span className="text-amber-600">Dashboard</span></h1>
            <p className="text-gray-500 mt-2 font-medium">Welcome, {user?.name}. Manage the ህድሞ ecosystem.</p>
          </div>
          <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={16}/> {user?.role}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={28} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-6 font-serif uppercase italic flex items-center gap-2">
          <Settings size={22} className="text-amber-600"/> Management Console
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, i) => (
  <div 
    key={i} 
    // This is the trigger that uses the 'path' from the actions array
    onClick={() => navigate(action.path)} 
    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
  >
    <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/10`}>
      <action.icon size={28} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
      {action.title}
    </h3>
    <p className="text-gray-400 text-xs font-medium">{action.desc}</p>
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;