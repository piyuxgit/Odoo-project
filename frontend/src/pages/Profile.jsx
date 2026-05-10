import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Globe, Trash2, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { updateProfileAPI, deleteAccountAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    language_preference: user?.language_preference || 'en',
    currency_preference: user?.currency_preference || 'INR'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try { await updateProfileAPI(form); setMessage('Profile updated successfully!'); setTimeout(() => setMessage(''), 3000); }
    catch { setMessage('Failed to update'); }
    finally { setSaving(false); }
  };
  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try { await deleteAccountAPI(); logout(); navigate('/login'); } catch { setMessage('Failed to delete'); }
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Profile & Settings</h1>
        <p className="text-stone-500 mb-8 text-sm">Manage your account information and preferences.</p>

        {message && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`mb-6 p-4 rounded-xl text-sm ${message.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {message}
          </motion.div>
        )}

        <div className="warm-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800">{user?.name}</h2>
              <p className="text-sm text-stone-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Full name</label>
              <div className="relative">
                <UserCircle size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input value={user?.email || ''} disabled
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-400 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Language</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <select value={form.language_preference} onChange={(e) => setForm({ ...form, language_preference: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 appearance-none">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="ru">Русский (Russian)</option>
                  <option value="pt">Português</option>
                  <option value="it">Italiano</option>
                  <option value="ko">한국어 (Korean)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Currency</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-medium">$</div>
                <select value={form.currency_preference} onChange={(e) => setForm({ ...form, currency_preference: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 appearance-none">
                  <option value="INR">₹ Indian Rupee (INR)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                  <option value="JPY">¥ Japanese Yen (JPY)</option>
                  <option value="AUD">A$ Australian Dollar (AUD)</option>
                  <option value="CAD">C$ Canadian Dollar (CAD)</option>
                  <option value="CHF">CHF Swiss Franc (CHF)</option>
                  <option value="CNY">¥ Chinese Yuan (CNY)</option>
                  <option value="AED">د.إ UAE Dirham (AED)</option>
                  <option value="SGD">S$ Singapore Dollar (SGD)</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 cursor-pointer mt-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        <div className="warm-card p-6 border-red-100">
          <h3 className="font-semibold text-red-600 mb-2">Danger zone</h3>
          <p className="text-sm text-stone-500 mb-4">Permanently delete your account and all your data.</p>
          <button onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer border border-red-200">
            <Trash2 size={14} /> Delete account
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
