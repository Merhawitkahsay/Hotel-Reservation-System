import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Globe, Upload, ArrowLeft, CheckCircle, Camera, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, login, token } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', address: '',
    nationality: '', id_number: '', guest_id: '', profile_picture: ''
  });
  
  const [idFile, setIdFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/guests/profile');
        if (res.data.success) { 
          // Set initial form data
          setFormData(res.data.data); 
        }
      } catch (err) { 
        setError("Failed to load profile details."); 
      } finally { 
        setFetching(false); 
      }
    };
    if (user) loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    
    // Append all text fields from formData
    Object.keys(formData).forEach(key => {
      // Don't append the existing picture string if we are uploading a new file
      if (key === 'profile_picture' || key === 'id_document_url') return;
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    
    // Key names must match guestRoutes.js: upload.fields([{ name: 'id_document' }, { name: 'profile_picture' }])
    if (idFile) data.append('id_document', idFile);
    if (profileFile) data.append('profile_picture', profileFile);

    try {
      // Replace the current api.put line with this:
const res = await api.put(`/guests/profile/${profile?.guest_id || formData.guest_id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

      if (res.data.success) {
        // Update local auth context if first/last name changed
        const updatedUser = { 
          ...user, 
          first_name: formData.first_name, 
          last_name: formData.last_name 
        };
        login(updatedUser, token); 
        
        setShowSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
      setLoading(false);
    }
  };

  const getPreviewImage = () => {
    if (profileFile) return URL.createObjectURL(profileFile);
    if (formData.profile_picture) {
      const cleanPath = formData.profile_picture.replace(/\\/g, '/');
      return `http://localhost:5000/${cleanPath}`;
    }
    return null;
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 relative">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in duration-300">
          <div className="bg-black text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
            <CheckCircle className="text-green-400" size={24} />
            <span className="font-black text-xs uppercase tracking-[0.2em]">Profile Updated</span>
          </div>
        </div>
      )}

      <div className={`max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-gray-100 transition-opacity duration-500 ${showSuccess ? 'opacity-50' : ''}`}>
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 font-black text-[10px] uppercase tracking-widest transition-colors">
          <ArrowLeft size={16}/> Back to Profile
        </button>

        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight font-serif">Update Information</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PROFILE PICTURE UPLOAD AREA */}
          <div className="md:col-span-2 flex items-center gap-6 mb-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
             <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 overflow-hidden shadow-inner">
                {getPreviewImage() ? (
                  <img src={getPreviewImage()} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} />
                )}
             </div>
             <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Profile Photo</p>
                <label className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-all shadow-sm">
                   Select New Photo
                   <input type="file" className="hidden" onChange={(e) => setProfileFile(e.target.files[0])} accept="image/*" />
                </label>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">First Name</label>
            <input name="first_name" type="text" value={formData.first_name || ''} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-black/5 outline-none transition-all" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Last Name</label>
            <input name="last_name" type="text" value={formData.last_name || ''} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-black/5 outline-none transition-all" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input name="phone" type="tel" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-black/5 outline-none" placeholder="+251..." required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nationality</label>
            <div className="relative">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input name="nationality" type="text" value={formData.nationality || ''} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-black/5 outline-none" placeholder="Ethiopian" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Home Address</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input name="address" type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-black/5 outline-none" placeholder="Bole, Addis Ababa" />
            </div>
          </div>

          <div className="md:col-span-2 bg-gray-50/50 p-6 rounded-[2rem] border border-dashed border-gray-200">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Verify Identity (Passport/ID)</p>
             <label className="flex items-center justify-center gap-2 px-5 py-4 bg-white rounded-2xl text-sm font-bold text-gray-500 cursor-pointer hover:text-black transition-colors shadow-sm">
                <Upload size={18}/> {idFile ? idFile.name : "Upload Document"}
                <input type="file" className="hidden" onChange={(e) => setIdFile(e.target.files[0])} accept="image/*,.pdf" />
             </label>
          </div>

          <button type="submit" disabled={loading || showSuccess} className="md:col-span-2 w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-amber-600 transition-all active:scale-95 disabled:bg-gray-300">
            {loading ? 'Syncing Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};


export default EditProfile;