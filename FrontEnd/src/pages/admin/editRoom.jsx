import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Save, ArrowLeft, Loader2, Upload, Trash2, CheckCircle } from 'lucide-react';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '', room_type_id: '', floor: '', 
    price_adjustment: 0, description: '', status: '', is_active: true
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [roomRes, typeRes] = await Promise.all([
          api.get(`/rooms/${id}`),
          api.get('/rooms/types')
        ]);
        if (roomRes.data.success) {
          const room = roomRes.data.data;
          setFormData(room);
          if (room.main_image_url) {
            setImagePreview(`http://localhost:5000/${room.main_image_url}`);
          }
        }
        if (typeRes.data.success) setRoomTypes(typeRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  
  // Text fields
  data.append('room_number', formData.room_number);
  data.append('room_type_id', formData.room_type_id);
  data.append('floor', formData.floor);
  data.append('price_adjustment', formData.price_adjustment);
  data.append('description', formData.description);
  data.append('status', formData.status);
  data.append('main_image_url', formData.main_image_url);

  // File field - MUST match 'main_image' from roomUpload.fields
  if (selectedFile) {
    data.append('main_image', selectedFile);
  }

  try {
    const res = await api.put(`/admin/rooms/${id}`, formData);
    if (res.data.success) {
      navigate('/admin/rooms');
    }
  } catch (err) {
    console.error("Submission Error:", err);
    // Add a user-friendly alert so you know what failed
    alert(err.response?.data?.message || "Failed to update room");
  }
};


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-amber-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 border border-gray-100">
        <button onClick={() => navigate('/admin/rooms')} className="flex items-center gap-2 text-gray-400 hover:text-black mb-10 font-black text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Back to Inventory
        </button>

        <h1 className="text-4xl font-black mb-12 font-serif uppercase tracking-tighter">Edit <span className="text-amber-600">Room {formData.room_number}</span></h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* IMAGE UPLOAD SECTION */}
          <div className="relative group w-full h-64 bg-gray-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center text-gray-400">
                <Upload className="mx-auto mb-2" size={32} />
                <p className="text-[10px] font-black uppercase">Click to change photo</p>
              </div>
            )}
            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Room Number</label>
              <input value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Current Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none">
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
              <select value={formData.room_type_id} onChange={e => setFormData({...formData, room_type_id: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20">
                {roomTypes.map(t => <option key={t.room_type_id} value={t.room_type_id}>{t.type_name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Price Adjustment (ETB)</label>
              <input type="number" value={formData.price_adjustment} onChange={e => setFormData({...formData, price_adjustment: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Description</label>
            <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20 resize-none" />
          </div>

          <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95">
            <Save size={20} /> Save Room Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;