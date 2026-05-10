import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, RotateCcw, Package } from 'lucide-react';
import Layout from '../components/Layout';
import { getPackingItemsAPI, addPackingItemAPI, togglePackingItemAPI, deletePackingItemAPI, resetPackingAPI } from '../services/api';

const CATEGORIES = ['Clothing', 'Electronics', 'Documents', 'Toiletries', 'Medicine', 'Other'];
const catEmojis = { Clothing: '👕', Electronics: '📱', Documents: '📄', Toiletries: '🧴', Medicine: '💊', Other: '📦' };

const PackingChecklist = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item_name: '', category: 'Clothing' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, [id]);
  const fetchItems = async () => { try { const r = await getPackingItemsAPI(id); setItems(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const handleAdd = async (e) => { e.preventDefault(); if (!form.item_name.trim()) return; await addPackingItemAPI({ trip_id: id, ...form }); setForm({ item_name: '', category: form.category }); fetchItems(); };
  const handleToggle = async (iid) => { await togglePackingItemAPI(iid); fetchItems(); };
  const handleDelete = async (iid) => { await deletePackingItemAPI(iid); fetchItems(); };
  const handleReset = async () => { if (!window.confirm('Reset all items to unpacked?')) return; await resetPackingAPI(id); fetchItems(); };

  const grouped = CATEGORIES.reduce((a, c) => { a[c] = items.filter((i) => i.category === c); return a; }, {});
  const packed = items.filter((i) => i.packed_status).length;
  const progress = items.length > 0 ? Math.round((packed / items.length) * 100) : 0;

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800">Packing list</h1>
            <p className="text-stone-500 text-sm mt-1">{packed} of {items.length} items packed</p>
          </div>
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 rounded-lg text-sm text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer">
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }}
              className="h-full bg-teal-500 rounded-full" />
          </div>
          <p className="text-right text-xs text-stone-400 mt-1">{progress}%</p>
        </div>

        {/* Add Item */}
        <form onSubmit={handleAdd} className="warm-card p-3 mb-6 flex gap-2">
          <input value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            placeholder="Add an item..." className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors cursor-pointer"><Plus size={16} /></button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div></div>
        ) : items.length === 0 ? (
          <div className="warm-card p-12 flex flex-col items-center text-center">
            <Package size={36} className="text-stone-400 mb-3" />
            <p className="text-stone-500 text-sm">No packing items yet. Add items above!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {CATEGORIES.filter((c) => grouped[c]?.length > 0).map((cat) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-stone-500 mb-2 flex items-center gap-1.5">{catEmojis[cat]} {cat}</h3>
                <div className="space-y-1.5">
                  {grouped[cat].map((item) => (
                    <motion.div key={item.item_id} layout className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      item.packed_status ? 'bg-teal-50 border border-teal-200' : 'bg-white border border-stone-200'
                    }`} onClick={() => handleToggle(item.item_id)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          item.packed_status ? 'bg-teal-500 border-teal-500' : 'border-stone-300'
                        }`}>
                          {item.packed_status && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm ${item.packed_status ? 'line-through text-stone-400' : 'text-stone-700'}`}>{item.item_name}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.item_id); }} className="p-1 text-stone-300 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PackingChecklist;
