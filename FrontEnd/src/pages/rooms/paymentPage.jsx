import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

const PaymentPage = () => {
  const { state, search } = useLocation(); 
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Parse URL parameters (for users coming from the Email Link)
  const queryParams = new URLSearchParams(search);
  const reservationId = state?.reservation_id || queryParams.get('ref');
  const totalAmount = state?.total_amount || queryParams.get('amount');

  // Safety check: if no ID is found, redirect back
  useEffect(() => {
    if (!reservationId) {
      alert("Invalid payment link.");
      navigate('/profile');
    }
  }, [reservationId, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      /**
       * Update reservation status to paid.
       * Ensure your backend has this PUT endpoint configured!
       */
      await api.put(`/reservations/${reservationId}/confirm-payment`, {
        payment_status: 'paid',
        status: 'confirmed'
      });

      alert("Payment Successful! Your stay is now confirmed.");
      navigate('/profile');
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Secure Payment</h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">
            Amount to Pay: {totalAmount || '...'} ETB
          </p>
          <p className="text-[9px] text-gray-400 font-bold mt-1">REF: #LUX-{reservationId}</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Card Number</label>
            <div className="flex items-center gap-2">
               <CreditCard size={16} className="text-gray-400" />
               <input type="text" placeholder="**** **** **** 4242" className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Expiry</label>
              <input type="text" placeholder="MM/YY" className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0" required />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">CVV</label>
              <input type="password" placeholder="***" className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0" required />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={processing || !reservationId}
            className="w-full bg-primary text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all disabled:bg-gray-200"
          >
            {processing ? 'Processing Transaction...' : `Pay ${totalAmount || ''} ETB`}
          </button>
          
          <p className="text-center text-[8px] text-gray-400 uppercase font-black tracking-tighter">
            Encrypted by LuxSecure 256-bit SSL
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;