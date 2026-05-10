import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plus, Trash2, CalendarDays, Clock, DollarSign, X, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import TripMap from '../components/TripMap';
import { getTripAPI, addStopAPI, deleteStopAPI, addActivityToStopAPI, removeActivityAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { useContext } from 'react';

const TripDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddStop, setShowAddStop] = useState(false);
  const [stopForm, setStopForm] = useState({ city_name: '', arrival_date: '', departure_date: '' });
  const [activeStop, setActiveStop] = useState(null);
  const [actForm, setActForm] = useState({ title: '', category: 'Sightseeing', estimated_cost: 0, duration: 60 });
  const [viewMode, setViewMode] = useState('timeline');

  useEffect(() => { fetchTrip(); }, [id]);
  const fetchTrip = async () => { try { const res = await getTripAPI(id); setTrip(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } };

  const handleAddStop = async (e) => {
    e.preventDefault();
    await addStopAPI({ trip_id: id, ...stopForm, order_index: trip.stops?.length || 0 });
    setStopForm({ city_name: '', arrival_date: '', departure_date: '' });
    setShowAddStop(false); fetchTrip();
  };
  const handleDeleteStop = async (stopId) => { if (!window.confirm('Delete this stop?')) return; await deleteStopAPI(stopId); fetchTrip(); };
  const handleAddActivity = async (e) => {
    e.preventDefault();
    await addActivityToStopAPI({ stop_id: activeStop, ...actForm, estimated_cost: Number(actForm.estimated_cost), duration: Number(actForm.duration) });
    setActForm({ title: '', category: 'Sightseeing', estimated_cost: 0, duration: 60 });
    setActiveStop(null); fetchTrip();
  };
  const handleRemoveActivity = async (taId) => { await removeActivityAPI(taId); fetchTrip(); };

  if (loading) return <Layout><div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div></div></Layout>;
  if (!trip) return <Layout><div className="p-8 text-center text-stone-500">Trip not found</div></Layout>;

  const categories = ['Sightseeing', 'Food', 'Adventure', 'Culture', 'Shopping', 'Transport', 'Relaxation'];
  const categoryColors = { Sightseeing: 'bg-teal-50 text-teal-700', Food: 'bg-orange-50 text-orange-700', Adventure: 'bg-red-50 text-red-700', Culture: 'bg-purple-50 text-purple-700', Shopping: 'bg-pink-50 text-pink-700', Transport: 'bg-blue-50 text-blue-700', Relaxation: 'bg-green-50 text-green-700' };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-stone-800">{trip.trip_name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-stone-500">
                <span className="flex items-center gap-1"><CalendarDays size={14} /> {trip.start_date} → {trip.end_date}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {trip.stops?.length || 0} stops</span>
              </div>
              {trip.description && <p className="text-stone-500 mt-2 text-sm">{trip.description}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to={`/trip/${id}/budget`} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">💰 Budget</Link>
              <Link to={`/trip/${id}/packing`} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">🎒 Packing</Link>
              <Link to={`/trip/${id}/notes`} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">📝 Notes</Link>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 mb-6 bg-stone-100 rounded-lg p-1 w-fit">
          <button onClick={() => setViewMode('timeline')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${viewMode === 'timeline' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'}`}>Timeline</button>
          <button onClick={() => setViewMode('map')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${viewMode === 'map' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'}`}>Map View</button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'}`}>List</button>
        </div>

        {viewMode === 'map' ? (
          <div className="mb-8">
            <TripMap stops={trip.stops || []} />
          </div>
        ) : (
        {/* Stops */}
        <div className="space-y-4">
          {trip.stops?.sort((a, b) => a.order_index - b.order_index).map((stop, i) => (
            <motion.div key={stop.stop_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="warm-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center text-white text-sm font-bold">{i + 1}</div>
                  <div>
                    <h3 className="font-semibold text-stone-800">{stop.city_name || 'Unnamed Stop'}</h3>
                    <p className="text-xs text-stone-400">{stop.arrival_date} → {stop.departure_date}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setActiveStop(activeStop === stop.stop_id ? null : stop.stop_id)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer" title="Add activity"><Plus size={16} /></button>
                  <button onClick={() => handleDeleteStop(stop.stop_id)}
                    className="p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors cursor-pointer" title="Delete stop"><Trash2 size={16} /></button>
                </div>
              </div>

              {stop.activities?.length > 0 && (
                <div className="p-4 space-y-2">
                  {stop.activities.map((ta) => (
                    <div key={ta.trip_activity_id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 rounded-full bg-teal-400"></div>
                        <div>
                          <p className="text-sm font-medium text-stone-700">{ta.activity?.title}</p>
                          <div className="flex gap-3 text-xs text-stone-400 mt-0.5">
                            <span className="flex items-center gap-1"><Clock size={10} /> {ta.activity?.duration}min</span>
                            <span className="flex items-center gap-1"><DollarSign size={10} /> {formatCurrency(ta.activity?.estimated_cost, user?.currency_preference)}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${categoryColors[ta.activity?.category] || 'bg-stone-100 text-stone-600'}`}>{ta.activity?.category}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveActivity(ta.trip_activity_id)} className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              {activeStop === stop.stop_id && (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleAddActivity} className="p-4 border-t border-stone-100 space-y-3 bg-stone-50/50">
                  <input value={actForm.title} onChange={(e) => setActForm({ ...actForm, title: e.target.value })}
                    placeholder="Activity name" required className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500" />
                  <div className="grid grid-cols-3 gap-3">
                    <select value={actForm.category} onChange={(e) => setActForm({ ...actForm, category: e.target.value })}
                      className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" value={actForm.estimated_cost} onChange={(e) => setActForm({ ...actForm, estimated_cost: e.target.value })}
                      placeholder={`Cost (${formatCurrency(0, user?.currency_preference).replace(/[\d\.,]/g, '').trim()})`} className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
                    <input type="number" value={actForm.duration} onChange={(e) => setActForm({ ...actForm, duration: e.target.value })}
                      placeholder="Min" className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors cursor-pointer">Add</button>
                    <button type="button" onClick={() => setActiveStop(null)} className="px-4 py-2 bg-white border border-stone-300 text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition-colors cursor-pointer">Cancel</button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          ))}
        </div>
        )}

        {/* Add Stop */}
        {showAddStop ? (
          <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAddStop} className="mt-5 warm-card p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Add a new stop</h3>
            <input value={stopForm.city_name} onChange={(e) => setStopForm({ ...stopForm, city_name: e.target.value })}
              placeholder="City name (e.g. Paris)" required className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500" />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={stopForm.arrival_date} onChange={(e) => setStopForm({ ...stopForm, arrival_date: e.target.value })}
                required className="px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500" />
              <input type="date" value={stopForm.departure_date} onChange={(e) => setStopForm({ ...stopForm, departure_date: e.target.value })}
                required className="px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors cursor-pointer">Add stop</button>
              <button type="button" onClick={() => setShowAddStop(false)} className="px-5 py-2.5 bg-white border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer">Cancel</button>
            </div>
          </motion.form>
        ) : (
          <button onClick={() => setShowAddStop(true)}
            className="mt-5 w-full p-4 border-2 border-dashed border-stone-300 rounded-2xl text-stone-400 hover:border-teal-400 hover:text-teal-600 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Plus size={18} /> Add a stop
          </button>
        )}
      </div>
    </Layout>
  );
};

export default TripDetail;
