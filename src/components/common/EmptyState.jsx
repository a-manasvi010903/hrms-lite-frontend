import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Users, Calendar, Search } from 'lucide-react';

const EmptyState = ({
  type = 'default',
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  action = null,
  icon: CustomIcon = null,
}) => {
  const icons = {
    default: Inbox,
    employees: Users,
    attendance: Calendar,
    search: Search,
  };

  const Icon = CustomIcon || icons[type] || icons.default;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="empty-state"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="empty-state-icon"
        variants={iconVariants}
        whileHover="hover"
        style={{
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
          borderRadius: 'var(--radius-full)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <Icon size={40} strokeWidth={1.5} color="var(--gray-400)" />
      </motion.div>

      <motion.h3
        className="empty-state-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 600,
          color: 'var(--gray-900)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="empty-state-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--gray-500)',
          maxWidth: 320,
          textAlign: 'center',
          marginBottom: 'var(--space-6)',
          lineHeight: 1.6,
        }}
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;