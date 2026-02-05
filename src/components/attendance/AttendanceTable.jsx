import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';

const AttendanceTable = ({ records, showEmployee = true }) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <div className="table-container" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
      <table className="table">
        <thead>
          <tr>
            {showEmployee && <th style={{ paddingLeft: 'var(--space-6)' }}>Employee</th>}
            <th>Date</th>
            <th>Status</th>
            <th>Recorded At</th>
          </tr>
        </thead>
        <motion.tbody
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          {records.map((record, index) => (
            <motion.tr
              key={`${record.employee_id}-${record.date}`}
              variants={rowVariants}
              whileHover={{
                backgroundColor: record.status === 'Present' ? 'var(--success-50)' : 'var(--danger-50)',
                transition: { duration: 0.2 },
              }}
            >
              {showEmployee && (
                <td style={{ paddingLeft: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-lg)',
                        background: `linear-gradient(135deg, ${getAvatarColor(record.employee_id)} 0%, var(--accent-500) 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      {record.employee_id.slice(0, 2)}
                    </motion.div>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--gray-900)',
                      fontSize: 'var(--text-sm)',
                    }}>
                      {record.employee_id}
                    </span>
                  </div>
                </td>
              )}

              <td>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--gray-700)',
                }}>
                  <Calendar size={16} color="var(--gray-400)" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                    {formatDate(record.date, 'EEE, MMM dd, yyyy')}
                  </span>
                </div>
              </td>

              <td>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-1) var(--space-3)',
                    background: record.status === 'Present'
                      ? 'linear-gradient(135deg, var(--success-100) 0%, var(--success-50) 100%)'
                      : 'linear-gradient(135deg, var(--danger-100) 0%, var(--danger-50) 100%)',
                    border: `1px solid ${record.status === 'Present' ? 'var(--success-200)' : 'var(--danger-200)'}`,
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {record.status === 'Present' ? (
                    <CheckCircle size={16} color="var(--success-600)" />
                  ) : (
                    <XCircle size={16} color="var(--danger-600)" />
                  )}
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: record.status === 'Present' ? 'var(--success-700)' : 'var(--danger-700)',
                  }}>
                    {record.status}
                  </span>
                </motion.div>
              </td>

              <td>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-500)',
                }}>
                  {formatDate(record.created_at, 'MMM dd, yyyy HH:mm')}
                </span>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;