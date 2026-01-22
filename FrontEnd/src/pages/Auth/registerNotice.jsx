import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterNotice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Check Your Email</h2>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          We've sent a verification link to your inbox. Please verify your account to complete registration and access our services.
        </p>
        <Link 
          to="/login" 
          className="group flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl"
        >
          Go to Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default RegisterNotice;