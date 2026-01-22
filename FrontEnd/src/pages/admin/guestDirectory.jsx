import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, Trash2, Mail, Calendar, ShieldAlert, Loader2, UserCheck } from 'lucide-react';

const GuestDirectory = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await api.get('/guests');
      if (res.data?.success) setGuests(res.data.data);
    } catch (err) {
      console.error("Failed to fetch guests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this guest profile?")) return;
    try {
      await api.delete(`/guests/${id}`);
      setGuests(guests.filter(g => g.id !== id));
    } catch (err) {
      alert("Failed to delete guest");
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-amber-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 font-serif uppercase tracking-tighter italic">
              Guest <span className="text-amber-600">Directory</span>
            </h1>
            <p className="text-gray-500 font-medium">Manage and review your sanctuary members.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm outline-none focus:border-amber-600 transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Guest</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined Date</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 overflow-hidden border border-amber-100">
                        {guest.profile_picture ? (
                          <img src={`http://localhost:5000/${guest.profile_picture}`} className="w-full h-full object-cover" />
                        ) : <Users size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{guest.name}</p>
                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-1">
                          <UserCheck size={10}/> Member
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Mail size={14} className="text-gray-400" /> {guest.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-500 font-medium italic">
                    {new Date(guest.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleDelete(guest.id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestDirectory;