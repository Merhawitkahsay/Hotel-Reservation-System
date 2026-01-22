
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { SlidersHorizontal, Plus, User, Home, Loader2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const RoomList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]); 
  const [roomTypes, setRoomTypes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', minPrice: '', maxPrice: '', capacity: '' });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.getRooms(filters);
      if (response.data?.success) {
        setRooms(response.data.data || []);
      }
    } catch (err) {
      console.error("Room fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await api.getRoomTypes();
      if (response.data?.success) {
        setRoomTypes(response.data.data);
      }
    } catch (err) {
      console.error("Type fetch failed", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []); 

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Rooms Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4 font-serif uppercase tracking-tighter italic italic">Our <span className="text-amber-600">Rooms</span></h1>
        </div>

        {/* ADD ROOM (Admin only, Right aligned) */}
        {user?.role === 'admin' && (
          <div className="flex justify-end mb-3">
            <button onClick={() => navigate('/admin/rooms/add')} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-amber-600 transition-all">
              <Plus size={14} /> Add Room
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-end">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Type</label>
                   <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none appearance-none">
                      <option value="">All Types</option>
                      {roomTypes.map((t, i) => <option key={i} value={t.type_name}>{t.type_name}</option>)}
                   </select>
                </div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Min Price</label><input type="number" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Max Price</label><input type="number" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Guests</label><input type="number" value={filters.capacity} onChange={(e) => setFilters({...filters, capacity: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none" /></div>
             </div>
             <button onClick={fetchRooms} className="h-12 px-8 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2">
               <SlidersHorizontal size={14} /> Filter
             </button>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.room_id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-2xl">
              <div className="relative h-72 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => navigate(`/rooms/${room.room_id}`)}>
                {room.main_image_url && <img src={`http://localhost:5000/${room.main_image_url.replace(/\\/g, '/')}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Room" />}
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${room.status === 'available' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {room.status}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 font-serif leading-tight">Room {room.room_number}</h3>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{room.type_name}</p>
                  </div>
                  <p className="text-2xl font-black text-gray-900 leading-tight">{room.base_price} <span className="text-xs">ETB</span></p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-8 border-y border-gray-50 py-4">
                  <User size={14} className="text-amber-600" />
                  <span className="text-[11px] font-bold uppercase">Max {room.max_occupancy} Guests</span>
                </div>
                <div className="mt-6 flex gap-2">
                  {user?.role === 'admin' ? (
                    <button onClick={() => navigate(`/admin/rooms/edit/${room.room_id}`)} className="flex-1 py-4 bg-amber-600 text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-colors"><Edit3 size={14} /> Edit Room</button>
                  ) : (
                    <button onClick={() => navigate(`/rooms/${room.room_id}`)} className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase text-[10px] group-hover:bg-black group-hover:text-white transition-all">View Details</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;