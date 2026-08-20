import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Clock, Trophy, Users2, Lightbulb } from 'lucide-react';

const reasons = [
  { icon: Trophy, title: 'Industry-Recognized Quality', desc: 'All projects follow IEEE standards and industry best practices.', color: 'text-yellow-400' },
  { icon: Users2, title: 'Expert Mentors', desc: 'Learn from experienced engineers with real-world expertise.', color: 'text-blue-400' },
  { icon: Clock, title: 'Fast Delivery', desc: 'Quick turnaround with 24-hour initial response.', color: 'text-green-400' },
  { icon: Shield, title: 'Plagiarism-Free', desc: 'All projects are original, custom-built, and 100% unique.', color: 'text-purple-400' },
  { icon: Lightbulb, title: 'Innovation Focus', desc: 'We blend traditional electronics with modern AI and IoT.', color: 'text-orange-400' },
  { icon: CheckCircle2, title: 'End-to-End Support', desc: 'From component sourcing to final demo — every step covered.', color: 'text-cyan-400' },
];

const WhyChooseUs = () => (
  <section className="py-20" aria-labelledby="why-heading">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3 block">Why Us?</span>
          <h2 id="why-heading" className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Why Choose <span className="gradient-text">ElectroLab?</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            We've helped thousands of students bring their electronics ideas to life with quality projects and expert mentorship.
          </p>
          <ul className="space-y-4" aria-label="Key features">
            {['500+ curated electronics projects', 'Training for Arduino, IoT, VLSI, Robotics & more', 'IEEE-standard documentation', 'WhatsApp & email support', 'Component sourcing guidance'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" aria-hidden="true" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: true }}
              className="glass rounded-2xl p-5 hover:border-primary-500/30 transition-all group">
              <Icon className={`w-8 h-8 ${color} mb-3 group-hover:scale-110 transition-transform`} aria-hidden="true" />
              <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;