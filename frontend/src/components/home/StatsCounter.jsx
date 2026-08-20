import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, FolderOpen, Star, Award } from 'lucide-react';

const stats = [
  { icon: FolderOpen, value: 500, suffix: '+', label: 'Projects Available', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { icon: Users, value: 5000, suffix: '+', label: 'Students Trained', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Star, value: 98, suffix: '%', label: 'Satisfaction Rate', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Award, value: 12, suffix: '+', label: 'Categories Covered', color: 'text-green-400', bg: 'bg-green-500/10' },
];

const Counter = ({ value, suffix, isVisible }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let current = 0;
    const increment = value / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 2000 / 60);
    return () => clearInterval(timer);
  }, [isVisible, value]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatsCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section className="py-20 relative" ref={ref} aria-label="Platform statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, color, bg }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
              className="card-glass text-center" aria-label={`${value}${suffix} ${label}`}>
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-7 h-7 ${color}`} aria-hidden="true" />
              </div>
              <div className={`text-4xl font-black ${color} mb-1`} aria-live="polite">
                <Counter value={value} suffix={suffix} isVisible={isInView} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;