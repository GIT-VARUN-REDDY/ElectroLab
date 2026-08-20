import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-label="Loading">
      <motion.div
        className={`${sizes[size]} border-2 border-primary-500/30 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {fullScreen && <p className="text-gray-400 text-sm">Loading...</p>}
    </div>
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }
  return spinner;
};

export default LoadingSpinner;