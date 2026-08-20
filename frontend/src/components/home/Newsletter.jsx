import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bell } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post('/contacts/newsletter', { email });
      if (data.success) { toast.success(data.message); setEmail(''); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    } finally { setLoading(false); }
  };

  return (
    <section className="py-20" aria-labelledby="newsletter-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="glass rounded-3xl p-10 text-center border border-primary-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5" aria-hidden="true" />
          <div className="relative">
            <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-primary-400" aria-hidden="true" />
            </div>
            <h2 id="newsletter-heading" className="text-3xl font-black text-white mb-3">
              Stay in the <span className="gradient-text">Loop</span>
            </h2>
            <p className="text-gray-400 mb-8">Get the latest project releases and updates delivered to your inbox.</p>
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto" aria-label="Newsletter signup form">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" className="input-glass flex-1" required aria-required="true" />
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 shrink-0 disabled:opacity-60" aria-label="Subscribe">
                <Send className="w-4 h-4" aria-hidden="true" />
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;