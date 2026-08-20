import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderOpen, Eye, Heart, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import { formatNumber, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
    </div>
    <div className={`text-3xl font-black ${color} mb-1`}>{formatNumber(value)}</div>
    <p className="text-gray-400 text-sm">{label}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/analytics/charts?days=14'),
    ]).then(([statsRes, chartRes]) => {
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (chartRes.data.success) setChartData(chartRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Dashboard" />
        <main className="flex-1 p-6 overflow-auto" id="main-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="text-primary-400" bg="bg-primary-500/10" />
            <StatCard icon={FolderOpen} label="Projects" value={stats?.totalProjects || 0} color="text-purple-400" bg="bg-purple-500/10" />
            <StatCard icon={Eye} label="Total Views" value={stats?.totalViews || 0} color="text-cyan-400" bg="bg-cyan-500/10" />
            <StatCard icon={MessageSquare} label="New Contacts" value={stats?.newContacts || 0} color="text-yellow-400" bg="bg-yellow-500/10" />
          </div>

          {chartData.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" aria-hidden="true" /> Visits — Last 14 Days
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#e2e8f0' }} />
                  <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {stats?.topProjects?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-400" aria-hidden="true" /> Top Projects
                </h2>
                <ol className="space-y-3">
                  {stats.topProjects.map((p, i) => (
                    <li key={p._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-5">{i + 1}.</span>
                        <div>
                          <p className="text-sm text-white font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.category?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" aria-hidden="true" />{formatNumber(p.views)}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" aria-hidden="true" />{formatNumber(p.likes)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {stats?.recentUsers?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-400" aria-hidden="true" /> Recent Users
                </h2>
                <ul className="space-y-3">
                  {stats.recentUsers.map((u) => (
                    <li key={u._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold" aria-hidden="true">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(u.createdAt)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {u.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;