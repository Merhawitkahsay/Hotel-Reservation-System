import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Edit, Trash2, Search, Mail, Phone } from 'lucide-react';
import { getAllGuests, searchGuests, deleteGuest } from '../../services/guestService';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/button';
import LoadingSpinner from '../../components/LoadingSpinner';

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const data = await getAllGuests();
      setGuests(data);
    } catch (err) {
      console.error("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (val.length > 2) {
      const results = await searchGuests(val);
      setGuests(results);
    } else if (val === '') {
      fetchGuests();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guest profile?")) {
      await deleteGuest(id);
      fetchGuests();
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchBar 
          placeholder="Search by name, email or phone..." 
          value={searchTerm} 
          onChange={handleSearch}
          className="w-full md:w-96"
        />
        <Link to="/admin/guests/add">
          <Button variant="secondary">
            <UserPlus size={18} /> ADD NEW GUEST
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Guest Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Contact Info</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Registered</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {guests.map((guest) => (
              <tr key={guest.guest_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">
                  {guest.first_name} {guest.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {guest.email}</span>
                    <span className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {guest.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    guest.guest_type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {guest.guest_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(guest.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/guests/edit/${guest.guest_id}`} className="p-2 text-gray-400 hover:text-text-secondary">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(guest.guest_id)} className="p-2 text-gray-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;