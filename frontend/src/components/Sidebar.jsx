import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Map, PlusCircle, Compass, UserCircle, BarChart3, LogOut
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/create-trip', icon: PlusCircle, label: 'New Trip' },
  { to: '/city-search', icon: Compass, label: 'Explore' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
  { to: '/admin', icon: BarChart3, label: 'Admin' },
];

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 bg-white border-r border-stone-200 hidden md:flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-5 border-b border-stone-100">
        <h2 className="font-display text-2xl font-bold text-gradient-warm tracking-tight">Traveloop</h2>
        <p className="text-xs text-stone-400 mt-0.5">Plan · Travel · Share</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-100">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-700 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-stone-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-stone-500 text-sm font-medium cursor-pointer"
        >
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
