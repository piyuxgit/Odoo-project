import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Save, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { getBudgetAPI, upsertBudgetAPI, getTripAPI, getExpensesAPI, addExpenseAPI, deleteExpenseAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#2a7c76', '#e07a5f', '#81b29a', '#dda15e'];

const TripBudget = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [budget, setBudget] = useState({ transport_est: 0, stay_est: 0, food_est: 0, activities_est: 0 });
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [expForm, setExpForm] = useState({ category: 'Food', amount: '', description: '', date: new Date().toISOString().split('T')[0] });

  const load = async () => {
    try {
      const [b, t, e] = await Promise.all([getBudgetAPI(id), getTripAPI(id), getExpensesAPI(id)]);
      setBudget(b.data);
      setTrip(t.data);
      setExpenses(e.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const estTotal = budget.transport_est + budget.stay_est + budget.food_est + budget.activities_est;
  const actTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const diff = estTotal - actTotal;

  const days = trip ? Math.max(1, Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000)) : 1;
  const actDailyAvg = (actTotal / days).toFixed(0);

  // Group actual expenses
  const actGrouped = { Transport: 0, Stay: 0, Food: 0, Activities: 0, Other: 0 };
  expenses.forEach(e => {
    if (actGrouped[e.category] !== undefined) actGrouped[e.category] += e.amount;
    else actGrouped.Other += e.amount;
  });

  const comparisonData = [
    { name: 'Transport', Estimated: budget.transport_est, Actual: actGrouped.Transport },
    { name: 'Stay', Estimated: budget.stay_est, Actual: actGrouped.Stay },
    { name: 'Food', Estimated: budget.food_est, Actual: actGrouped.Food },
    { name: 'Activities', Estimated: budget.activities_est, Actual: actGrouped.Activities },
  ];

  const handleChange = (key, value) => setBudget({ ...budget, [key]: Number(value) || 0 });
  
  const handleSaveBudget = async () => { 
    setSaving(true); 
    try { await upsertBudgetAPI({ trip_id: id, ...budget }); } 
    catch (err) { console.error(err); } 
    finally { setSaving(false); } 
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expForm.amount) return;
    try {
      await addExpenseAPI({ trip_id: id, ...expForm });
      setExpForm({ ...expForm, amount: '', description: '' });
      load();
    } catch (err) { console.error(err); }
  };

  const handleDeleteExpense = async (expId) => {
    if (!window.confirm("Delete expense?")) return;
    try {
      await deleteExpenseAPI(expId);
      load();
    } catch (err) { console.error(err); }
  };

  if (loading) return <Layout><div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-2 border-teal-600 border-t-transparent rounded-full"></div></div></Layout>;

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Trip Budget</h1>
        <p className="text-stone-500 mb-8">{trip?.trip_name || 'Loading...'} — Real-time expense tracking</p>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="warm-card p-5 relative overflow-hidden">
            <DollarSign className="text-teal-600 mb-2" size={22} />
            <p className="text-2xl font-bold text-stone-800">{formatCurrency(actTotal, user?.currency_preference)}</p>
            <p className="text-sm text-stone-500">Actual Spent</p>
            <div className="absolute right-5 bottom-5 text-stone-300">
              <span className="text-xs">Est: {formatCurrency(estTotal, user?.currency_preference)}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="warm-card p-5">
            <TrendingUp className="text-blue-600 mb-2" size={22} />
            <p className="text-2xl font-bold text-stone-800">{formatCurrency(actDailyAvg, user?.currency_preference)}</p>
            <p className="text-sm text-stone-500">Actual Average per day ({days} days)</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`warm-card p-5 ${diff < 0 ? 'bg-red-50 border-red-100' : ''}`}>
            {diff < 0 ? (
              <><AlertTriangle className="text-red-500 mb-2" size={22} /><p className="text-2xl font-bold text-red-600">{formatCurrency(Math.abs(diff), user?.currency_preference)}</p><p className="text-sm text-red-500">Over budget</p></>
            ) : (
              <><DollarSign className="text-green-600 mb-2" size={22} /><p className="text-2xl font-bold text-green-600">{formatCurrency(diff, user?.currency_preference)}</p><p className="text-sm text-green-700">Remaining budget</p></>
            )}
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="warm-card p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Estimated vs Actual (by Category)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" />
                <XAxis dataKey="name" tick={{ fill: '#7a756f', fontSize: 12 }} />
                <YAxis tick={{ fill: '#7a756f', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e8e2db', borderRadius: '12px', color: '#2d2a26', fontSize: '13px' }} cursor={{ fill: '#f5f3f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Estimated" fill="#e07a5f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#2a7c76" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="warm-card p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Edit Estimates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { key: 'transport_est', label: 'Transport' },
                { key: 'stay_est', label: 'Accommodation' },
                { key: 'food_est', label: 'Food & meals' },
                { key: 'activities_est', label: 'Activities' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">{formatCurrency(0, user?.currency_preference).replace(/[\d\.,]/g, '').trim()}</span>
                    <input type="number" value={budget[key]} onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveBudget} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 cursor-pointer w-full justify-center">
              <Save size={14} /> {saving ? 'Saving...' : 'Update Estimates'}
            </button>
          </div>
        </div>

        {/* Expenses Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleAddExpense} className="warm-card p-6 sticky top-6">
              <h3 className="font-semibold text-stone-800 mb-4">Log Expense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">{formatCurrency(0, user?.currency_preference).replace(/[\d\.,]/g, '').trim()}</span>
                    <input type="number" step="0.01" required value={expForm.amount} onChange={(e) => setExpForm({...expForm, amount: e.target.value})}
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Category</label>
                  <select value={expForm.category} onChange={(e) => setExpForm({...expForm, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40">
                    <option value="Food">Food & Drink</option>
                    <option value="Transport">Transport</option>
                    <option value="Stay">Accommodation</option>
                    <option value="Activities">Activities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Date</label>
                  <input type="date" required value={expForm.date} onChange={(e) => setExpForm({...expForm, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                  <input type="text" placeholder="e.g. Dinner at Paris" value={expForm.description} onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-900 transition-colors cursor-pointer mt-2">
                  <Plus size={16} /> Add Expense
                </button>
              </div>
            </form>
          </div>

          {/* Expense List */}
          <div className="lg:col-span-2">
            <div className="warm-card p-6 h-full">
              <h3 className="font-semibold text-stone-800 mb-4">Recent Expenses</h3>
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <DollarSign size={32} className="mx-auto mb-2 text-stone-300" />
                  <p>No expenses logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map(exp => (
                    <motion.div key={exp.expense_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg border border-stone-100">
                          {exp.category === 'Food' ? '🍔' : exp.category === 'Transport' ? '🚆' : exp.category === 'Stay' ? '🏨' : exp.category === 'Activities' ? '🎟️' : '💳'}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{exp.description || exp.category}</p>
                          <p className="text-xs text-stone-500">{exp.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-stone-800">{formatCurrency(exp.amount, user?.currency_preference)}</span>
                        <button onClick={() => handleDeleteExpense(exp.expense_id)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={15} /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default TripBudget;
