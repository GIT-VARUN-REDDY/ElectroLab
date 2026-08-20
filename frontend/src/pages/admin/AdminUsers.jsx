import React, { useEffect, useState } from 'react';
import { Search, Shield, ShieldOff, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const fetchUsers = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (s) params.set('search', s);
      const { data } = await api.get(`/users/admin/all?${params}`);
      if (data.success) { setUsers(data.data); setPagination(data.pagination); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(page, search); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(1, search); };

  const handleBlock = async (id) => {
    try {
      const { data } = await api.put(`/users/admin/${id}/block`);
      if (data.success) { toast.success(data.message); fetchUsers(page, search); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      const { data } = await api.delete(`/users/admin/${id}`);
      if (data.success) { toast.success('User deleted'); fetchUsers(page, search); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Users" />
        <main className="flex-1 p-6" id="main-content">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md" role="search" aria-label="Search users">
            <label htmlFor="admin-user-search" className="sr-only">Search users</label>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
              <input id="admin-user-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..." className="input-glass pl-10" />
            </div>
            <button type="submit" className="btn-secondary px-4">Search</button>
          </form>

          {loading ? (
            <div className="flex justify-center py-12" aria-busy="true"><LoadingSpinner /></div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full" aria-label="Users table">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">User</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">College</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Status</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Joined</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {u.avatar
                              ? <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" aria-hidden="true" />
                              : <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
                                  {u.name?.[0]?.toUpperCase()}
                                </div>
                            }
                            <div>
                              <p className="text-sm font-medium text-white">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{u.college || '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              {u.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                            {u.isBlocked && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Blocked</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(u.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleBlock(u._id)}
                              className={`p-2 glass rounded-lg transition-all ${u.isBlocked ? 'hover:border-green-500/40 text-gray-400 hover:text-green-400' : 'hover:border-yellow-500/40 text-gray-400 hover:text-yellow-400'}`}
                              aria-label={u.isBlocked ? `Unblock ${u.name}` : `Block ${u.name}`}>
                              {u.isBlocked
                                ? <Shield className="w-4 h-4" aria-hidden="true" />
                                : <ShieldOff className="w-4 h-4" aria-hidden="true" />
                              }
                            </button>
                            <button onClick={() => handleDelete(u._id)}
                              className="p-2 glass rounded-lg hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-all"
                              aria-label={`Delete ${u.name}`}>
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <div className="text-center py-12 text-gray-400">No users found</div>}
              </div>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6" aria-label="Pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}
                  className={`w-9 h-9 rounded-lg text-sm transition-all ${p === page ? 'bg-primary-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;