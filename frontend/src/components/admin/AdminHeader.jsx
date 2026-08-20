import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="glass-dark border-b border-white/5 px-6 py-4 flex items-center justify-between" role="banner">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
          aria-label="View site (opens in new tab)">
          <ExternalLink className="w-4 h-4" aria-hidden="true" /> View Site
        </a>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label="Logout from admin">
          <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;