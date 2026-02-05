import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getTodayDate } from '../../utils/helpers';

const AttendanceForm = ({
  isOpen,
  onClose,
  onSubmit,
  employees = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: getTodayDate(),
    status: 'Present',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        employee_id: '',
        date: getTodayDate(),
        status: 'Present',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusSelect = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Please select an employee';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.status) newErrors.status = 'Please select a status';

    // Check if date is not in the future
    if (formData.date > getTodayDate()) {
      newErrors.date = 'Cannot mark attendance for future dates';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            zIndex: 'var(--z-modal-backdrop)',
          }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-2xl)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--gray-100)',
              background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)',
            }}>
              <div>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                }}>
                  Mark Attendance
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-500)',
                  marginTop: 4,
                }}>
                  Record attendance for an employee
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--gray-100)',
                  border: 'none',
                  borderRadius: 'var(--radius-xl)',
                  color: 'var(--gray-500)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: 'var(--space-6)' }}>
                {/* Employee Select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ marginBottom: 'var(--space-5)' }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--gray-700)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    Select Employee
                    <span style={{ color: 'var(--danger-500)', marginLeft: 4 }}>*</span>
                  </label>

                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: 'var(--space-3)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--gray-400)',
                    }}>
                      <User size={18} />
                    </div>

                    <select
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        paddingLeft: 'var(--space-10)',
                        fontSize: 'var(--text-sm)',
                        color: formData.employee_id ? 'var(--gray-900)' : 'var(--gray-400)',
                        background: 'var(--gray-50)',
                        border: `2px solid ${errors.employee_id ? 'var(--danger-500)' : 'var(--gray-200)'}`,
                        borderRadius: 'var(--radius-xl)',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                      }}
                    >
                      <option value="">Choose an employee</option>
                      {employees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.full_name} ({emp.employee_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <AnimatePresence>
                    {errors.employee_id && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-1)',
                          marginTop: 'var(--space-2)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--danger-600)',
                        }}
                      >
                        <AlertCircle size={12} />
                        {errors.employee_id}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Date Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ marginBottom: 'var(--space-5)' }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--gray-700)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    Date
                    <span style={{ color: 'var(--danger-500)', marginLeft: 4 }}>*</span>
                  </label>

                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: 'var(--space-3)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--gray-400)',
                    }}>
                      <Calendar size={18} />
                    </div>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      max={getTodayDate()}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        paddingLeft: 'var(--space-10)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--gray-900)',
                        background: 'var(--gray-50)',
                        border: `2px solid ${errors.date ? 'var(--danger-500)' : 'var(--gray-200)'}`,
                        borderRadius: 'var(--radius-xl)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <AnimatePresence>
                    {errors.date && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-1)',
                          marginTop: 'var(--space-2)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--danger-600)',
                        }}
                      >
                        <AlertCircle size={12} />
                        {errors.date}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Status Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--gray-700)',
                    marginBottom: 'var(--space-3)',
                  }}>
                    Attendance Status
                    <span style={{ color: 'var(--danger-500)', marginLeft: 4 }}>*</span>
                  </label>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-3)',
                  }}>
                    {/* Present Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusSelect('Present')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-4)',
                        background: formData.status === 'Present'
                          ? 'linear-gradient(135deg, var(--success-50) 0%, var(--success-100) 100%)'
                          : 'var(--gray-50)',
                        border: `2px solid ${formData.status === 'Present' ? 'var(--success-500)' : 'var(--gray-200)'}`,
                        borderRadius: 'var(--radius-xl)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: formData.status === 'Present' ? [1, 1.2, 1] : 1,
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: formData.status === 'Present'
                            ? 'var(--gradient-success)'
                            : 'var(--gray-200)',
                          borderRadius: 'var(--radius-full)',
                          color: formData.status === 'Present' ? 'white' : 'var(--gray-500)',
                          boxShadow: formData.status === 'Present' ? 'var(--shadow-success)' : 'none',
                        }}
                      >
                        <CheckCircle size={24} />
                      </motion.div>
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: formData.status === 'Present' ? 'var(--success-700)' : 'var(--gray-600)',
                      }}>
                        Present
                      </span>
                    </motion.button>

                    {/* Absent Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusSelect('Absent')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-4)',
                        background: formData.status === 'Absent'
                          ? 'linear-gradient(135deg, var(--danger-50) 0%, var(--danger-100) 100%)'
                          : 'var(--gray-50)',
                        border: `2px solid ${formData.status === 'Absent' ? 'var(--danger-500)' : 'var(--gray-200)'}`,
                        borderRadius: 'var(--radius-xl)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: formData.status === 'Absent' ? [1, 1.2, 1] : 1,
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: formData.status === 'Absent'
                            ? 'var(--gradient-danger)'
                            : 'var(--gray-200)',
                          borderRadius: 'var(--radius-full)',
                          color: formData.status === 'Absent' ? 'white' : 'var(--gray-500)',
                          boxShadow: formData.status === 'Absent' ? 'var(--shadow-danger)' : 'none',
                        }}
                      >
                        <XCircle size={24} />
                      </motion.div>
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: formData.status === 'Absent' ? 'var(--danger-700)' : 'var(--gray-600)',
                      }}>
                        Absent
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 'var(--space-3)',
                padding: 'var(--space-4) var(--space-6)',
                background: 'var(--gray-50)',
                borderTop: '1px solid var(--gray-100)',
              }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-primary)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 16,
                          height: 16,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          display: 'inline-block',
                        }}
                      />
                      Saving...
                    </span>
                  ) : (
                    'Mark Attendance'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttendanceForm;