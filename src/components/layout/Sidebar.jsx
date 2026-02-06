import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  X,
  Menu,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/attendance', icon: Calendar, label: 'Attendance' },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const linkVariants = {
    initial: { x: -20, opacity: 0 },
    animate: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    }),
    hover: {
      x: 8,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 'var(--z-modal-backdrop)',
              display: 'none',
            }}
            className="sidebar-overlay"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--sidebar-width)',
          height: '100vh',
          background: 'white',
          borderRight: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 'var(--z-fixed)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: 'var(--space-5) var(--space-5)',
          borderBottom: '1px solid var(--gray-100)',
        }}>
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 44,
                height: 44,
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-primary)',
              }}
            >
              <Sparkles size={22} color="white" />
            </motion.div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--gray-900)',
                lineHeight: 1.2,
              }}>
                HRMS Lite
              </h1>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--gray-500)',
                fontWeight: 500,
              }}>
                Management System
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: 'var(--space-4)',
          overflowY: 'auto',
        }}>
          <p style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-3)',
            paddingLeft: 'var(--space-3)',
          }}>
            Menu
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={item.path}
                  custom={index}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <NavLink
                    to={item.path}
                    onClick={() => window.innerWidth < 768 && onToggle()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-xl)',
                      textDecoration: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isActive
                        ? 'linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%)'
                        : 'transparent',
                      border: isActive ? '1px solid var(--primary-100)' : '1px solid transparent',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: 24,
                          background: 'var(--gradient-primary)',
                          borderRadius: '0 4px 4px 0',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      style={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-lg)',
                        background: isActive
                          ? 'var(--gradient-primary)'
                          : 'var(--gray-100)',
                        color: isActive ? 'white' : 'var(--gray-500)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <item.icon size={18} />
                    </motion.div>

                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--primary-700)' : 'var(--gray-700)',
                    }}>
                      {item.label}
                    </span>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          marginLeft: 'auto',
                          width: 8,
                          height: 8,
                          background: 'var(--primary-500)',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          borderTop: '1px solid var(--gray-100)',
          background: 'var(--gray-50)',
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              padding: 'var(--space-3)',
              background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--accent-500) 100%)',
              borderRadius: 'var(--radius-lg)',
              color: 'white',
            }}
          >
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 4 }}>
              HRMS Lite v1.0
            </p>
            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
              © 2026 All rights reserved
            </p>
          </motion.div>
        </div>
      </motion.aside>

      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          zIndex: 'var(--z-sticky)',
          width: 48,
          height: 48,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          aside {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
