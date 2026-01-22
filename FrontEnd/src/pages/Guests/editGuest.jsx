import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuestById, updateGuest } from '../../services/guestService';
import Button from '../../components/button';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditGuest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    getGuestById(id).then(data => setFormData(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateGuest(id, formData);
    navigate('/admin/guests');
  };

  if (!formData) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-serif font-bold text-primary mb-8 italic">Update Profile: {formData.first_name}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
          <input className="w-full border rounded-lg p-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
          <input className="w-full border rounded-lg p-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" variant="primary" className="w-full">SAVE CHANGES</Button>
        </div>
      </form>
    </div>
  );
};

export default EditGuest;