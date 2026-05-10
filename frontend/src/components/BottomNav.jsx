import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, PlusCircle, Compass, UserCircle } from 'lucide-react';

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/city-search', icon: Compass, label: 'Explore' },
  { to: '/create-trip', icon: PlusCircle, label: 'Add', primary: true },
  { to: '/trips', icon: Map, label: 'Trips' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {mobileNavItems.map(({ to, icon: Icon, label, primary }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                primary 
                  ? 'text-teal-600 -mt-6' // Pop-out effect for primary button
                  : isActive
                  ? 'text-teal-600'
                  : 'text-stone-400 hover:text-stone-600'
              }`
            }
          >
            {primary ? (
              <div className="bg-teal-600 text-white p-3.5 rounded-full shadow-lg shadow-teal-600/30">
                <Icon size={24} strokeWidth={2} />
              </div>
            ) : (
              <>
                <Icon size={20} strokeWidth={1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
