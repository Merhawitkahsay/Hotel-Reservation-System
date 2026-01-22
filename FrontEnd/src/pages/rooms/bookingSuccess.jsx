import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';

const BookingSuccess = () => {
  const { state } = useLocation(); // Retrieves the data passed from navigate()
  const navigate = useNavigate();

  // Fallback if someone goes to this URL directly without booking
  const reservationId = state?.reservation_id || "PENDING";
  const totalAmount = state?.total_amount || "0.00";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">Reservation Placed!</h1>
        <p className="text-gray-600 font-medium mb-8">
          We've sent a detailed confirmation to your email. Please check your inbox (and spam folder) to finalize your payment.
        </p>

        <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 text-left border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Mail size={14}/> Reservation Summary
          </h3>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-500">Booking Reference:</span>
            <span className="text-sm font-black text-gray-900">#LUX-{reservationId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold text-gray-500">Total Amount:</span>
            <span className="text-sm font-black text-amber-600">${totalAmount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="py-4 px-6 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
          >
            View My Bookings
          </button>
          <button 
            onClick={() => navigate('/')}
            className="py-4 px-6 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-gray-800 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;