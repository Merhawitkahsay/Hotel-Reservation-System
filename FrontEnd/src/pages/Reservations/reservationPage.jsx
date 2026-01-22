import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Loader2,
  BedDouble
} from 'lucide-react';

const ReservationPage = () => {
  // Using roomId to match App.jsx params
  const { roomId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  // 1. FETCH ROOM DATA 
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        // Using roomId variable
        const res = await api.getRoomById(roomId);
        if (res.data?.success) {
          setRoom(res.data.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        // Ensuring spinner stops on error
        setLoading(false);
      }
    };

    if (roomId) fetchRoom();
  }, [roomId]);

  // 2. CALCULATE TOTAL
  const calculateStay = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const totalAmount = calculateStay() * (room?.final_price || room?.base_price || 0);

  // 3. SUBMIT RESERVATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calculateStay() <= 0) return alert("Checkout must be after Check-in");

    setSubmitting(true);
    try {
      const reservationData = {
        room_id: roomId,
        check_in_date: formData.checkIn,
        check_out_date: formData.checkOut,
        number_of_guests: formData.guests,
        special_requests: formData.specialRequests,
        total_amount: totalAmount
      };

      const res = await api.createReservation(reservationData);
      if (res.data?.success) {
        navigate('/booking-success', { state: { reservation: res.data.data } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Reservation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. RENDER LOADING
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Luxury...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-black font-bold mb-10 transition-colors uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Room Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: RESERVATION FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h1 className="text-3xl font-black text-gray-900 mb-2 font-serif uppercase italic tracking-tighter">
                Complete Your <span className="text-amber-600">Reservation</span>
              </h1>
              <p className="text-gray-400 text-sm font-medium mb-10 italic">Your stay at ህድሞ starts here.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Check-In Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                      <input 
                        type="date" 
                        required
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-600/20 font-bold text-sm"
                        onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Check-Out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                      <input 
                        type="date" 
                        required
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-600/20 font-bold text-sm"
                        onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                    <select 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-600/20 font-bold text-sm appearance-none"
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    >
                      {[1, 2, 3, 4].map(num => <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Special Requests (Optional)</label>
                  <textarea 
                    rows="4"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-600/20 font-bold text-sm"
                    placeholder="E.g., Early check-in, dietary preferences..."
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  disabled={submitting}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-600 hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Confirm Reservation'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
              <div className="h-48 bg-gray-200 relative">
                {room?.main_image_url && (
                  <img src={`http://localhost:5000/${room.main_image_url.replace(/\\/g, '/')}`} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Room {room?.room_number}
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-black italic">{room?.room_type}</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Summary of your stay</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Rate / Night</span>
                    <span className="text-black">{room?.final_price || room?.base_price} ETB</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Duration</span>
                    <span className="text-black">{calculateStay()} Nights</span>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-amber-600">{totalAmount.toLocaleString()} ETB</span>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl flex gap-3 items-start mt-6">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 leading-relaxed font-bold">
                    Cancellation is free up to 24 hours before check-in. Payments are processed securely via our local partners.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservationPage;