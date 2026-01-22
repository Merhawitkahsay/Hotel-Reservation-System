import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const RoomModal = ({ isOpen, onClose, onSuccess, roomToEdit = null }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type_id: '1', // Default to first type
    price_adjustment: '0',
    description: '',
    max_occupancy: '2',
    status: 'available'
  });
  const [mainImage, setMainImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Load data if editing
  useEffect(() => {
    if (roomToEdit) {
      setFormData({
        room_number: roomToEdit.room_number,
        room_type_id: roomToEdit.room_type_id || '1',
        price_adjustment: roomToEdit.price_adjustment || '0',
        description: roomToEdit.description || '',
        max_occupancy: roomToEdit.max_occupancy || '2',
        status: roomToEdit.status || 'available'
      });
      // Set existing image preview
      if (roomToEdit.main_image_url) {
        setPreview(`http://localhost:5000/${roomToEdit.main_image_url.replace(/\\/g, '/')}`);
      }
    } else {
      // Reset form for "Add New"
      setFormData({
        room_number: '', room_type_id: '1', price_adjustment: '0',
        description: '', max_occupancy: '2', status: 'available'
      });
      setPreview(null);
      setMainImage(null);
    }
  }, [roomToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData object for file upload
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (mainImage) {
      data.append('main_image', mainImage);
    }

    try {
      if (roomToEdit) {
        await api.updateRoom(roomToEdit.room_id, data);
      } else {
        await api.createRoom(data);
      }
      onSuccess(); // Refresh the list
      onClose();   // Close modal
    } catch (error) {
      console.error("Failed to save room:", error);
      alert(error.response?.data?.message || "Failed to save room");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-gray-900">
            {roomToEdit ? `Edit Room ${roomToEdit.room_number}` : 'Add New Room'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Image Upload Section */}
          <div className="flex justify-center">
            <div className="relative group w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Click to upload main image</p>
                </div>
              )}
              <input 
                type="file" 
                name="main_image" 
                onChange={handleImageChange} 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Room Number</label>
              <input
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                placeholder="e.g. 101"
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Room Type</label>
              <select
                name="room_type_id"
                value={formData.room_type_id}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
              >
                {/* Normally fetch these from DB */}
                <option value="1">Standard (1500 ETB)</option>
                <option value="2">Deluxe (2500 ETB)</option>
                <option value="3">Suite (4000 ETB)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Price Adjustment (+/-)</label>
              <input
                type="number"
                name="price_adjustment"
                value={formData.price_adjustment}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Max Occupancy</label>
              <input
                type="number"
                name="max_occupancy"
                value={formData.max_occupancy}
                onChange={handleChange}
                min="1"
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (roomToEdit ? 'Update Room' : 'Create Room')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;