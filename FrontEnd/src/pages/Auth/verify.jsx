import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasCalled = useRef(false); // Prevents double-calling in Strict Mode

  useEffect(() => {
    const verifyToken = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      try {
        const response = await api.get(`/auth/verify/${token}`);
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be expired.');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Verifying Identity</h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Please wait a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Verified!</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4">{message}</p>
            <Link 
              to="/login" 
              className="group flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl active:scale-95"
            >
              Go to Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-in shake duration-500">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <XCircle size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4">{message}</p>
            <div className="space-y-4">
               <Link to="/login" className="block text-[10px] font-black text-gray-900 uppercase tracking-widest hover:underline">
                Back to Login
              </Link>
              <div className="h-px bg-gray-100 w-1/2 mx-auto"></div>
              <Link to="/register" className="block text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                Need a new link? Register again
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;