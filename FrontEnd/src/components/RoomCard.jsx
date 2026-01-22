import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize, ChevronRight } from 'lucide-react';

const RoomCard = ({ room }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row h-auto md:h-64 border border-gray-100">
    <div className="w-full md:w-2/5 relative">
      <img src={room.image} alt={room.name} className="w-full h-64 md:h-full object-cover" />
    </div>
    <div className="flex-1 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-primary mb-2">{room.name}</h3>
        <div className="flex gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Users size={16} /> {room.guests} Guests</span>
          <span className="flex items-center gap-1"><Maximize size={16} /> {room.size}</span>
        </div>
      </div>
      <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-500 uppercase">Per Night</span>
          <div className="text-2xl font-bold text-primary">£{room.price}</div>
        </div>
        <Link to={`/rooms/${room.id}`} className="px-6 py-2 bg-text-secondary text-white rounded hover:bg-primary transition-colors flex items-center gap-2 font-medium">
          Details <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  </div>
);

export default RoomCard;