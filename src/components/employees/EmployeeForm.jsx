import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Building, Hash, AlertCircle, CheckCircle } from 'lucide-react';
import { isValidEmail } from '../../utils/helpers';

const EmployeeForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        department: initialData.department || '',
      });
    } else {
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'employee_id':
        if (!value.trim()) return 'Employee ID is required';
        if (value.length < 2) return 'Employee ID must be at least 2 characters';
        if (!/^[a-zA-Z0-9\-_]+$/.test(value)) return 'Only letters, numbers, hyphens, and underscores allowed';
        return '';
      case 'full_name':
        if (!value.trim()) return 'Full name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s\-']+$/.test(value)) return 'Only letters, spaces, hyphens, and apostrophes allowed';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email address';
        return '';
      case 'department':
        if (!value.trim()) return 'Department is required';
        if (value.length < 2) return 'Department must be at least 2 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!isEditing || key !== 'employee_id') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({ employee_id: true, full_name: true, email: true, department: true });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
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

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
    blur: { scale: 1 },
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];

  const inputFields = [
    {
      name: 'employee_id',
      label: 'Employee ID',
      icon: Hash,
      placeholder: 'e.g., EMP001',
      disabled: isEditing,
    },
    {
      name: 'full_name',
      label: 'Full Name',
      icon: User,
      placeholder: 'e.g., John Doe',
    },
    {
      name: 'email',
      label: 'Email Address',
      icon: Mail,
      placeholder: 'e.g., john.doe@company.com',
      type: 'email',
    },
  ];

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
              maxWidth: 500,
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
                  {isEditing ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-500)',
                  marginTop: 4,
                }}>
                  {isEditing ? 'Update employee information' : 'Fill in the details to add a new employee'}
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
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ marginBottom: 'var(--space-5)' }}
                  >
                    <label
                      htmlFor={field.name}
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--gray-700)',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      {field.label}
                      <span style={{ color: 'var(--danger-500)', marginLeft: 4 }}>*</span>
                    </label>

                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: 'var(--space-3)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: errors[field.name] && touched[field.name]
                          ? 'var(--danger-500)'
                          : 'var(--gray-400)',
                        transition: 'color 0.2s',
                      }}>
                        <field.icon size={18} />
                      </div>

                      <motion.input
                        variants={inputVariants}
                        whileFocus="focus"
                        id={field.name}
                        name={field.name}
                        type={field.type || 'text'}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={field.disabled}
                        placeholder={field.placeholder}
                        style={{
                          width: '100%',
                          padding: 'var(--space-3) var(--space-4)',
                          paddingLeft: 'var(--space-10)',
                          paddingRight: touched[field.name] ? 'var(--space-10)' : 'var(--space-4)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--gray-900)',
                          background: field.disabled ? 'var(--gray-100)' : 'var(--gray-50)',
                          border: `2px solid ${
                            errors[field.name] && touched[field.name]
                              ? 'var(--danger-500)'
                              : touched[field.name] && !errors[field.name]
                              ? 'var(--success-500)'
                              : 'var(--gray-200)'
                          }`,
                          borderRadius: 'var(--radius-xl)',
                          outline: 'none',
                          transition: 'all 0.2s',
                          cursor: field.disabled ? 'not-allowed' : 'text',
                        }}
                      />

                      {touched[field.name] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            position: 'absolute',
                            right: 'var(--space-3)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        >
                          {errors[field.name] ? (
                            <AlertCircle size={18} color="var(--danger-500)" />
                          ) : (
                            <CheckCircle size={18} color="var(--success-500)" />
                          )}
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {errors[field.name] && touched[field.name] && (
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
                          {errors[field.name]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {/* Department Select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="department"
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--gray-700)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Department
                    <span style={{ color: 'var(--danger-500)', marginLeft: 4 }}>*</span>
                  </label>

                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: 'var(--space-3)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: errors.department && touched.department
                        ? 'var(--danger-500)'
                        : 'var(--gray-400)',
                    }}>
                      <Building size={18} />
                    </div>

                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        paddingLeft: 'var(--space-10)',
                        fontSize: 'var(--text-sm)',
                        color: formData.department ? 'var(--gray-900)' : 'var(--gray-400)',
                        background: 'var(--gray-50)',
                        border: `2px solid ${
                          errors.department && touched.department
                            ? 'var(--danger-500)'
                            : touched.department && !errors.department
                            ? 'var(--success-500)'
                            : 'var(--gray-200)'
                        }`,
                        borderRadius: 'var(--radius-xl)',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                      }}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <AnimatePresence>
                    {errors.department && touched.department && (
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
                        {errors.department}
                      </motion.p>
                    )}
                  </AnimatePresence>
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
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    isEditing ? 'Update Employee' : 'Add Employee'
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

export default EmployeeForm;