import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const AttendanceSummary = ({ summary }) => {
  const {
    employee_id = '',
    total_days = 0,
    present_days = 0,
    absent_days = 0,
    attendance_percentage = 0,
  } = summary || {};

  const stats = [
    {
      label: 'Total Days',
      value: total_days,
      icon: Clock,
      color: 'primary',
      gradient: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
    },
    {
      label: 'Present',
      value: present_days,
      icon: CheckCircle,
      color: 'success',
      gradient: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)',
    },
    {
      label: 'Absent',
      value: absent_days,
      icon: XCircle,
      color: 'danger',
      gradient: 'linear-gradient(135deg, var(--danger-500) 0%, var(--danger-600) 100%)',
    },
    {
      label: 'Attendance %',
      value: `${attendance_percentage}%`,
      icon: TrendingUp,
      color: 'accent',
      gradient: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)',
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          whileHover={{ 
            y: -4, 
            boxShadow: 'var(--shadow-lg)',
          }}
          style={{
            position: 'relative',
            padding: 'var(--space-4)',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--gray-200)',
            overflow: 'hidden',
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 60,
              height: 60,
              background: `var(--${stat.color}-100)`,
              borderRadius: '50%',
              opacity: 0.5,
            }}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            position: 'relative',
            zIndex: 1,
          }}>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: stat.gradient,
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                boxShadow: `0 4px 12px -2px var(--${stat.color}-400)`,
              }}
            >
              <stat.icon size={20} />
            </motion.div>

            <div>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--gray-500)',
                fontWeight: 500,
                marginBottom: 2,
              }}>
                {stat.label}
              </p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                }}
              >
                {stat.value}
              </motion.p>
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: stat.gradient,
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AttendanceSummary;