import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Star } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import { formatNumber, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [deleting, setDeleting] = useState(null);

  const fetchProjects = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (s) params.set('search', s);
      const { data } = await api.get(`/projects/admin/all?${params}`);
      if (data.success) { setProjects(data.data); setPagination(data.pagination); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(page, search); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProjects(1, search); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const { data } = await api.delete(`/projects/${id}`);
      if (data.success) { toast.success('Project deleted'); fetchProjects(page, search); }
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Projects" />
        <main className="flex-1 p-6" id="main-content">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1" role="search" aria-label="Search projects">
              <label htmlFor="admin-proj-search" className="sr-only">Search projects</label>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input id="admin-proj-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..." className="input-glass pl-10" />
              </div>
              <button type="submit" className="btn-secondary px-4">Search</button>
            </form>
            <Link to="/admin/projects/add" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" aria-hidden="true" /> Add Project
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12" aria-busy="true"><LoadingSpinner /></div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full" aria-label="Projects table">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Project</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Category</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Stats</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Status</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Added</th>
                      <th scope="col" className="text-left px-6 py-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((p) => (
                      <tr key={p._id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.images?.[0]?.url && (
                              <img src={p.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" aria-hidden="true"
                                onError={(e) => { e.target.style.display = 'none'; }} />
                            )}
                            <div>
                              <p className="text-sm font-medium text-white line-clamp-1">{p.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{p.type} · {p.difficulty}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{p.category?.name || '—'}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Eye className="w-3 h-3" aria-hidden="true" />{formatNumber(p.views)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {p.isFeatured && (
                              <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" aria-hidden="true" />Featured
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                              {p.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(p.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/projects/${p.slug}`} target="_blank"
                              className="p-2 glass rounded-lg hover:border-primary-500/40 transition-all text-gray-400 hover:text-primary-400"
                              aria-label={`View ${p.title} (opens in new tab)`}>
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <Link to={`/admin/projects/edit/${p._id}`}
                              className="p-2 glass rounded-lg hover:border-primary-500/40 transition-all text-gray-400 hover:text-primary-400"
                              aria-label={`Edit ${p.title}`}>
                              <Edit className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                              className="p-2 glass rounded-lg hover:border-red-500/40 transition-all text-gray-400 hover:text-red-400 disabled:opacity-50"
                              aria-label={`Delete ${p.title}`}>
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {projects.length === 0 && <div className="text-center py-12 text-gray-400">No projects found</div>}
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

export default AdminProjects;