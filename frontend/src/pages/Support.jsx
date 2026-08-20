import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import FAQSection from '../components/home/FAQSection';

const ContactForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/contacts', form);
      if (data.success) { setSubmitted(true); toast.success(data.message); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-10 text-center" role="status">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-gray-400 mb-6">We'll get back to you within 24-48 hours. Check your email for confirmation.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary">Send Another Message</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5" aria-label="Contact form">
      <h3 className="text-xl font-bold text-white mb-2">Send us a Message</h3>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="text-xs text-gray-400 mb-1.5 block">Full Name *</label>
          <input id="contact-name" name="name" value={form.name} onChange={handleChange} required
            aria-required="true" className="input-glass" placeholder="Your name" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-xs text-gray-400 mb-1.5 block">Email *</label>
          <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange}
            required aria-required="true" className="input-glass" placeholder="your@email.com" autoComplete="email" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-phone" className="text-xs text-gray-400 mb-1.5 block">Phone</label>
          <input id="contact-phone" name="phone" value={form.phone} onChange={handleChange}
            className="input-glass" placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="contact-subject" className="text-xs text-gray-400 mb-1.5 block">Subject *</label>
          <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}
            required aria-required="true" className="input-glass">
            <option value="" className="bg-dark-700">Select subject</option>
            <option className="bg-dark-700">Project Enquiry</option>
            <option className="bg-dark-700">Training Request</option>
            <option className="bg-dark-700">Custom Project</option>
            <option className="bg-dark-700">Technical Support</option>
            <option className="bg-dark-700">General Query</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="text-xs text-gray-400 mb-1.5 block">Message *</label>
        <textarea id="contact-message" name="message" value={form.message} onChange={handleChange}
          required aria-required="true" rows={5} className="input-glass resize-none"
          placeholder="Describe your requirement or question..." />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />Sending...</>
          : <><Send className="w-4 h-4" aria-hidden="true" />Send Message</>
        }
      </button>
    </form>
  );
};

const Support = () => {
  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@electrolab.com', href: 'mailto:support@electrolab.com' },
    { icon: Phone, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
    { icon: MapPin, label: 'Location', value: 'Electronics Hub, Bangalore, KA 560001', href: null },
    { icon: Clock, label: 'Working Hours', value: 'Mon–Sat, 9AM–7PM IST', href: null },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? Need training? We're here to help every step of the way.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-5 flex items-start gap-4">
                <div className="w-11 h-11 bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  {href
                    ? <a href={href} className="text-white font-medium hover:text-primary-400 transition-colors">{value}</a>
                    : <p className="text-white font-medium">{value}</p>
                  }
                </div>
              </motion.div>
            ))}
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors"
              aria-label="Chat on WhatsApp (opens in new tab)">
              <MessageSquare className="w-5 h-5" aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden h-64 mb-16">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089634356!2d77.49085288791882!3d12.95428023000089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale" allowFullScreen loading="lazy"
            title="ElectroLab office location map" />
        </div>

        <FAQSection />
      </div>
    </div>
  );
};

export default Support;