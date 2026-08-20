import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-400">Enter your email and we'll send a reset link.</p>
        </div>
        <div className="glass rounded-2xl p-8">
          {sent ? (
            <div className="text-center space-y-4" role="status">
              <div className="text-5xl" aria-hidden="true">📬</div>
              <h2 className="text-xl font-bold text-white">Check Your Email</h2>
              <p className="text-gray-400 text-sm">If that email is registered, a password reset link has been sent.</p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Forgot password form">
              <div>
                <label htmlFor="forgot-email" className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                  <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-glass pl-11" placeholder="your@email.com" required aria-required="true" autoComplete="email" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  : 'Send Reset Link'
                }
              </button>
              <Link to="/login" className="flex items-center justify-center gap-1 text-gray-400 text-sm hover:text-primary-400 transition-colors">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;