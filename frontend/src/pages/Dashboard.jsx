import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Map, Plus, CreditCard, Compass, Trash2, Eye, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { getTripsAPI, getDashboardStatsAPI, deleteTripAPI } from '../services/api';
import { formatCurrency } from '../utils/currency';
import europeImg from '../assets/europe.png';
import asiaImg from '../assets/asia.png';
import tropicalImg from '../assets/tropical.png';

const recommended = [
  { name: 'Santorini, Greece', img: europeImg, tag: 'Popular' },
  { name: 'Kyoto, Japan', img: asiaImg, tag: 'Trending' },
  { name: 'Bali, Indonesia', img: tropicalImg, tag: 'Best Value' },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalStops: 0, totalBudget: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, statsRes] = await Promise.all([getTripsAPI(), getDashboardStatsAPI()]);
      setTrips(tripsRes.data);
      setStats(statsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    await deleteTripAPI(id);
    fetchData();
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Traveler'} 👋
            </h1>
            <p className="text-stone-500">Here's what's happening with your travel plans.</p>
          </div>
          <button onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium shadow-sm hover:bg-teal-700 transition-colors cursor-pointer">
            <Plus size={18} /> Plan a trip
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { label: 'Trips planned', value: stats.totalTrips, icon: Map, bg: 'bg-teal-50', text: 'text-teal-600' },
            { label: 'Cities to visit', value: stats.totalStops, icon: Compass, bg: 'bg-amber-50', text: 'text-amber-600' },
            { label: 'Total budget', value: formatCurrency(stats.totalBudget, user?.currency_preference), icon: CreditCard, bg: 'bg-rose-50', text: 'text-rose-600' },
          ].map(({ label, value, icon: Icon, bg, text }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="warm-card p-5">
              <div className={`${bg} ${text} p-2.5 rounded-xl w-fit mb-3`}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-sm text-stone-500">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recommended Destinations */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-stone-800 mb-4">Recommended destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommended.map((dest, i) => (
              <motion.div key={dest.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-2xl overflow-hidden group cursor-pointer relative h-52">
                <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2.5 py-1 bg-white/90 text-stone-700 text-xs font-medium rounded-full mb-2">{dest.tag}</span>
                  <h3 className="text-white font-semibold text-lg">{dest.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        <h2 className="font-display text-xl font-bold text-stone-800 mb-4">Your trips</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="warm-card p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <Map size={28} className="text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-700 mb-2">No trips planned yet</h3>
            <p className="text-stone-500 max-w-sm mb-5 text-sm">Start by creating your first trip — pick your destinations, set dates, and let Traveloop do the rest.</p>
            <button onClick={() => navigate('/create-trip')}
              className="px-5 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-medium text-stone-700 transition-colors cursor-pointer">
              Create your first trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip, i) => (
              <motion.div key={trip.trip_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="warm-card overflow-hidden group">
                <div className="h-36 bg-gradient-to-br from-stone-200 to-stone-100 relative">
                  {trip.cover_image && <img src={`http://localhost:5000${trip.cover_image}`} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 mb-1">{trip.trip_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <CalendarDays size={12} /> {trip.start_date} → {trip.end_date}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                    <Compass size={12} /> {trip._count?.stops || 0} stops
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/trip/${trip.trip_id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors">
                      <Eye size={13} /> View
                    </Link>
                    <button onClick={() => handleDelete(trip.trip_id)}
                      className="px-3 py-2 bg-stone-50 text-stone-400 rounded-lg text-sm hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={13} />
                    </button>
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

export default Dashboard;
