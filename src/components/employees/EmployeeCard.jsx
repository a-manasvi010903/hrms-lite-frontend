import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Building, Calendar, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { formatDateTime, getInitials, getAvatarColor } from '../../utils/helpers';

const EmployeeCard = ({ employee, onEdit, onDelete, index = 0 }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index * 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -8,
        boxShadow: 'var(--shadow-xl)',
      }}
      style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--gray-200)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top gradient bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(135deg, ${getAvatarColor(employee.full_name)} 0%, var(--accent-500) 100%)`,
        }}
      />

      {/* Content */}
      <div style={{ padding: 'var(--space-5)' }}>
        {/* Header with avatar and actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-4)',
        }}>
          {/* Avatar and name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-xl)',
                background: `linear-gradient(135deg, ${getAvatarColor(employee.full_name)} 0%, var(--accent-500) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 'var(--text-lg)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {getInitials(employee.full_name)}
            </motion.div>

            <div>
              <h3 style={{
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--gray-900)',
                marginBottom: 2,
              }}>
                {employee.full_name}
              </h3>
              <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--gray-600)',
              }}>
                {employee.employee_id}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-100)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(employee)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gray-100)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--gray-500)',
                cursor: 'pointer',
              }}
            >
              <Edit2 size={14} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'var(--danger-100)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(employee)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gray-100)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--gray-500)',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        </div>

        {/* Info items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}>
          {/* Email */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <div style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-600)',
            }}>
              <Mail size={14} />
            </div>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-600)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {employee.email}
            </span>
          </div>

          {/* Department */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <div style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--success-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--success-600)',
            }}>
              <Building size={14} />
            </div>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-600)',
            }}>
              {employee.department}
            </span>
          </div>

          {/* Joined date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <div style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--warning-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--warning-600)',
            }}>
              <Calendar size={14} />
            </div>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-500)',
            }}>
              Joined {formatDateTime(employee.created_at)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;