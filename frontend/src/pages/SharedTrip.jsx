import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, Clock, DollarSign, Share2, Copy, Eye } from 'lucide-react';
import { getSharedTripAPI, copyTripAPI } from '../services/api';
import { formatCurrency } from '../utils/currency';

const SharedTrip = () => {
  const { slug } = useParams();
  const [shared, setShared] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => { try { const r = await getSharedTripAPI(slug); setShared(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    load();
  }, [slug]);

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleCopyTrip = async () => { try { await copyTripAPI(slug); alert('Trip copied! Check My Trips.'); } catch { alert('Login required.'); } };

  if (loading) return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div></div>;
  if (!shared) return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-stone-500"><MapPin size={40} className="mb-3" /><h2>Trip not found</h2></div>;

  const trip = shared.trip;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800">
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 py-16 px-6">
        <div className="max-w-3xl mx-auto text-white">
          <div className="flex items-center gap-2 text-sm text-teal-200 mb-4"><Eye size={14} /> {shared.views} views</div>
          <h1 className="font-display text-4xl font-bold mb-3">{trip.trip_name}</h1>
          {trip.description && <p className="text-teal-100 text-lg max-w-xl mb-4">{trip.description}</p>}
          <div className="flex items-center gap-4 text-sm text-teal-200 mb-6">
            <span className="flex items-center gap-1"><CalendarDays size={14} /> {trip.start_date} → {trip.end_date}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {trip.stops?.length || 0} stops</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-teal-200">Shared by</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">{trip.user?.name?.charAt(0)?.toUpperCase()}</div>
              <span className="font-medium">{trip.user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 flex gap-3">
        <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors cursor-pointer text-stone-700">
          <Share2 size={15} /> {copied ? 'Copied!' : 'Share link'}
        </button>
        <button onClick={handleCopyTrip} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors cursor-pointer">
          <Copy size={15} /> Copy to my trips
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-bold text-stone-800 mb-6">Itinerary</h2>
        {trip.stops?.sort((a, b) => a.order_index - b.order_index).map((stop, i) => (
          <motion.div key={stop.stop_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="mb-4 warm-card overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center text-white text-sm font-bold">{i + 1}</div>
              <div><h3 className="font-semibold text-stone-800">{stop.city_name}</h3><p className="text-xs text-stone-400">{stop.arrival_date} → {stop.departure_date}</p></div>
            </div>
            {stop.activities?.length > 0 && (
              <div className="p-4 space-y-2">
                {stop.activities.map((ta) => (
                  <div key={ta.trip_activity_id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                    <div className="w-1.5 h-8 rounded-full bg-teal-400"></div>
                    <div><p className="text-sm font-medium text-stone-700">{ta.activity?.title}</p>
                      <div className="flex gap-3 text-xs text-stone-400 mt-0.5">
                        <span className="flex items-center gap-1"><Clock size={10} /> {ta.activity?.duration}min</span>
                        <span className="flex items-center gap-1"><DollarSign size={10} /> {formatCurrency(ta.activity?.estimated_cost, trip.user?.currency_preference || 'USD')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SharedTrip;
