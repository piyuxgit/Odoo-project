import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import travelBg from '../assets/travel-bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={travelBg} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="font-display text-4xl font-bold mb-3">Your next adventure starts here</h2>
          <p className="text-white/80 text-lg">Plan multi-city trips, track budgets, and share your journey with the world.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center bg-[#faf8f5] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Welcome back</h1>
            <p className="text-stone-500">Sign in to continue planning your trips.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                  placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-stone-600">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                  placeholder="••••••••" required />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isLoading} type="submit"
              className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-xl shadow-sm hover:bg-teal-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer">
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
