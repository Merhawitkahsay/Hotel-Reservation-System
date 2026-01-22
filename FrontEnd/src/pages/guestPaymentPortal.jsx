import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, ShieldCheck } from 'lucide-react';

const GuestPaymentPortal = () => {
  const { reservationId } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Fetch summary for the guest so they know what they are paying for
    api.get(`/reservations/summary/${reservationId}`).then(res => setDetails(res.data.data));
  }, [reservationId]);

  const handleChapaRedirect = () => {
    // Logic to call your backend and get a Chapa/Telebirr checkout URL
    api.post('/payments/initialize', { reservationId }).then(res => {
      window.location.href = res.data.checkoutUrl;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 text-center">
        <h1 className="text-3xl font-black font-serif mb-6 uppercase">ህድሞና <span className="text-amber-600">Payment</span></h1>
        
        <div className="mb-8 text-left bg-gray-50 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Pay</p>
          <p className="text-3xl font-black text-gray-900">{details?.total_amount} ETB</p>
        </div>

        <button 
          onClick={handleChapaRedirect}
          className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          <CreditCard size={20} /> Pay with Chapa
        </button>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Local Payment</span>
        </div>
      </div>
    </div>
  );
};