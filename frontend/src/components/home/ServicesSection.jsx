import React from 'react';
import { motion } from 'framer-motion';
import { Code2, BookOpen, Wrench, FileText, Video, Headphones } from 'lucide-react';

const services = [
  { icon: Code2, title: 'Custom Project Development', description: 'We build custom electronics projects tailored to your specifications and requirements.', color: '#6366f1' },
  { icon: BookOpen, title: 'Project Training & Mentorship', description: 'Hands-on training sessions with expert mentors for complete project implementation.', color: '#06b6d4' },
  { icon: Wrench, title: 'Hardware Assistance', description: 'Complete hardware setup, component sourcing guidance, and circuit debugging support.', color: '#10b981' },
  { icon: FileText, title: 'Documentation & Reports', description: 'Professional project documentation, technical reports, and presentation materials.', color: '#f59e0b' },
  { icon: Video, title: 'Video Demos & Tutorials', description: 'Step-by-step video demonstrations for every project in our catalog.', color: '#ef4444' },
  { icon: Headphones, title: '24/7 Technical Support', description: 'Round-the-clock support via WhatsApp, email, and live chat for all students.', color: '#8b5cf6' },
];

const ServicesSection = () => (
  <section className="py-20 bg-dark-800/30" aria-labelledby="services-heading">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
        <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3 block">What We Offer</span>
        <h2 id="services-heading" className="text-4xl lg:text-5xl font-black text-white mb-4">
          Our <span className="gradient-text">Services</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">End-to-end support for your electronics journey, from concept to completed project.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(({ icon: Icon, title, description, color }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }} whileHover={{ y: -4 }}
            className="card-glass group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: color + '20', border: `1px solid ${color}30` }}>
              <Icon className="w-7 h-7" style={{ color }} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;