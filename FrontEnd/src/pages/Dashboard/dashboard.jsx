import React, { useEffect, useState } from 'react';
import { 
  getOccupancyStats, 
  getDailyReport 
} from '../../services/reportService';
import { formatCurrency } from '../../utils/formatter';
import { 
  TrendingUp, 
  Users, 
  BedDouble, 
  DollarSign,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    occupancy: 0,
    dailyRevenue: 0,
    activeReservations: 0,
    totalGuests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch data from real database services
        const [occupancyData, dailyData] = await Promise.all([
          getOccupancyStats(), // Maps to vw_daily_occupancy
          getDailyReport()     // Maps to /api/reports/daily
        ]);

        setStats({
          occupancy: occupancyData.occupancy_rate || 0,
          dailyRevenue: dailyData.total_revenue || 0,
          activeReservations: dailyData.active_bookings || 0,
          totalGuests: dailyData.guest_count || 0
        });
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { 
      label: 'Occupancy Rate', 
      value: `${stats.occupancy}%`, 
      icon: <BedDouble className="text-blue-600" />, 
      trend: '+2.5%', 
      color: 'bg-blue-50' 
    },
    { 
      label: 'Today\'s Revenue', 
      value: formatCurrency(stats.dailyRevenue), 
      icon: <DollarSign className="text-green-600" />, 
      trend: '+12%', 
      color: 'bg-green-50' 
    },
    { 
      label: 'Active Bookings', 
      value: stats.activeReservations, 
      icon: <Calendar className="text-purple-600" />, 
      trend: '+4', 
      color: 'bg-purple-50' 
    },
    { 
      label: 'Total Guests', 
      value: stats.totalGuests, 
      icon: <Users className="text-amber-600" />, 
      trend: 'Steady', 
      color: 'bg-amber-50' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">System Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time data from ህድሞና Reservation Database</p>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                <TrendingUp size={12} /> {card.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-bold text-primary mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-primary">Recent Reservations</h3>
            <button className="text-xs text-text-secondary font-bold hover:underline">VIEW ALL</button>
          </div>
          <div className="space-y-4">
            {/* Logic here would map over the latest 5 reservations from reservationService */}
            <p className="text-center text-gray-400 py-10 italic">Fetching latest activity...</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl mb-2">Quick Operations</h3>
            <p className="text-white/60 text-sm mb-6">Common administrative tasks</p>
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 py-3 px-4 rounded-xl text-left text-sm flex justify-between items-center group transition-all">
                Check-in Guest <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 py-3 px-4 rounded-xl text-left text-sm flex justify-between items-center group transition-all">
                Available Rooms <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 py-3 px-4 rounded-xl text-left text-sm flex justify-between items-center group transition-all">
                Generate Report <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">ህድሞና v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;