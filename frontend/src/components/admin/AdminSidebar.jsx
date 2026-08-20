import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LayoutDashboard, FolderOpen, Tag, Users, MessageSquare, BarChart2, X, Menu } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: FolderOpen, label: 'Projects', to: '/admin/projects' },
  { icon: Tag, label: 'Categories', to: '/admin/categories' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: MessageSquare, label: 'Contacts', to: '/admin/contacts' },
  { icon: BarChart2, label: 'Analytics', to: '/admin/analytics' },
];

const SidebarContent = ({ location, onClose }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between p-6 border-b border-white/5">
      <Link to="/" className="flex items-center gap-2" aria-label="ElectroLab home">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <span className="font-black text-lg"><span className="gradient-text">Electro</span><span className="text-white">Lab</span></span>
      </Link>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg" aria-label="Close sidebar">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
    <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
      {navItems.map(({ icon: Icon, label, to }) => (
        <Link key={to} to={to}
          aria-current={location.pathname === to ? 'page' : undefined}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === to ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  </div>
);

const AdminSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex w-64 glass-dark border-r border-white/5 min-h-screen flex-col" aria-label="Admin sidebar">
        <SidebarContent location={location} />
      </aside>

      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 glass rounded-xl" aria-label="Open admin sidebar">
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 glass-dark border-r border-white/5 flex flex-col" aria-label="Admin sidebar mobile">
              <SidebarContent location={location} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;