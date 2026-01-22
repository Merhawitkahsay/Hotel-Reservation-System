import React, { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { Search, Calendar, User, Hash, Filter, ChevronRight, RefreshCcw, Loader2 } from 'lucide-react';

const AdminReservationsList = () => {
  const [reservations, setReservations] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      // Hits the getAllReservations method in the backend controller
      const res = await api.get('/reservations');
      
      if (res.data && res.data.success) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setReservations(data);
        setFilteredData(data);
      }
    } catch (err) {
      console.error("Frontend Fetch Error:", err.response?.data?.message || err.message);
      // Ensure we don't crash if data is missing
      setReservations([]);
    } finally {
      // THIS IS THE MOST IMPORTANT LINE: 
      // It stops the "Syncing" screen regardless of success or failure.
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  useEffect(() => {
    const results = reservations.filter(res => {
      const matchesSearch = 
        res.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.room_number?.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredData(results);
  }, [searchTerm, statusFilter, reservations]);


  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-serif mb-2">
              Management <span className="text-amber-600">Console</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
              Project ህድሞ • Central Reservation System
            </p>
          </div>
          <button 
            onClick={fetchAllReservations}
            disabled={loading}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />} 
            {loading ? "Syncing..." : "Refresh Data"}
          </button>
        </div>

        {/*  FILTERS BAR */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text"
              placeholder="Search by Guest Name or Room Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 rounded-xl pl-12 pr-6 py-3 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest outline-none border-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="checked-in">Checked In</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black text-white text-left">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Guest Info</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Room Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Dates</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Revenue</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">Check-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && filteredData.length === 0 ? (
                  /* Inline loading state instead of full page */
                  <tr>
                    <td colSpan="6" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-amber-600" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Records...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((res) => (
                    <tr key={res.reservation_id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3 text-sm font-black text-gray-900">
                          <User size={16} className="text-gray-300" />
                          {res.first_name} {res.last_name}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="bg-black text-white text-[10px] font-black px-2 py-1 rounded inline-block">
                          {res.room_number}
                        </div>
                      </td>
                      <td className="p-6 text-xs font-bold text-gray-500">
                        {new Date(res.check_in_date).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-sm font-black text-amber-600">
                        {parseFloat(res.total_amount).toLocaleString()} ETB
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          res.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button className="px-4 py-2 bg-amber-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-black transition-all">
                          Check In
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReservationsList;