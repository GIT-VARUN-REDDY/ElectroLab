import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalytics = () => {
  const [data, setData] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/analytics/charts?days=${days}`),
      api.get('/analytics/dashboard'),
    ]).then(([chartsRes, dashRes]) => {
      if (chartsRes.data.success) setData(chartsRes.data.data);
      if (dashRes.data.success) setCategoryStats(dashRes.data.data.categoryStats || []);
    }).finally(() => setLoading(false));
  }, [days]);

  const tooltipStyle = {
    background: '#1a1a2e',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 8,
    color: '#e2e8f0',
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Analytics" />
        <main className="flex-1 p-6" id="main-content">
          <div className="flex gap-2 mb-6" role="group" aria-label="Select time range">
            {[7, 14, 30].map((d) => (
              <button key={d} onClick={() => setDays(d)} aria-pressed={days === d}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${days === d ? 'bg-primary-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                Last {d} days
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12" aria-busy="true"><LoadingSpinner /></div>
          ) : (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="font-bold text-white mb-6">Daily Visits</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} name="Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 className="font-bold text-white mb-6">New Users Over Time</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="newUsers" stroke="#8b5cf6" strokeWidth={2} dot={false} name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 className="font-bold text-white mb-6">Project Views Over Time</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="projectViews" stroke="#06b6d4" strokeWidth={2} dot={false} name="Project Views" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {categoryStats.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-bold text-white mb-6">Projects by Category</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={categoryStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Projects" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {categoryStats.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-bold text-white mb-6">Views by Category</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={categoryStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="views" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;