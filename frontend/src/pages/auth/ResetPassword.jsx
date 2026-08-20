import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password: form.password });
      if (data.success) { toast.success(data.message); navigate('/login'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center" role="alert">
        <p className="text-red-400 mb-4">Invalid reset link</p>
        <Link to="/forgot-password" className="btn-primary">Request New Link</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Lock className="w-7 h-7 text-primary-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Set New Password</h1>
          <p className="text-gray-400">Choose a strong password for your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5" aria-label="Reset password form">
          <div>
            <label htmlFor="new-password" className="text-xs text-gray-400 mb-1.5 block">New Password</label>
            <div className="relative">
              <input id="new-password" type={showPass ? 'text' : 'password'} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-glass pr-12" placeholder="Min. 6 characters" required aria-required="true" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPass ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-xs text-gray-400 mb-1.5 block">Confirm Password</label>
            <input id="confirm-password" type="password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="input-glass" placeholder="Re-enter password" required aria-required="true" autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              : 'Reset Password'
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;