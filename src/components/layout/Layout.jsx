import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;