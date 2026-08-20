import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What types of projects do you offer?', a: 'We offer 500+ projects across Arduino, IoT, VLSI, Robotics, Embedded Systems, Raspberry Pi, AI+Electronics, and more — for diploma, B.Tech, IEEE, and final year levels.' },
  { q: 'Do you provide training along with projects?', a: 'Yes! Many projects include hands-on training sessions. Our mentors guide you through hardware setup, coding, and testing.' },
  { q: 'What is your typical project delivery time?', a: 'Documentation and code delivery is typically within 24-48 hours. Custom development and training depends on complexity — usually 3-7 days.' },
  { q: 'Do you help with final year and IEEE projects?', a: 'Absolutely! We specialize in B.Tech final year projects, IEEE standard projects, and diploma-level projects with full documentation.' },
  { q: 'How do I get component lists and circuit diagrams?', a: 'Every project comes with a detailed component list, circuit diagrams, connections guide, and source code.' },
  { q: 'Can you customize projects for my requirements?', a: 'Yes! We offer fully customized project development based on your requirements, budget, and timeline. Contact us via WhatsApp or email.' },
];

const FAQItem = ({ q, a, isOpen, onClick, id }) => (
  <div className="glass rounded-2xl overflow-hidden">
    <button className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      onClick={onClick} aria-expanded={isOpen} aria-controls={`faq-answer-${id}`} id={`faq-question-${id}`}>
      <span className="font-semibold text-white pr-4">{q}</span>
      <ChevronDown className={`w-5 h-5 text-primary-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div id={`faq-answer-${id}`} role="region" aria-labelledby={`faq-question-${id}`}
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">{a}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="py-20" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3 block">FAQs</span>
          <h2 id="faq-heading" className="text-4xl font-black text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>
        <dl className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
              <FAQItem q={faq.q} a={faq.a} id={i} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? -1 : i)} />
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FAQSection;