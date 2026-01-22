import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { SlidersHorizontal, BedDouble, User, Home, Loader2, Plus, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomManagement = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]); 
  const [roomTypes, setRoomTypes] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    capacity: ''
  });

  // 1. DATA FETCHING
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rooms', { params: filters });
      let roomArray = [];
      if (response.data?.success && Array.isArray(response.data.data.rooms)) {
        roomArray = response.data.data.rooms;
      } else if (Array.isArray(response.data)) {
        roomArray = response.data;
      }
      setRooms(roomArray);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms([]); 
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await api.get('/rooms/types');
      if (response.data?.success) setRoomTypes(response.data.data);
    } catch (err) {
      console.warn("Could not load dynamic types");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []); 

  // 2. EVENT HANDLERS
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id, roomNumber) => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
      try {
        const res = await api.delete(`/rooms/${id}`);
        if (res.data.success) {
          setRooms(prev => prev.filter(r => r.room_id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete room.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing Property Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 font-serif uppercase tracking-tighter">Room <span className="text-amber-600">Management</span></h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Property Inventory & Control</p>
          </div>
          
          <button 
            onClick={() => navigate('/admin/rooms/add')}
            className="h-14 px-8 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-amber-600 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
          >
            <Plus size={18} /> Add New Property
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-end">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Type</label>
                   <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-amber-600 transition-all appearance-none">
                      <option value="">All Types</option>
                      {roomTypes.map((type, index) => {
                        const typeName = typeof type === 'object' ? type.type_name : type;
                        return <option key={index} value={typeName}>{typeName}</option>;
                      })}
                   </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Min Price</label>
                  <input type="number" name="minPrice" placeholder="0" value={filters.minPrice} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-amber-600 transition-all"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Max Price</label>
                  <input type="number" name="maxPrice" placeholder="Any" value={filters.maxPrice} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-amber-600 transition-all"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Guests</label>
                  <input type="number" name="capacity" placeholder="1" value={filters.capacity} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-amber-600 transition-all"/>
                </div>
             </div>
             <button onClick={fetchRooms} className="h-14 px-8 bg-gray-100 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2">
               <SlidersHorizontal size={14} /> Update List
             </button>
          </div>
        </div>

        {/* ROOM CARDS GRID */}
        
        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <BedDouble size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900 font-serif">No Rooms Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rooms.map((room) => (
              <div key={room.room_id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                
                {/* Image & Admin Actions Overlay */}
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img 
                    src={room.main_image_url ? `http://localhost:5000/${room.main_image_url}` : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39'} 
                    alt="room" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${
                    room.status === 'available' ? 'bg-green-500/20 text-green-600' : 'bg-amber-500/20 text-amber-600'
                  }`}>
                    {room.status}
                  </div>

                  {/* ADMIN QUICK ACTIONS (Visible on Hover) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={() => navigate(`/admin/rooms/edit/${room.room_id}`)}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-amber-600 hover:text-white transition-all shadow-xl"
                        title="Edit Room"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.room_id, room.room_number)}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-xl"
                        title="Delete Room"
                      >
                        <Trash2 size={18} />
                      </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 font-serif leading-tight">Room {room.room_number}</h3>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">{room.room_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900">{room.final_price} <span className="text-xs">ETB</span></p>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Per Night</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 py-4 border-y border-gray-50 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-[10px] font-black text-gray-500 uppercase">Max Occupancy: {room.max_occupancy}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/rooms/${room.room_id}`)}
                    className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-black hover:text-white transition-all duration-300"
                  >
                    View Guest Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;