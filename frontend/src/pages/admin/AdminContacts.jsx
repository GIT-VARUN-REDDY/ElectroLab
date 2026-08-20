import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_COLORS = {
  new: 'bg-blue-500/10 text-blue-400',
  read: 'bg-yellow-500/10 text-yellow-400',
  replied: 'bg-green-500/10 text-green-400',
  closed: 'bg-gray-500/10 text-gray-400',
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchContacts = async (status = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (status) params.set('status', status);
      const { data } = await api.get(`/contacts/admin?${params}`);
      if (data.success) setContacts(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(filterStatus); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/contacts/admin/${id}`, { status });
      if (data.success) {
        toast.success('Status updated');
        setContacts((prev) => prev.map((c) => c._id === id ? { ...c, status } : c));
        if (selected?._id === id) setSelected((prev) => ({ ...prev, status }));
      }
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Contacts" />
        <main className="flex-1 p-6" id="main-content">
          <div className="flex gap-2 mb-6 flex-wrap" role="group" aria-label="Filter contacts by status">
            {['', 'new', 'read', 'replied', 'closed'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} aria-pressed={filterStatus === s}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filterStatus === s ? 'bg-primary-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-12" aria-busy="true"><LoadingSpinner /></div>
              ) : contacts.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-gray-400">No contacts found</div>
              ) : contacts.map((contact) => (
                <button key={contact._id} onClick={() => setSelected(contact)}
                  aria-pressed={selected?._id === contact._id}
                  className={`w-full text-left glass rounded-xl p-4 transition-all hover:border-primary-500/30 ${selected?._id === contact._id ? 'border-primary-500/40 bg-primary-500/5' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{contact.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[contact.status]}`}>
                        {contact.status}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(contact.createdAt)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selected && (
              <div className="glass rounded-2xl p-6 h-fit sticky top-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-white">{selected.subject}</h3>
                  <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/5 rounded-lg" aria-label="Close contact detail">
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400">From:</span>
                    <span className="text-white">{selected.name} ({selected.email})</span>
                  </div>
                  {selected.phone && (
                    <div className="flex gap-2">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{selected.phone}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>
                <div className="p-4 bg-dark-700/50 rounded-xl mb-4">
                  <p className="text-gray-300 text-sm whitespace-pre-line">{selected.message}</p>
                </div>
                <div>
                  <label htmlFor="contact-status-select" className="text-xs text-gray-400 mb-2 block">Update Status</label>
                  <select id="contact-status-select" value={selected.status}
                    onChange={(e) => updateStatus(selected._id, e.target.value)}
                    className="input-glass">
                    {['new', 'read', 'replied', 'closed'].map((s) => (
                      <option key={s} value={s} className="bg-dark-700 capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminContacts;