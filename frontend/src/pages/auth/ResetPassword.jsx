import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  console.log('Reset token from URL:', token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('No reset token found in URL');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        password: form.password,
      });

      if (data.success) {
        setDone(true);
        toast.success('Password reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Reset error:', err);
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
        <div className="glass rounded-2xl p-10 text-center max-w-md w-full">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">
            No reset token found. Please request a new password reset.
          </p>
          <Link to="/forgot-password" className="btn-primary inline-flex">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
        <div className="glass rounded-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-white mb-3">Password Reset!</h2>
          <p className="text-gray-400">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Set New Password</h1>
          <p className="text-gray-400">Choose a strong password for your account.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-5"
        >
          <div>
            <label htmlFor="new-password" className="text-xs text-gray-400 mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-glass pr-12"
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass
                  ? <EyeOff className="w-5 h-5" />
                  : <Eye className="w-5 h-5" />
                }
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="text-xs text-gray-400 mb-1.5 block">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="input-glass"
              placeholder="Re-enter password"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center flex items-center gap-2"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : 'Reset Password'
            }
          </button>

          <Link
            to="/forgot-password"
            className="block text-center text-gray-400 text-sm hover:text-primary-400 transition-colors"
          >
            Request a new link instead
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;