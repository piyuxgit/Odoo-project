import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, CalendarDays, Compass, Trash2, Eye, Edit3, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { getTripsAPI, deleteTripAPI } from '../services/api';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);
  const fetchTrips = async () => {
    try { const res = await getTripsAPI(); setTrips(res.data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip permanently?')) return;
    await deleteTripAPI(id); fetchTrips();
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800">My Trips</h1>
            <p className="text-stone-500 mt-1">All your travel plans in one place.</p>
          </div>
          <button onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium shadow-sm hover:bg-teal-700 transition-colors cursor-pointer">
            <Plus size={18} /> New trip
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="warm-card p-16 flex flex-col items-center text-center">
            <Map size={40} className="text-stone-400 mb-4" />
            <h3 className="text-lg font-medium text-stone-700 mb-2">No trips yet</h3>
            <p className="text-stone-500 mb-5 text-sm">Create your first trip and start exploring the world!</p>
            <button onClick={() => navigate('/create-trip')} className="px-5 py-2 bg-teal-50 text-teal-700 rounded-xl font-medium hover:bg-teal-100 transition-colors cursor-pointer">
              Create a trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip, i) => (
              <motion.div key={trip.trip_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="warm-card overflow-hidden group">
                <div className="h-36 bg-gradient-to-br from-stone-200 to-stone-100 relative">
                  {trip.cover_image && <img src={`http://localhost:5000${trip.cover_image}`} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-stone-800 truncate">{trip.trip_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500"><CalendarDays size={12} /> {trip.start_date} → {trip.end_date}</div>
                  <div className="flex items-center gap-4 text-xs text-stone-500"><span className="flex items-center gap-1"><Compass size={12} /> {trip._count?.stops || 0} stops</span></div>
                  {trip.description && <p className="text-xs text-stone-400 line-clamp-2">{trip.description}</p>}
                  <div className="flex gap-2 pt-1">
                    <Link to={`/trip/${trip.trip_id}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"><Eye size={13} /> View</Link>
                    <button onClick={() => handleDelete(trip.trip_id)} className="px-3 py-2 bg-stone-50 text-stone-400 rounded-lg text-sm hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTrips;
