import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState(token ? 'verifying' : 'no-token');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.post('/auth/verify-email', { token })
      .then(({ data }) => { if (data.success) setStatus('success'); })
      .catch(() => setStatus('error'));
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email: resendEmail });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setResending(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="glass rounded-2xl p-10 text-center" role="status" aria-live="polite">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white mb-3">Email Verified! ✨</h2>
              <p className="text-gray-400 mb-6">Your account is now active. You can log in.</p>
              <Link to="/login" className="btn-primary inline-flex">Go to Login</Link>
            </>
          )}
          {(status === 'error' || status === 'no-token') && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white mb-3">Verification Failed</h2>
              <p className="text-gray-400 mb-6">The link is invalid or expired. Request a new one:</p>
              <form onSubmit={handleResend} className="space-y-3" aria-label="Resend verification form">
                <label htmlFor="resend-email" className="sr-only">Email address</label>
                <input id="resend-email" type="email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)}
                  className="input-glass" placeholder="your@email.com" required aria-required="true" autoComplete="email" />
                <button type="submit" disabled={resending} className="btn-primary w-full justify-center flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  {resending ? 'Sending...' : 'Resend Verification'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;