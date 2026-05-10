import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
