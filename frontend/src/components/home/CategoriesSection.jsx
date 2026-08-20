import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Bot, Zap, Radio, Layers, Server, Brain, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

const iconMap = { Cpu, Wifi, Bot, Zap, Radio, Layers, Server, Brain };

const defaultCategories = [
  { name: 'Embedded Systems', icon: 'Cpu', color: '#6366f1', projectCount: 80 },
  { name: 'IoT Projects', icon: 'Wifi', color: '#06b6d4', projectCount: 95 },
  { name: 'Robotics', icon: 'Bot', color: '#8b5cf6', projectCount: 60 },
  { name: 'Arduino', icon: 'Zap', color: '#10b981', projectCount: 120 },
  { name: 'Raspberry Pi', icon: 'Server', color: '#f59e0b', projectCount: 75 },
  { name: 'AI+Electronics', icon: 'Brain', color: '#ef4444', projectCount: 45 },
  { name: 'VLSI', icon: 'Layers', color: '#ec4899', projectCount: 50 },
  { name: 'Communication', icon: 'Radio', color: '#14b8a6', projectCount: 40 },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState(defaultCategories);
  useEffect(() => {
    api.get('/categories').then(({ data }) => { if (data.success && data.data.length > 0) setCategories(data.data); }).catch(() => {});
  }, []);

  return (
    <section className="py-20" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3 block">Browse by Category</span>
          <h2 id="categories-heading" className="text-4xl lg:text-5xl font-black text-white mb-4">
            Explore <span className="gradient-text">Project Categories</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">From beginner mini projects to advanced IEEE research projects.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Cpu;
            return (
              <motion.div key={cat._id || cat.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }} viewport={{ once: true }} whileHover={{ y: -4, scale: 1.02 }}>
                <Link to={`/projects?category=${cat._id || ''}`} className="block glass rounded-2xl p-5 hover:border-primary-500/30 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: cat.color }} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-primary-300 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.projectCount || 0} projects</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
            View All Projects <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;