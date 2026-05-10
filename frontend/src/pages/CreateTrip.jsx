import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, FileText, Image, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { createTripAPI } from '../services/api';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ trip_name: '', description: '', start_date: '', end_date: '' });
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImage = (e) => { const f = e.target.files[0]; if (f) { setCoverImage(f); setPreview(URL.createObjectURL(f)); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.trip_name || !form.start_date || !form.end_date) { setError('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((k) => formData.append(k, form[k]));
      if (coverImage) formData.append('cover_image', coverImage);
      const res = await createTripAPI(formData);
      navigate(`/trip/${res.data.trip_id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.details 
        ? `${err.response.data.error}: ${err.response.data.details}` 
        : (err.response?.data?.error || 'Failed to create trip');
      setError(errorMsg);
    }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Create a new trip</h1>
          <p className="text-stone-500 mb-8">Fill in the details to start planning your next adventure.</p>

          {error && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Trip name *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input name="trip_name" value={form.trip_name} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                  placeholder="e.g. European Summer 2026" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">Start date *</label>
                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">End date *</label>
                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all resize-none"
                placeholder="What's this trip about?" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Cover photo</label>
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors cursor-pointer relative">
                <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-stone-400">
                    <Image size={28} />
                    <span className="text-sm">Click to upload a cover image</span>
                  </div>
                )}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} type="submit"
              className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-xl shadow-sm hover:bg-teal-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer">
              {loading ? 'Creating...' : <><Save size={18} /> Create trip</>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
