import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Globe, CreditCard, Calendar, Upload, AlertCircle } from 'lucide-react';
import api from '../../services/api'; 

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idFile, setIdFile] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', date_of_birth: '', nationality: 'Ethiopia',
    email: '', phone: '', id_type: 'Passport', id_number: '', 
    address: '', region: '', password: '', confirmPassword: ''
  });

  const countries = ["Ethiopia", "USA", "UK", "Germany", "France", "China", "Kenya", "UAE"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setIdFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Client-side Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // Check Age
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    setLoading(true);

    // 2. Prepare Form Data for Backend
    const data = new FormData();
    // Append all text fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Append File (IMPORTANT: Key must be 'id_document')
    if (idFile) {
      data.append('id_document', idFile);
    }

    try {
      console.log("Sending Registration Data...");
      const response = await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log("Registration Success:", response.data);
      
      // Redirect to the Verification Notice Page instead of Login
      navigate('/verify-notice'); 
      
    } catch (err) {
      console.error("Registration Error:", err);
      // Extract the exact error message from backend
      const serverMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      setError(serverMessage);
      
      // If validation errors exist, show the first one
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-8 sm:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Guest Registration</h2>
            <p className="mt-2 text-gray-500 font-medium italic">"Experience Luxury Without Compromise"</p>
          </div>

          {/* ERROR BOX */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} />
              <span className="font-bold text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Personal Details</h3>
              <input name="first_name" placeholder="First Name" required onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              <input name="last_name" placeholder="Last Name" required onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input name="date_of_birth" type="date" required onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <select name="nationality" onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none appearance-none">
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact & Account</h3>
              <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              <input name="address" placeholder="Address" required onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              <input name="region" placeholder="City / Region" required onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
            </div>

            {/* ID DOCUMENT UPLOAD */}
            <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-colors">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CreditCard size={14}/> Proof of Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="id_type" onChange={handleChange} className="px-4 py-3 rounded-xl font-bold text-sm border-2 border-transparent focus:border-black outline-none">
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Drivers License">Driver's License</option>
                </select>
                <input name="id_number" placeholder="ID Number" required onChange={handleChange} className="px-4 py-3 rounded-xl font-bold text-sm border-2 border-transparent focus:border-black outline-none" />
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl font-bold text-sm cursor-pointer border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all">
                  <Upload size={16}/> {idFile ? "File Selected" : "Upload Scan"}
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                </label>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl font-bold text-sm border-transparent focus:border-black focus:bg-white transition-all border-2 outline-none" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="md:col-span-2 w-full bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all transform active:scale-95">
              {loading ? 'Processing...' : 'Complete Registration'}
            </button>
            
            <p className="md:col-span-2 text-center text-sm font-bold text-gray-400 mt-4">
              Already have an account? <Link to="/login" className="text-black underline">Login here</Link>
            </p>
          </form>
      </div>
    </div>
  );
};

export default Register;