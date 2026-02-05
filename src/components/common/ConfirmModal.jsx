import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, AlertCircle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}) => {
  const typeConfig = {
    danger: {
      icon: Trash2,
      iconBg: 'var(--danger-100)',
      iconColor: 'var(--danger-600)',
      btnClass: 'btn-danger',
      gradient: 'linear-gradient(135deg, var(--danger-500) 0%, var(--danger-600) 100%)',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'var(--warning-100)',
      iconColor: 'var(--warning-600)',
      btnClass: 'btn-warning',
      gradient: 'linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 100%)',
    },
    info: {
      icon: AlertCircle,
      iconBg: 'var(--primary-100)',
      iconColor: 'var(--primary-600)',
      btnClass: 'btn-primary',
      gradient: 'var(--gradient-primary)',
    },
  };

  const config = typeConfig[type] || typeConfig.danger;
  const Icon = config.icon;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.1,
      },
    },
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
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            zIndex: 'var(--z-modal-backdrop)',
          }}
        >
          <motion.div
            className="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
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
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--gray-100)',
            }}>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--gray-900)',
              }}>
                {title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: 36,
                  height: 36,
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
                <X size={20} />
              </motion.button>
            </div>

            {/* Body */}
            <div style={{
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <motion.div
                variants={iconVariants}
                style={{
                  width: 72,
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: config.iconBg,
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                <Icon size={32} color={config.iconColor} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-600)',
                  lineHeight: 1.6,
                  maxWidth: 300,
                }}
              >
                {message}
              </motion.p>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
              padding: 'var(--space-4) var(--space-5)',
              background: 'var(--gray-50)',
              borderTop: '1px solid var(--gray-100)',
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="btn btn-secondary"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading}
                style={{
                  padding: 'var(--space-2) var(--space-5)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'white',
                  background: config.gradient,
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
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
                    Processing...
                  </span>
                ) : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;