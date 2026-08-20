import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', college: '', course: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await signup(form);
      if (data.success) { setSuccess(true); toast.success(data.message); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-10 text-center max-w-md w-full" role="status">
          <div className="text-6xl mb-4" aria-hidden="true">📧</div>
          <h2 className="text-2xl font-black text-white mb-3">Check Your Email!</h2>
          <p className="text-gray-400 mb-6">
            We've sent a verification link to <strong className="text-primary-400">{form.email}</strong>.
            Please verify your email to activate your account.
          </p>
          <Link to="/login" className="btn-primary inline-flex">Go to Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4" aria-label="ElectroLab home">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="font-black text-xl gradient-text">ElectroLab</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join thousands of electronics enthusiasts</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5" aria-label="Signup form">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="signup-name" className="text-xs text-gray-400 mb-1.5 block">Full Name *</label>
              <input id="signup-name" name="name" value={form.name} onChange={handleChange}
                required aria-required="true" className="input-glass" placeholder="John Doe" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="signup-email" className="text-xs text-gray-400 mb-1.5 block">Email *</label>
              <input id="signup-email" name="email" type="email" value={form.email} onChange={handleChange}
                required aria-required="true" className="input-glass" placeholder="john@email.com" autoComplete="email" />
            </div>
          </div>
          <div>
            <label htmlFor="signup-password" className="text-xs text-gray-400 mb-1.5 block">Password *</label>
            <div className="relative">
              <input id="signup-password" name="password" type={showPass ? 'text' : 'password'}
                value={form.password} onChange={handleChange} required aria-required="true"
                className="input-glass pr-12" placeholder="Min. 6 characters" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="signup-phone" className="text-xs text-gray-400 mb-1.5 block">Phone Number</label>
            <input id="signup-phone" name="phone" value={form.phone} onChange={handleChange}
              className="input-glass" placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="signup-college" className="text-xs text-gray-400 mb-1.5 block">College / Institution</label>
              <input id="signup-college" name="college" value={form.college} onChange={handleChange}
                className="input-glass" placeholder="Your college name" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="signup-course" className="text-xs text-gray-400 mb-1.5 block">Course</label>
              <input id="signup-course" name="course" value={form.course} onChange={handleChange}
                className="input-glass" placeholder="e.g. B.Tech ECE" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              : <><UserPlus className="w-5 h-5" aria-hidden="true" />Create Account</>
            }
          </button>
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;