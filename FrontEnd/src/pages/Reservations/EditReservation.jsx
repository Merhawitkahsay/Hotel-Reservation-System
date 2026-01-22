import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, Users, MessageSquare, ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';

const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null); 
  const [originalTotal, setOriginalTotal] = useState(0);

  const [formData, setFormData] = useState({
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    special_requests: ''
  });

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        setLoading(true);
        const response = await api.getReservationById(id);

        if (response.data.success) {
          const res = response.data.data;

          setFormData({
            // Ensure we only take the YYYY-MM-DD part to avoid timezone shifts
            check_in_date: res.check_in_date.split('T')[0],
            check_out_date: res.check_out_date.split('T')[0],
            number_of_guests: res.number_of_guests,
            special_requests: res.special_requests || ''
          });

          setOriginalTotal(res.total_amount);
          setRoom({
            final_price: res.final_price || res.base_price, // Fallback if final_price is missing
            max_occupancy: res.max_occupancy
          });
        }
      } catch (err) {
        setError('Reservation record not found on server.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReservationDetails();
  }, [id]);

  // Optimized price calculation using useMemo
  const { newTotal, diffDays } = useMemo(() => {
    if (!room || !formData.check_in_date || !formData.check_out_date) return { newTotal: 0, diffDays: 0 };
    
    // We treat dates as local midnight to get accurate day counts
    const start = new Date(formData.check_in_date + "T00:00:00");
    const end = new Date(formData.check_out_date + "T00:00:00");
    
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return {
      diffDays: days,
      newTotal: days > 0 ? (days * room.final_price).toFixed(2) : 0
    };
  }, [formData.check_in_date, formData.check_out_date, room]);

  const priceDiff = newTotal - (parseFloat(originalTotal) || 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validation
    if (diffDays <= 0) {
      setError("The Check-out date must be at least one day after the Check-in date.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await api.updateReservation(id, {
        ...formData,
        total_amount: newTotal // Send the updated total to the backend
      });
      
      if (response.data.success) {
        alert("Reservation updated successfully!");
        navigate('/profile'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Syncing Booking Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold mb-6 hover:text-black transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Profile
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-black p-8 text-white">
            <h2 className="text-2xl font-black font-serif italic uppercase tracking-tighter">Modify <span className="text-amber-600">Reservation</span></h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Ref: #LUX-RES-{id}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Check In</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" 
                    name="check_in_date" 
                    value={formData.check_in_date} 
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-amber-600/20 outline-none font-bold text-gray-900 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Check Out</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" 
                    name="check_out_date" 
                    value={formData.check_out_date} 
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-amber-600/20 outline-none font-bold text-gray-900 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${
                priceDiff > 0 ? 'bg-orange-50 border-orange-100' : 
                priceDiff < 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'
            }`}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">New Total ({diffDays} Nights)</p>
                        <p className="text-2xl font-black text-gray-900">{newTotal} <span className="text-xs">ETB</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Difference</p>
                        <p className={`text-lg font-black ${priceDiff > 0 ? 'text-orange-600' : priceDiff < 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {priceDiff > 0 ? `+${priceDiff.toFixed(2)}` : priceDiff.toFixed(2)} ETB
                        </p>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-black/5">
                  {priceDiff > 0 && (
                      <p className="text-[9px] font-bold text-orange-600 uppercase tracking-tighter flex items-center gap-2">
                          <AlertCircle size={12}/> Pay the remaining {priceDiff.toFixed(2)} ETB at the front desk.
                      </p>
                  )}
                  {priceDiff < 0 && (
                      <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-2">
                          <AlertCircle size={12}/> A refund of {Math.abs(priceDiff).toFixed(2)} ETB will be processed.
                      </p>
                  )}
                  {priceDiff === 0 && (
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">No change in total price.</p>
                  )}
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Number of Guests</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  name="number_of_guests" 
                  min="1"
                  max={room?.max_occupancy || 10}
                  value={formData.number_of_guests} 
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-amber-600/20 outline-none font-bold text-gray-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Special Requests</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
                <textarea 
                  name="special_requests" 
                  rows="3"
                  value={formData.special_requests} 
                  onChange={handleChange}
                  placeholder="Any dietary needs or floor preferences?"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-amber-600/20 outline-none font-bold text-gray-900 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting || diffDays <= 0}
              className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating Sanctuary...' : <><Save size={20}/> Confirm Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReservation;