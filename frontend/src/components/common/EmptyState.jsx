import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, desc, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
    role="status"
    aria-label={title}
  >
    <div className="text-6xl mb-4" aria-hidden="true">{icon || '🔍'}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    {desc && <p className="text-gray-400 mb-6 max-w-sm">{desc}</p>}
    {action && <div>{action}</div>}
  </motion.div>
);

export default EmptyState;