import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, User, LogOut, Heart, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Support', to: '/support' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.header
      initial={{ y: -80 }} animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass border-b border-white/5 shadow-xl' : 'bg-transparent'}`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="ElectroLab home">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              <Zap className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-black text-xl hidden sm:block">
              <span className="gradient-text">Electro</span><span className="text-white">Lab</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                aria-current={location.pathname === link.to ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.to ? 'text-primary-400 bg-primary-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 glass rounded-xl hover:border-primary-500/30 transition-all"
                  aria-expanded={userMenuOpen} aria-haspopup="menu" aria-label="User menu">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" aria-hidden="true" />
                    : <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center" aria-hidden="true">
                        <span className="text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                      </div>
                  }
                  <span className="text-sm font-medium hidden sm:block max-w-24 truncate">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-52 glass rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
                      role="menu" aria-label="User options">
                      {isAdmin && (
                        <Link to="/admin" role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-500/10 text-primary-400 font-medium transition-colors border-b border-white/5">
                          <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 transition-colors">
                        <User className="w-4 h-4" aria-hidden="true" /> My Profile
                      </Link>
                      <Link to="/saved" role="menuitem" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 transition-colors">
                        <Heart className="w-4 h-4" aria-hidden="true" /> Saved Projects
                      </Link>
                      <button onClick={handleLogout} role="menuitem"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 transition-colors w-full text-left border-t border-white/5">
                        <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 glass rounded-xl"
              aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5">
            <nav className="px-4 py-4 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === link.to ? 'text-primary-400 bg-primary-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 btn-secondary text-sm text-center">Login</Link>
                  <Link to="/signup" className="flex-1 btn-primary text-sm text-center">Sign Up</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;