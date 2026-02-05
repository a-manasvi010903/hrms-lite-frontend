import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({
  children,
  delay = 0,
  hover = true,
  className = '',
  style = {},
  onClick = null,
}) => {
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
        delay,
      },
    },
  };

  const hoverVariants = hover
    ? {
        y: -4,
        boxShadow: 'var(--shadow-lg)',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        },
      }
    : {};

  const tapVariants = onClick
    ? {
        scale: 0.98,
      }
    : {};

  return (
    <motion.div
      className={`card ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants}
      whileTap={tapVariants}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

// Sub-components for card structure
AnimatedCard.Header = ({ children, style = {} }) => (
  <div className="card-header" style={style}>
    {children}
  </div>
);

AnimatedCard.Body = ({ children, style = {} }) => (
  <div className="card-body" style={style}>
    {children}
  </div>
);

AnimatedCard.Footer = ({ children, style = {} }) => (
  <div className="card-footer" style={style}>
    {children}
  </div>
);

AnimatedCard.Title = ({ children, style = {} }) => (
  <h3 className="card-title" style={style}>
    {children}
  </h3>
);

AnimatedCard.Subtitle = ({ children, style = {} }) => (
  <p className="card-subtitle" style={style}>
    {children}
  </p>
);

export default AnimatedCard;