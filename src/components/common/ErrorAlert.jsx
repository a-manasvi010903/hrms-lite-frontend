import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

const ErrorAlert = ({
  message = 'Something went wrong',
  onRetry = null,
  onDismiss = null,
  show = true,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4)',
            background: 'linear-gradient(135deg, var(--danger-50) 0%, #fff5f5 100%)',
            border: '1px solid var(--danger-200)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-4)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--danger-100)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <AlertCircle size={20} color="var(--danger-600)" />
            </motion.div>
            <div>
              <p style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--danger-800)',
                marginBottom: 2,
              }}>
                Error
              </p>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--danger-600)',
              }}>
                {message}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {onRetry && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--danger-700)',
                  background: 'white',
                  border: '1px solid var(--danger-200)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} />
                Retry
              </motion.button>
            )}
            {onDismiss && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDismiss}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--danger-500)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorAlert;