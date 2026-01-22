import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';
import { 
  Wifi, Coffee, Wind, Tv, CheckCircle, 
  ArrowLeft, CalendarCheck, Star, Heart, Loader2 
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // --- 1. CORE DATA FETCHING ---
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Main Room Details
        const res = await api.getRoomById(id);
        
        if (res.data?.success) {
          setRoom(res.data.data);
        } else {
          // Fallback if the backend sends the object directly
          setRoom(res.data);
        }

        // --- 2. OPTIONAL: FETCH SAVED STATUS ---
        // We do this inside the same effect but wrapped so it doesn't crash the page if it fails
        if (user && typeof api.getSavedRooms === 'function') {
          try {
            const savedRes = await api.getSavedRooms();
            if (savedRes.data?.success) {
              const alreadySaved = savedRes.data.data.some(
                (saved) => saved.room_id === parseInt(id)
              );
              setIsSaved(alreadySaved);
            }
          } catch (savedErr) {
            console.warn("Could not check saved status (ignoring):", savedErr);
          }
        }

      } catch (err) {
        console.error("Room fetch error:", err);
        setError("Unable to load room details. Please try again later.");
      } finally {
        // ✅ ALWAYS stop loading, even on 500/501 errors
        setLoading(false);
      }
    };

    if (id) fetchRoomData();
  }, [id, user]);

  // --- 3. EVENT HANDLERS ---
  const handleBookNow = () => {
    if (!user) return navigate('/login');
    // Ensure room exists before navigating
    if (room?.room_id) {
      navigate(`/reservation/${room.room_id}`);
    }
  };
const handleToggleSave = async () => {
  if (!user) {
    alert("Please login to save rooms to your waitlist.");
    return navigate('/login');
  }

  setSaveLoading(true);
  try {
    // FIX: Ensure the key is 'roomId' to match the backend req.body.roomId
    const response = await api.toggleSavedRoom(id); 
    
    if (response.data?.success) {
      setIsSaved(response.data.isSaved);
    }
  } catch (err) {
    console.error("Save error:", err);
    // This is the error you are seeing:
    alert("Failed to update waitlist. Ensure you are logged in.");
  } finally {
    setSaveLoading(false);
  }
};
  const getAmenityIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('wifi')) return <Wifi size={18} className="text-amber-600" />;
    if (lower.includes('coffee')) return <Coffee size={18} className="text-amber-600" />;
    if (lower.includes('ac') || lower.includes('air')) return <Wind size={18} className="text-amber-600" />;
    if (lower.includes('tv')) return <Tv size={18} className="text-amber-600" />;
    return <Star size={18} className="text-amber-600" />;
  };

  // --- 4. RENDER LOGIC ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Luxury...</p>
    </div>
  );

  if (error || !room) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-black text-gray-900 mb-4">Oops!</h2>
      <p className="text-gray-500 mb-8">{error || "Room not found."}</p>
      <button onClick={() => navigate('/rooms')} className="px-8 py-3 bg-black text-white rounded-xl font-bold">
        Back to Rooms
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black font-bold mb-6 transition-colors">
          <ArrowLeft size={20} /> Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Section */}
          <div className="space-y-4">
            <div className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] bg-white relative">
              {room.main_image_url ? (
                <img 
                  src={`http://localhost:5000/${room.main_image_url.replace(/\\/g, '/')}`} 
                  alt={`Room ${room.room_number}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/800x600?text=No+Image+Available'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold bg-gray-100 uppercase tracking-widest text-xs">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Right: Content Section */}
          <div className="flex flex-col h-full">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-2 font-serif">Room {room.room_number}</h1>
                  <span className="inline-block px-4 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {room.room_type || room.type_name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-gray-900">{room.final_price || room.base_price} ETB</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Per Night</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-500 mb-8 leading-relaxed font-medium">
                {room.description || "Experience unparalleled comfort in this meticulously designed room, featuring modern amenities and elegant decor."}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-600 font-bold text-xs uppercase tracking-tight">
                      {getAmenityIcon(amenity)} {amenity}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Standard Amenities Included</p>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                   <CalendarCheck size={18} className="text-green-600"/> Booking Includes
                 </h3>
                 <ul className="space-y-2 text-xs text-gray-500 font-bold">
                   {room.special_features && room.special_features.length > 0 ? (
                     room.special_features.map((feature, idx) => (
                       <li key={idx} className="flex items-center gap-2">
                         <CheckCircle size={14} className="text-green-500" /> {feature}
                       </li>
                     ))
                   ) : (
                     <>
                       <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Standard Housekeeping</li>
                       <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 24/7 Concierge Support</li>
                     </>
                   )}
                 </ul>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4">
                <button 
                  onClick={handleToggleSave}
                  disabled={saveLoading}
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all ${
                    isSaved 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'border-gray-100 text-gray-400 hover:border-black hover:text-black'
                  }`}
                >
                  <Heart size={24} fill={isSaved ? "currentColor" : "none"} className={saveLoading ? "animate-pulse" : ""} />
                </button>

                <button 
                  onClick={handleBookNow}
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 hover:shadow-xl transition-all"
                >
                  Book This Room
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;