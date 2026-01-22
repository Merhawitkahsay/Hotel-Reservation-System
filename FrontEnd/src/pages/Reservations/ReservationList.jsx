import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; 
import { Search, Calendar, User, Hash, Filter, ChevronRight, RefreshCcw } from 'lucide-react';
import { getAllReservations } from '../../services/reservationService';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';


const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations'); // or /reservations/all
      // Check if res.data.data exists and is an array
      if (res.data && Array.isArray(res.data.data)) {
        setReservations(res.data.data);
      } else {
        setReservations([]); // Fallback to empty array
      }
    } catch (err) {
      console.error(err);
      setReservations([]);
    }
  };
  fetchReservations();
}, []);

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-blue-100 text-blue-700',
      'checked-in': 'bg-green-100 text-green-700',
      'checked-out': 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return `px-2 py-1 rounded text-[10px] font-bold uppercase ${styles[status] || 'bg-gray-100'}`;
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <SearchBar 
          placeholder="Search by Guest or Room..." 
          value={searchTerm} 
          onChange={setSearchTerm} 
          className="w-full md:w-96"
        />
        <Link to="/admin/reservations/book">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all">
            NEW RESERVATION
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Guest</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Room</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Dates</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {reservations.map((res) => (
              <tr key={res.reservation_id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-primary">{res.guest_name}</td>
                <td className="px-6 py-4 text-gray-600">Room {res.room_number} <br/><span className="text-[10px] text-gray-400">{res.room_type}</span></td>
                <td className="px-6 py-4 text-gray-500 italic">
                  {new Date(res.check_in_date).toLocaleDateString()} - {new Date(res.check_out_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-bold">£{res.total_amount}</td>
                <td className="px-6 py-4"><span className={getStatusBadge(res.status)}>{res.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/admin/reservations/edit/${res.reservation_id}`} className="text-gray-400 hover:text-primary"><MoreVertical size={18} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;