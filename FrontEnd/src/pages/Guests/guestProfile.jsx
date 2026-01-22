import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { 
  User, CheckCircle, Trash2, MapPin, CreditCard, Clock, 
  FileText, Calendar, Edit3, Phone, Heart, ArrowRight, Mail 
} from 'lucide-react';

const GuestProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [savedRooms, setSavedRooms] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  //  DATA FETCHING
  useEffect(() => {
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [profRes, resvRes, savedRes] = await Promise.allSettled([
        api.get('/guests/profile'),
        api.get('/reservations/my-bookings'),
        api.get('/guests/saved-rooms')
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data.success) {
        setProfile(profRes.value.data.data);
      }
      if (resvRes.status === 'fulfilled' && resvRes.value.data.success) {
        setReservations(resvRes.value.data.data);
      }
      if (savedRes.status === 'fulfilled' && savedRes.value.data.success) {
        setSavedRooms(savedRes.value.data.data);
      }
    } catch (err) {
      console.error("Critical Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (user) fetchAllData();
  else setLoading(false);
}, [user]);  
  //  HELPER FUNCTIONS
  const getProfileImage = () => {
    if (profile && profile.profile_picture) {
      const cleanPath = profile.profile_picture.replace(/\\/g, '/');
      return `http://localhost:5000/${cleanPath}`;
    }
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
      try {
        const response = await api.cancelReservation(id);
        if (response.data.success) {
          setReservations(prev => prev.map(res => 
            res.reservation_id === id ? { ...res, reservation_status: 'cancelled' } : res
          ));
        }
      } catch (err) {
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-primary">
      Syncing your data...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PROFILE DETAILS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center relative">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg border-4 border-white overflow-hidden relative z-10 group">
               <img 
                 src={getProfileImage()}
                 alt="Profile" 
                 className="w-full h-full object-cover"
                 onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
               />
               <button 
                  onClick={() => navigate('/profile/edit')}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Edit3 size={20} className="text-white" />
                </button>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-1 font-serif">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6">Verified Guest</p>
            
            <div className="space-y-5 pt-6 border-t border-gray-50 text-left">
              <div className="flex items-start gap-3 text-sm font-bold text-gray-600">
                <MapPin size={18} className="text-amber-600 mt-1 shrink-0"/> 
                <div>
                   <p className="leading-tight">{profile?.address || 'No address provided'}</p>
                   <p className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1">{profile?.nationality || 'Nationality not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <Mail size={18} className="text-amber-600 shrink-0"/> 
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <Phone size={18} className="text-amber-600 shrink-0"/> 
                <span>{profile?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <CreditCard size={18} className="text-amber-600 shrink-0"/> 
                <span>Passport: {profile?.id_number || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <Calendar size={18} className="text-amber-600 shrink-0"/> 
                <span>Born: {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <button onClick={() => navigate('/profile/edit')} className="w-full mt-8 py-4 bg-gray-50 text-gray-900 text-[10px] font-black uppercase rounded-2xl border border-gray-100 hover:bg-black hover:text-white transition-all shadow-sm">
              <Edit3 size={14} className="inline mr-2" /> Edit Profile Info
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RESERVATIONS & WAITLIST */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-8 px-4">
                <button 
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'text-black border-b-4 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Clock size={14} className="inline mr-2 mb-1"/> My Bookings
                </button>
                <button 
                    onClick={() => setActiveTab('saved')}
                    className={`pb-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'saved' ? 'text-black border-b-4 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Heart size={14} className="inline mr-2 mb-1"/> Saved Rooms <span className="ml-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[9px]">{savedRooms.length}</span>
                </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 min-h-[500px]">
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {reservations.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold uppercase text-[10px]">No active reservations found</p>
                    </div>
                  ) : (
                    reservations.map((res) => (
                      <div key={res.reservation_id} className="p-6 bg-gray-50 rounded-[2rem] flex flex-wrap justify-between items-center gap-4 border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
                        
                        <div className="space-y-2">
                          <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">
                            Room {res.room_number} <span className="text-gray-400 ml-2">({res.room_type})</span>
                          </h4>
                          
                          {/* Payment Status Badges (Integrated) */}
                          <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block ${
                            res.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 
                            res.payment_status === 'partially_paid' ? 'bg-orange-100 text-orange-600' :
                            res.payment_status === 'refund_due' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {res.payment_status?.replace('_', ' ') || 'PENDING'}
                          </span>

                          <p className="text-gray-500 text-sm font-medium">
                            {new Date(res.check_in_date).toLocaleDateString()} — {new Date(res.check_out_date).toLocaleDateString()}
                          </p>
                          
                          <div className="flex gap-4 mt-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                              Total: <span className="text-gray-900 font-black">{res.total_amount} ETB</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Action Buttons (Visible only if not cancelled) */}
                          {res.reservation_status !== 'cancelled' && (
                            <div className="flex items-center gap-2 mr-2 border-r pr-4 border-gray-200">
                              <button 
                                onClick={() => navigate(`/reservation/edit/${res.reservation_id}`)}
                                className="p-2.5 bg-white text-gray-600 rounded-xl border border-gray-100 hover:bg-black hover:text-white transition-all shadow-sm"
                                title="Edit Dates"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(res.reservation_id)}
                                className="p-2.5 bg-white text-red-500 rounded-xl border border-gray-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Cancel Booking"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}

                          {/* Conditional Pay Now Button */}
                          {(res.payment_status === 'pending' || res.payment_status === 'partially_paid') && res.reservation_status !== 'cancelled' && (
                            <button 
                              onClick={() => navigate(`/payment?ref=${res.reservation_id}&amount=${res.total_amount}`)}
                              className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-600 transition-all shadow-md"
                            >
                              Pay {res.payment_status === 'partially_paid' ? 'Balance' : 'Now'}
                            </button>
                          )}

                          {/* Reservation Status Badge */}
                          <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            res.reservation_status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                            res.reservation_status === 'cancelled' ? 'bg-red-50 text-red-400' : 
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {res.reservation_status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="grid grid-cols-1 gap-6">
                  {savedRooms.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <Heart size={48} className="mx-auto text-gray-100 mb-4"/>
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Your waitlist is empty.</p>
                      <button onClick={() => navigate('/rooms')} className="mt-4 text-amber-600 font-bold text-xs underline">Browse Rooms</button>
                    </div>
                  ) : (
                    savedRooms.map((room) => (
                      <div key={room.saved_id} className="bg-gray-50 p-4 rounded-[2rem] shadow-sm flex gap-6 items-center border border-gray-100 group hover:shadow-md transition-all hover:bg-white">
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                          {room.main_image_url && <img src={`http://localhost:5000/${room.main_image_url.replace(/\\/g, '/')}`} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/400'}/>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900 text-lg">Room {room.room_number}</h4>
                          <p className="text-amber-600 font-bold text-xs uppercase tracking-widest">{room.type_name}</p>
                          <p className="text-gray-400 text-xs mt-1 font-bold">${room.final_price || room.base_price} / night</p>
                        </div>
                        <button onClick={() => navigate(`/rooms/${room.room_id}`)} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg">
                          <ArrowRight size={18}/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GuestProfile;