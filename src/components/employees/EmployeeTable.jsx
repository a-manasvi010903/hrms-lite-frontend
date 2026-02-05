import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, User, Mail, Building, Calendar } from 'lucide-react';
import { formatDateTime, getInitials, getAvatarColor } from '../../utils/helpers';

const EmployeeTable = ({ employees, onEdit, onDelete, loading }) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
            <th style={{ paddingLeft: 'var(--space-6)' }}>Employee</th>
            <th>Email</th>
            <th>Department</th>
            <th>Joined</th>
            <th style={{ textAlign: 'right', paddingRight: 'var(--space-6)' }}>Actions</th>
          </tr>
        </thead>
        <motion.tbody
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          {employees.map((employee, index) => (
            <motion.tr
              key={employee.employee_id}
              variants={rowVariants}
              whileHover={{
                backgroundColor: 'var(--primary-50)',
                transition: { duration: 0.2 },
              }}
              style={{ cursor: 'pointer' }}
            >
              <td style={{ paddingLeft: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-xl)',
                      background: `linear-gradient(135deg, ${getAvatarColor(employee.full_name)} 0%, var(--accent-500) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    {getInitials(employee.full_name)}
                  </motion.div>
                  <div>
                    <p style={{
                      fontWeight: 600,
                      color: 'var(--gray-900)',
                      fontSize: 'var(--text-sm)',
                    }}>
                      {employee.full_name}
                    </p>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--gray-500)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <span style={{
                        padding: '2px 8px',
                        background: 'var(--gray-100)',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 500,
                      }}>
                        {employee.employee_id}
                      </span>
                    </p>
                  </div>
                </div>
              </td>

              <td>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--gray-600)',
                }}>
                  <Mail size={14} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{employee.email}</span>
                </div>
              </td>

              <td>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    padding: 'var(--space-1) var(--space-3)',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                  }}
                >
                  <Building size={12} />
                  {employee.department}
                </motion.span>
              </td>

              <td>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--gray-500)',
                  fontSize: 'var(--text-sm)',
                }}>
                  <Calendar size={14} />
                  {formatDateTime(employee.created_at)}
                </div>
              </td>

              <td style={{ paddingRight: 'var(--space-6)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-2)',
                }}>
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'var(--primary-100)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(employee);
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gray-100)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--gray-600)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Edit2 size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: 'var(--danger-100)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(employee);
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gray-100)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--gray-600)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;