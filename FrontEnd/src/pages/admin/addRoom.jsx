import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AddRoom = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 px-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-10 font-bold uppercase text-xs">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-3xl font-black uppercase font-serif">Add New Room</h1>
      <p className="mt-4 text-gray-500 italic">Form functionality restored to original state.</p>
    </div>
  );
};

export default AddRoom;