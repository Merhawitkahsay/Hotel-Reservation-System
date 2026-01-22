import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGuest } from '../../services/guestService';
import Button from '../../components/button';

const AddGuest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', id_type: 'Passport', id_number: '',
    nationality: '', guest_type: 'walk-in'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGuest(formData);
      navigate('/admin/guests');
    } catch (err) {
      alert("Error creating guest profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-serif font-bold text-primary mb-8">Register New Guest</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">First Name</label>
          <input required className="w-full border rounded-lg p-3" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Last Name</label>
          <input required className="w-full border rounded-lg p-3" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
          <input type="email" className="w-full border rounded-lg p-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
          <input required className="w-full border rounded-lg p-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" variant="secondary" className="w-full py-4">CREATE GUEST PROFILE</Button>
        </div>
      </form>
    </div>
  );
};

export default AddGuest;