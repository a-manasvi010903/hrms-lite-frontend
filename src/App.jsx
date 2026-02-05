import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

// Styles
import './styles/index.css';

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: 'var(--gray-900)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success-500)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger-500)',
              secondary: 'white',
            },
          },
        }}
      />

      {/* Main Layout */}
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}

export default App;