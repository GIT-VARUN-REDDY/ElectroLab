import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNeedsVerification(false);
    try {
      const data = await login(form.email, form.password);
      toast.success(data.message || 'Welcome back!');
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      if (err.response?.data?.needsVerification) setNeedsVerification(true);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-dark-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-30" aria-hidden="true" />
        <div className="relative text-center px-12">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/40" aria-hidden="true">
            <Zap className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-4xl font-black text-white mb-4"><span className="gradient-text">Electro</span>Lab</h2>
          <p className="text-gray-400 text-lg">Your gateway to premium electronics project training.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-dark-900">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-6" aria-label="ElectroLab home">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-black text-xl gradient-text">ElectroLab</span>
            </Link>
            <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5" aria-label="Login form">
            <div>
              <label htmlFor="login-email" className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
              <input id="login-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-glass" placeholder="your@email.com" required aria-required="true" autoComplete="email" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input id="login-password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-glass pr-12" placeholder="••••••••" required aria-required="true" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {needsVerification && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl" role="alert">
                <p className="text-yellow-400 text-sm mb-2">Email not verified.</p>
                <Link to="/verify-email" state={{ email: form.email }} className="text-xs text-yellow-300 underline">
                  Resend verification email →
                </Link>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                : <><LogIn className="w-5 h-5" aria-hidden="true" />Sign In</>
              }
            </button>
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Create one</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;