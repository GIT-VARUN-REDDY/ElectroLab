import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Cpu, Wifi, Bot } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, className, delay = 0 }) => (
  <motion.div className={`absolute ${className} glass rounded-2xl p-3 text-primary-400`}
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    aria-hidden="true">
    <Icon className="w-6 h-6" />
  </motion.div>
);

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.opacity})`; ctx.fill();
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });
      animFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener('resize', resize); };
  }, []);

  const badges = [
    { icon: '⚡', text: 'Arduino' }, { icon: '📡', text: 'IoT' },
    { icon: '🤖', text: 'Robotics' }, { icon: '🧠', text: 'AI+Electronics' },
    { icon: '💡', text: 'VLSI' }, { icon: '🔧', text: 'Embedded' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" aria-label="Hero section">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 via-dark-900/60 to-dark-900" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-900/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute inset-0 cyber-grid-bg opacity-30" aria-hidden="true" />

      <FloatingIcon icon={Cpu} className="top-1/4 left-[8%] hidden lg:flex" delay={0} />
      <FloatingIcon icon={Wifi} className="top-1/3 right-[8%] hidden lg:flex" delay={1.5} />
      <FloatingIcon icon={Bot} className="bottom-1/3 left-[12%] hidden lg:flex" delay={3} />
      <FloatingIcon icon={Zap} className="bottom-1/4 right-[12%] hidden lg:flex" delay={2} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 border border-primary-500/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-sm text-gray-300 font-medium">🚀 Premier Electronics Project Training Platform</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
          Build <span className="gradient-text">Futuristic</span><br />Electronics <span className="text-white">Projects</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          From Arduino and IoT to VLSI and AI-integrated systems — explore{' '}
          <strong className="text-primary-400 font-semibold">500+ curated projects</strong> with expert guidance, training, and resources.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/projects" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 group">
            Explore Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link to="/support" className="btn-secondary text-base px-8 py-4 flex items-center justify-center gap-2">
            <Play className="w-5 h-5" aria-hidden="true" /> Get Training
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3" aria-label="Technology categories">
          {badges.map((badge, i) => (
            <motion.div key={badge.text} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.07 }} whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10 hover:border-primary-500/40 cursor-default transition-all"
              aria-label={badge.text}>
              <span aria-hidden="true">{badge.icon}</span>
              <span className="text-sm text-gray-300">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} aria-hidden="true">
        <div className="w-6 h-10 glass rounded-full border border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-primary-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;