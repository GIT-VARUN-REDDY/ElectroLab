import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const { data } = await api.post('/contacts/newsletter', { email });
      if (data.success) { toast.success(data.message); setEmail(''); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally { setSubscribing(false); }
  };

  return (
    <footer className="border-t border-white/5 bg-dark-800/50 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="ElectroLab home">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-black text-xl"><span className="gradient-text">Electro</span><span className="text-white">Lab</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Premium electronics project training for students and professionals.</p>
            <div className="flex gap-3" aria-label="Social media links">
              {[{ icon: Github, href: '#', label: 'GitHub' }, { icon: Youtube, href: '#', label: 'YouTube' }, { icon: Linkedin, href: '#', label: 'LinkedIn' }, { icon: Twitter, href: '#', label: 'Twitter' }].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:border-primary-500/40 hover:text-primary-400 transition-all text-gray-400">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Project Categories</h3>
            <ul className="space-y-2">
              {['Arduino Projects', 'IoT Projects', 'VLSI Projects', 'Robotics', 'Embedded Systems', 'Raspberry Pi', 'AI + Electronics', 'Final Year Projects'].map((cat) => (
                <li key={cat}>
                  <Link to={`/projects?search=${cat}`} className="text-gray-400 text-sm hover:text-primary-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-primary-500 rounded-full" aria-hidden="true" />{cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <a href="mailto:support@electrolab.com" className="hover:text-primary-400 transition-colors">support@electrolab.com</a>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <a href="tel:+919876543210" className="hover:text-primary-400 transition-colors">+91 98765 43210</a>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>Electronics Hub, Bangalore, KA 560001</span>
                </li>
              </ul>
            </address>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest projects and updates.</p>
            <form onSubmit={handleSubscribe} aria-label="Newsletter signup">
              <div className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input id="footer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" className="input-glass flex-1 py-2 text-sm" required aria-required="true" />
                <button type="submit" disabled={subscribing}
                  className="p-2 bg-primary-600 hover:bg-primary-500 rounded-xl transition-colors disabled:opacity-50"
                  aria-label="Subscribe to newsletter">
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} ElectroLab. All rights reserved.</p>
          <nav aria-label="Legal links" className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;