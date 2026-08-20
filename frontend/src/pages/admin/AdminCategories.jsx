import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'Cpu', color: '#6366f1' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) setCategories(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = editCat
        ? await api.put(`/categories/${editCat._id}`, form)
        : await api.post('/categories', form);
      if (res.data.success) {
        toast.success(editCat ? 'Category updated' : 'Category created');
        setShowForm(false); setEditCat(null);
        setForm({ name: '', description: '', icon: 'Cpu', color: '#6366f1' });
        fetchCategories();
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleEdit = (cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, description: cat.description, icon: cat.icon, color: cat.color });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const { data } = await api.delete(`/categories/${id}`);
      if (data.success) { toast.success('Category deleted'); fetchCategories(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Categories" />
        <main className="flex-1 p-6" id="main-content">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">{categories.length} Categories</h2>
            <button onClick={() => { setShowForm(true); setEditCat(null); setForm({ name: '', description: '', icon: 'Cpu', color: '#6366f1' }); }}
              className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" aria-hidden="true" /> Add Category
            </button>
          </div>

          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">{editCat ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-white/5 rounded-lg" aria-label="Close form">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5" aria-label={editCat ? 'Edit category form' : 'Add category form'}>
                <div>
                  <label htmlFor="cat-name" className="text-xs text-gray-400 mb-1.5 block">Name *</label>
                  <input id="cat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required aria-required="true" className="input-glass" placeholder="Category name" />
                </div>
                <div>
                  <label htmlFor="cat-icon" className="text-xs text-gray-400 mb-1.5 block">Icon (Lucide name)</label>
                  <input id="cat-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-glass" placeholder="e.g. Cpu, Wifi, Bot" />
                </div>
                <div>
                  <label htmlFor="cat-desc" className="text-xs text-gray-400 mb-1.5 block">Description</label>
                  <input id="cat-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-glass" placeholder="Brief description" />
                </div>
                <div>
                  <label htmlFor="cat-color" className="text-xs text-gray-400 mb-1.5 block">Color</label>
                  <div className="flex gap-2">
                    <input id="cat-color" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10" aria-label="Pick category color" />
                    <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-glass flex-1" placeholder="#6366f1" />
                  </div>
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" aria-hidden="true" />{saving ? 'Saving...' : (editCat ? 'Update' : 'Create')}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}30` }}>
                      <span style={{ color: cat.color }} className="font-bold text-xs">{cat.icon?.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{cat.projectCount || 0} projects</p>
                      {cat.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleEdit(cat)}
                      className="p-1.5 glass rounded-lg hover:border-primary-500/40 text-gray-400 hover:text-primary-400 transition-all"
                      aria-label={`Edit ${cat.name}`}>
                      <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)}
                      className="p-1.5 glass rounded-lg hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-all"
                      aria-label={`Delete ${cat.name}`}>
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCategories;