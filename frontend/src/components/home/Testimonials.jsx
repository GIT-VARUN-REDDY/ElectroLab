import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Riya Sharma', college: 'NIT Trichy', course: 'B.Tech ECE', text: 'ElectroLab transformed how I approached my final year project. The IoT weather station with complete training was outstanding. Got an A+ and a job offer!', rating: 5, avatar: 'RS' },
  { name: 'Arjun Patel', college: 'IIT Bombay', course: 'M.Tech VLSI', text: 'The VLSI projects here are genuinely IEEE-standard. The documentation, support, and training quality is unmatched. Highly recommended!', rating: 5, avatar: 'AP' },
  { name: 'Priya Menon', college: 'VIT Vellore', course: 'B.Tech EEE', text: 'I was completely lost with my robotics project. The team guided me through every step — from component selection to final demo. Excellent!', rating: 5, avatar: 'PM' },
  { name: 'Karthik Rajan', college: 'Anna University', course: 'Diploma EEE', text: 'As a diploma student, they perfectly customized the project complexity and explained every circuit in detail. Truly student-centric!', rating: 5, avatar: 'KR' },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => { setDirection(1); setCurrent((prev) => (prev + 1) % testimonials.length); }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir) => { setDirection(dir); setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length); };
  const t = testimonials[current];

  return (
    <section className="py-20 bg-dark-800/30" aria-labelledby="testimonials-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3 block">Success Stories</span>
          <h2 id="testimonials-heading" className="text-4xl lg:text-5xl font-black text-white">
            What <span className="gradient-text">Students Say</span>
          </h2>
        </motion.div>

        <div className="relative" aria-live="polite" aria-label="Testimonials carousel">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote key={current} custom={direction}
              initial={{ opacity: 0, x: direction * 100 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 100 }} transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8 sm:p-12 text-center">
              <Quote className="w-12 h-12 text-primary-500/30 mx-auto mb-6" aria-hidden="true" />
              <p className="text-gray-200 text-lg sm:text-xl leading-relaxed mb-8 font-light italic">"{t.text}"</p>
              <div className="flex justify-center gap-1 mb-6" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                ))}
              </div>
              <footer className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg" aria-hidden="true">
                  {t.avatar}
                </div>
                <div className="text-left">
                  <cite className="font-bold text-white not-italic">{t.name}</cite>
                  <p className="text-gray-400 text-sm">{t.course} · {t.college}</p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8" role="group" aria-label="Testimonial navigation">
            <button onClick={() => navigate(-1)} className="p-2 glass rounded-xl hover:border-primary-500/40 transition-all" aria-label="Previous testimonial">
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Testimonial indicators">
              {testimonials.map((_, i) => (
                <button key={i} role="tab" aria-selected={i === current} aria-label={`Testimonial ${i + 1}`}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-primary-500 w-6' : 'bg-white/20 w-2'}`} />
              ))}
            </div>
            <button onClick={() => navigate(1)} className="p-2 glass rounded-xl hover:border-primary-500/40 transition-all" aria-label="Next testimonial">
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;