import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { useContext } from 'react';

const CITIES = [
  { name: 'Paris', country: 'France', region: 'Europe', cost: 150, popularity: 9.5, emoji: '🇫🇷' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', cost: 120, popularity: 9.3, emoji: '🇯🇵' },
  { name: 'New York', country: 'USA', region: 'North America', cost: 200, popularity: 9.4, emoji: '🇺🇸' },
  { name: 'London', country: 'UK', region: 'Europe', cost: 170, popularity: 9.2, emoji: '🇬🇧' },
  { name: 'Dubai', country: 'UAE', region: 'Middle East', cost: 180, popularity: 9.0, emoji: '🇦🇪' },
  { name: 'Bangkok', country: 'Thailand', region: 'Asia', cost: 50, popularity: 8.7, emoji: '🇹🇭' },
  { name: 'Rome', country: 'Italy', region: 'Europe', cost: 130, popularity: 9.1, emoji: '🇮🇹' },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', cost: 120, popularity: 8.9, emoji: '🇪🇸' },
  { name: 'Sydney', country: 'Australia', region: 'Oceania', cost: 160, popularity: 8.8, emoji: '🇦🇺' },
  { name: 'Istanbul', country: 'Turkey', region: 'Europe', cost: 70, popularity: 8.6, emoji: '🇹🇷' },
  { name: 'Singapore', country: 'Singapore', region: 'Asia', cost: 140, popularity: 8.8, emoji: '🇸🇬' },
  { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', cost: 140, popularity: 8.7, emoji: '🇳🇱' },
  { name: 'Bali', country: 'Indonesia', region: 'Asia', cost: 40, popularity: 9.0, emoji: '🇮🇩' },
  { name: 'Marrakech', country: 'Morocco', region: 'Africa', cost: 45, popularity: 8.3, emoji: '🇲🇦' },
  { name: 'Prague', country: 'Czech Republic', region: 'Europe', cost: 80, popularity: 8.5, emoji: '🇨🇿' },
  { name: 'Lisbon', country: 'Portugal', region: 'Europe', cost: 90, popularity: 8.6, emoji: '🇵🇹' },
  { name: 'Buenos Aires', country: 'Argentina', region: 'South America', cost: 60, popularity: 8.4, emoji: '🇦🇷' },
  { name: 'Cape Town', country: 'South Africa', region: 'Africa', cost: 70, popularity: 8.5, emoji: '🇿🇦' },
  { name: 'Kyoto', country: 'Japan', region: 'Asia', cost: 110, popularity: 8.9, emoji: '🇯🇵' },
  { name: 'Reykjavik', country: 'Iceland', region: 'Europe', cost: 190, popularity: 8.2, emoji: '🇮🇸' },
];

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'];

const CitySearch = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');

  const filtered = CITIES.filter((c) => {
    const q = c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase());
    return q && (region === 'All' || c.region === region);
  });

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Explore destinations</h1>
        <p className="text-stone-500 mb-6">Discover cities and get inspired for your next adventure.</p>

        <div className="flex gap-4 mb-6 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cities or countries..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {REGIONS.map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  region === r ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-white border border-stone-200 text-stone-500 hover:text-stone-700'
                }`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((city, i) => (
            <motion.div key={city.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="warm-card p-5 hover:shadow-md cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-stone-800 flex items-center gap-2">{city.emoji} {city.name}</h3>
                  <p className="text-xs text-stone-500">{city.country}</p>
                </div>
                <span className="flex items-center gap-0.5 text-amber-500 text-sm font-medium"><Star size={13} fill="currentColor" /> {city.popularity}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                <span className="flex items-center gap-1 text-sm text-stone-500"><DollarSign size={13} /> {formatCurrency(city.cost, user?.currency_preference)}/day</span>
                <span className="text-xs px-2 py-1 bg-stone-100 rounded-full text-stone-500">{city.region}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-stone-500">
            <MapPin size={36} className="mx-auto mb-3 text-stone-400" />
            <p className="text-sm">No cities found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CitySearch;
