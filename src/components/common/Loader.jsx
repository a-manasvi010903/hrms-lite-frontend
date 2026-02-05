import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const sizes = {
    small: { spinner: 24, dot: 8 },
    medium: { spinner: 48, dot: 12 },
    large: { spinner: 64, dot: 16 },
  };

  const currentSize = sizes[size];

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -10],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const content = (
    <motion.div 
      className="loader-container" 
      style={{ minHeight: fullScreen ? '100vh' : '300px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="loader-dots"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{ gap: currentSize.dot / 2 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            variants={dotVariants}
            style={{
              width: currentSize.dot,
              height: currentSize.dot,
              background: index === 1 ? 'var(--primary-500)' : 'var(--primary-300)',
              borderRadius: '50%',
              display: 'block',
            }}
          />
        ))}
      </motion.div>
      {text && (
        <motion.p
          className="loader-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            color: 'var(--gray-500)',
            fontWeight: 500,
          }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  return content;
};

export default Loader;