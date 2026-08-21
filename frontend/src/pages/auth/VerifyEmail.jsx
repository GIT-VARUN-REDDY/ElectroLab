import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? 'verifying' : 'no-token');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    console.log('Verifying token:', token);

    const verify = async () => {
      try {
        const { data } = await api.post('/auth/verify-email', { token });
        console.log('Verify response:', data);
        if (data.success) {
          setStatus('success');
          toast.success('Email verified!');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Verify error:', err);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email: resendEmail });
      toast.success(data.message || 'Verification email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-10 text-center" role="status" aria-live="polite">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
              <p className="text-gray-400 mt-2">Please wait</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-3">Email Verified! ✨</h2>
              <p className="text-gray-400 mb-6">
                Your account is now active. You can log in.
              </p>
              <Link to="/login" className="btn-primary inline-flex">
                Go to Login
              </Link>
            </>
          )}

          {(status === 'error' || status === 'no-token') && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-3">
                {status === 'no-token' ? 'No Token Found' : 'Verification Failed'}
              </h2>
              <p className="text-gray-400 mb-6">
                {status === 'no-token'
                  ? 'No verification token in the URL. Request a new verification email below.'
                  : 'The link is invalid or expired. Request a new one below.'}
              </p>
              <form onSubmit={handleResend} className="space-y-3">
                <label htmlFor="resend-email" className="sr-only">Email address</label>
                <input
                  id="resend-email"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="input-glass"
                  placeholder="your@email.com"
                  required
                />
                <button
                  type="submit"
                  disabled={resending}
                  className="btn-primary w-full justify-center flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>
              <Link to="/login" className="block mt-4 text-gray-400 text-sm hover:text-primary-400">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;