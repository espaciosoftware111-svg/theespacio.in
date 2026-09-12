import React from 'react';
import { motion } from 'framer-motion';

const ScrollDownIndicator = ({ light = false, className = '' }) => {
  const textColor = light ? 'text-ink/80' : 'text-white/85';
  const iconColor = light ? 'text-ink/80' : 'text-white/85';

  return (
    <motion.div 
      className={`absolute bottom-3 sm:bottom-4.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <motion.span 
        className={`font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] drop-shadow-md ${textColor}`}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll Down.
      </motion.span>
      <motion.div
        animate={{ 
          y: [0, 7, 0],
          opacity: [0.45, 1, 0.45]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className={`w-4 h-4 ${iconColor} flex items-center justify-center drop-shadow-md`}
      >
        <svg width="12" height="7" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollDownIndicator;
