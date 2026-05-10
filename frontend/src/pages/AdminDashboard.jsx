import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Map, Compass, Activity, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { getAdminAnalyticsAPI, getAdminUsersAPI } from '../services/api';

const COLORS = ['#2a7c76', '#e07a5f', '#81b29a', '#dda15e', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16', '#f97316', '#6366f1'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const [a, u] = await Promise.all([getAdminAnalyticsAPI(), getAdminUsersAPI()]); setAnalytics(a.data); setUsers(u.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }; load();
  }, []);

  if (loading) return <Layout><div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div></div></Layout>;

  const stats = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: Users, bg: 'bg-teal-50', text: 'text-teal-600' },
    { label: 'Total Trips', value: analytics?.totalTrips || 0, icon: Map, bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: 'Total Stops', value: analytics?.totalStops || 0, icon: Compass, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Activities', value: analytics?.totalActivities || 0, icon: Activity, bg: 'bg-purple-50', text: 'text-purple-600' },
  ];

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Admin Dashboard</h1>
        <p className="text-stone-500 mb-8 text-sm">Platform analytics and user management.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, bg, text }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="warm-card p-5">
              <div className={`${bg} ${text} p-2.5 rounded-xl w-fit mb-3`}><Icon size={20} strokeWidth={1.8} /></div>
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-sm text-stone-500">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="warm-card p-6">
            <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-teal-600" /> Top cities</h3>
            {analytics?.topCities?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.topCities}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" />
                  <XAxis dataKey="city" tick={{ fill: '#7a756f', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#7a756f', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e8e2db', borderRadius: '12px', color: '#2d2a26', fontSize: '13px' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>{analytics.topCities.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-stone-400 text-center py-12 text-sm">No city data yet</p>}
          </div>

          <div className="warm-card p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Recent trips</h3>
            {analytics?.recentTrips?.length > 0 ? (
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {analytics.recentTrips.map((trip) => (
                  <div key={trip.trip_id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <div><p className="text-sm font-medium text-stone-700">{trip.trip_name}</p><p className="text-xs text-stone-400">by {trip.user?.name} · {trip.start_date}</p></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-stone-400 text-center py-12 text-sm">No trips yet</p>}
          </div>
        </div>

        <div className="warm-card p-6">
          <h3 className="font-semibold text-stone-800 mb-4">All users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-stone-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-stone-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-stone-500 font-medium">Trips</th>
                  <th className="text-left py-3 px-4 text-stone-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)?.toUpperCase()}</div>
                      <span className="text-stone-700">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{u.email}</td>
                    <td className="py-3 px-4 text-stone-700">{u._count?.trips || 0}</td>
                    <td className="py-3 px-4 text-stone-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
