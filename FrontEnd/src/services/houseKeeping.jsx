import React, { useEffect, useState } from 'react';
import { getAllRooms, updateRoom } from '../../services/roomService';
import { ROOM_STATUS } from '../../utils/constants';
import { Brush, Wrench, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';

const Housekeeping = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Fetch all rooms to see status across the board
      const data = await getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error loading housekeeping data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      // Maps to PUT /api/rooms/:id
      await updateRoom(roomId, { status: newStatus });
      fetchRooms(); // Refresh list to show updated status
    } catch (err) {
      alert("Failed to update room status");
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.room_number.includes(filter) || room.type_name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">Housekeeping & Maintenance</h2>
          <p className="text-sm text-gray-500">Manage room readiness and service states</p>
        </div>
        <SearchBar 
          placeholder="Filter by room number..." 
          value={filter} 
          onChange={setFilter}
          className="w-full md:w-72"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.room_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Floor {room.floor}</span>
                <h3 className="text-xl font-bold text-primary">Room {room.room_number}</h3>
              </div>
              <div className={`p-2 rounded-lg ${
                room.status === ROOM_STATUS.AVAILABLE ? 'bg-green-50 text-green-600' :
                room.status === ROOM_STATUS.CLEANING ? 'bg-blue-50 text-blue-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {room.status === ROOM_STATUS.AVAILABLE && <CheckCircle size={20} />}
                {room.status === ROOM_STATUS.CLEANING && <Brush size={20} />}
                {room.status === ROOM_STATUS.MAINTENANCE && <Wrench size={20} />}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium text-primary">{room.type_name}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleStatusUpdate(room.room_id, ROOM_STATUS.AVAILABLE)}
                  className={`text-[10px] font-bold py-2 rounded border transition-all ${
                    room.status === ROOM_STATUS.AVAILABLE 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-200 text-gray-400 hover:border-green-600 hover:text-green-600'
                  }`}
                >
                  READY
                </button>
                <button 
                  onClick={() => handleStatusUpdate(room.room_id, ROOM_STATUS.CLEANING)}
                  className={`text-[10px] font-bold py-2 rounded border transition-all ${
                    room.status === ROOM_STATUS.CLEANING 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-200 text-gray-400 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  CLEANING
                </button>
                <button 
                  onClick={() => handleStatusUpdate(room.room_id, ROOM_STATUS.MAINTENANCE)}
                  className={`text-[10px] font-bold py-2 rounded border transition-all ${
                    room.status === ROOM_STATUS.MAINTENANCE 
                    ? 'bg-amber-600 border-amber-600 text-white' 
                    : 'border-gray-200 text-gray-400 hover:border-amber-600 hover:text-amber-600'
                  }`}
                >
                  REPAIR
                </button>
              </div>
            </div>
            
            {room.status === ROOM_STATUS.OCCUPIED && (
              <div className="bg-primary/5 px-5 py-3 flex items-center gap-2 text-xs text-primary font-bold uppercase">
                <AlertTriangle size={14} /> Guest Currently In Room
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Housekeeping;