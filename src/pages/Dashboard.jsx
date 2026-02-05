import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { employeeAPI, attendanceAPI } from '../api';
import PageTransition from '../components/common/PageTransition';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { formatDate, getTodayDate } from '../utils/helpers';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    notMarked: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [employeesRes, todaySummaryRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getTodaySummary(),
        attendanceAPI.getAll(getTodayDate()),
      ]);

      setStats({
        totalEmployees: todaySummaryRes.total_employees || employeesRes.total || 0,
        presentToday: todaySummaryRes.present || 0,
        absentToday: todaySummaryRes.absent || 0,
        notMarked: todaySummaryRes.not_marked || 0,
      });

      setRecentAttendance(attendanceRes.data?.slice(0, 5) || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'primary',
      gradient: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: UserCheck,
      color: 'success',
      gradient: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)',
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      icon: UserX,
      color: 'danger',
      gradient: 'linear-gradient(135deg, var(--danger-500) 0%, var(--danger-600) 100%)',
    },
    {
      title: 'Not Marked',
      value: stats.notMarked,
      icon: Clock,
      color: 'warning',
      gradient: 'linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 100%)',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <PageTransition>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="page-title-icon">
              <TrendingUp size={20} />
            </div>
            Dashboard
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Welcome back! Here's what's happening today.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--gray-200)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Calendar size={18} color="var(--primary-500)" />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-700)' }}>
            {formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}
          </span>
        </motion.div>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={fetchDashboardData}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Stats Grid */}
      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: 'var(--shadow-xl)',
              transition: { type: 'spring', stiffness: 300 }
            }}
            className="stat-card"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: `var(--${stat.color}-100)`,
              borderRadius: '50%',
              opacity: 0.5,
            }} />

            <motion.div
              className={`stat-card-icon ${stat.color}`}
              whileHover={{ rotate: 10, scale: 1.1 }}
              style={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <stat.icon size={24} />
            </motion.div>

            <motion.div
              className="stat-card-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              {stat.value}
            </motion.div>

            <div className="stat-card-label" style={{ position: 'relative', zIndex: 1 }}>
              {stat.title}
            </div>

            {/* Animated bottom line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                background: stat.gradient,
                transformOrigin: 'left',
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-6)',
        }}
      >
        {/* Quick Actions Card */}
        <motion.div
          variants={itemVariants}
          className="card"
          style={{ overflow: 'hidden' }}
        >
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/employees" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 8, backgroundColor: 'var(--primary-50)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--primary-100)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--primary-600)',
                  }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 'var(--text-sm)' }}>
                      Manage Employees
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                      Add, edit, or remove employees
                    </p>
                  </div>
                </div>
                <ArrowRight size={20} color="var(--gray-400)" />
              </motion.div>
            </Link>

            <Link to="/attendance" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 8, backgroundColor: 'var(--success-50)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--success-100)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--success-600)',
                  }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 'var(--text-sm)' }}>
                      Mark Attendance
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                      Record daily attendance
                    </p>
                  </div>
                </div>
                <ArrowRight size={20} color="var(--gray-400)" />
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Today's Attendance Summary */}
        <motion.div
          variants={itemVariants}
          className="card"
          style={{ overflow: 'hidden' }}
        >
          <div className="card-header">
            <h3 className="card-title">Today's Overview</h3>
          </div>
          <div className="card-body">
            {stats.totalEmployees > 0 ? (
              <div>
                {/* Progress Circle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-6)',
                }}>
                  <div style={{ position: 'relative', width: 140, height: 140 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      {/* Background circle */}
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="var(--gray-100)"
                        strokeWidth="12"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(stats.presentToday / stats.totalEmployees) * 377} 377`}
                        initial={{ strokeDasharray: '0 377' }}
                        animate={{ strokeDasharray: `${(stats.presentToday / stats.totalEmployees) * 377} 377` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        transform="rotate(-90 70 70)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--success-500)" />
                          <stop offset="100%" stopColor="var(--primary-500)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: 'spring' }}
                        style={{
                          fontSize: 'var(--text-2xl)',
                          fontWeight: 700,
                          color: 'var(--gray-900)',
                        }}
                      >
                        {stats.totalEmployees > 0 
                          ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
                          : 0}%
                      </motion.div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                        Attendance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--success-500)',
                    }} />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                      Present ({stats.presentToday})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--danger-500)',
                    }} />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                      Absent ({stats.absentToday})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
                  No employees added yet
                </p>
                <Link to="/employees">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                    style={{ marginTop: 'var(--space-4)' }}
                  >
                    Add Employees
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;