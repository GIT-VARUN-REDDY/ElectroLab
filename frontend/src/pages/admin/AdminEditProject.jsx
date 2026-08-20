import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', category: '',
    subcategory: '', type: 'mini', level: 'general', difficulty: 'beginner',
    technologies: [], tags: [],
    estimatedCostMin: '', estimatedCostMax: '', duration: '',
    trainingAvailable: false, trainingDetails: '',
    demoVideoUrl: '', githubUrl: '', isFeatured: false, isPublished: true,
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => { if (data.success) setCategories(data.data); });

    api.get(`/projects/admin/all?limit=1`).then(() => {}).catch(() => {});

    // Fetch project by ID from admin endpoint
    api.get(`/projects/admin/all?limit=200`).then(({ data }) => {
      if (data.success) {
        const project = data.data.find((p) => p._id === id);
        if (project) {
          setForm({
            title: project.title || '',
            description: project.description || '',
            shortDescription: project.shortDescription || '',
            category: project.category?._id || project.category || '',
            subcategory: project.subcategory || '',
            type: project.type || 'mini',
            level: project.level || 'general',
            difficulty: project.difficulty || 'beginner',
            technologies: project.technologies || [],
            tags: project.tags || [],
            estimatedCostMin: project.estimatedCost?.min || '',
            estimatedCostMax: project.estimatedCost?.max || '',
            duration: project.duration || '',
            trainingAvailable: project.trainingAvailable || false,
            trainingDetails: project.trainingDetails || '',
            demoVideoUrl: project.demoVideoUrl || '',
            githubUrl: project.githubUrl || '',
            isFeatured: project.isFeatured || false,
            isPublished: project.isPublished !== false,
          });
        }
      }
    }).finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm((prev) => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };
  const removeTech = (t) => setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((x) => x !== t) }));

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = (t) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) return toast.error('Title, description, and category are required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      newImages.forEach((img) => fd.append('images', img));
      const { data } = await api.put(`/projects/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { toast.success('Project updated!'); navigate('/admin/projects'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Edit Project" />
        <main className="flex-1 p-6" id="main-content">
          <button onClick={() => navigate('/admin/projects')} className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-6" aria-label="Back to projects">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Projects
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" aria-label="Edit project form">
            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Basic Information</h2>
              <div>
                <label htmlFor="edit-title" className="text-xs text-gray-400 mb-1.5 block">Title *</label>
                <input id="edit-title" name="title" value={form.title} onChange={handleChange} required aria-required="true" className="input-glass" />
              </div>
              <div>
                <label htmlFor="edit-short" className="text-xs text-gray-400 mb-1.5 block">Short Description</label>
                <input id="edit-short" name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-glass" maxLength={300} />
              </div>
              <div>
                <label htmlFor="edit-desc" className="text-xs text-gray-400 mb-1.5 block">Full Description *</label>
                <textarea id="edit-desc" name="description" value={form.description} onChange={handleChange} required aria-required="true" rows={6} className="input-glass resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="edit-category" className="text-xs text-gray-400 mb-1.5 block">Category *</label>
                  <select id="edit-category" name="category" value={form.category} onChange={handleChange} required aria-required="true" className="input-glass">
                    <option value="" className="bg-dark-700">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id} className="bg-dark-700">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-sub" className="text-xs text-gray-400 mb-1.5 block">Subcategory</label>
                  <input id="edit-sub" name="subcategory" value={form.subcategory} onChange={handleChange} className="input-glass" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label htmlFor="edit-type" className="text-xs text-gray-400 mb-1.5 block">Type</label>
                  <select id="edit-type" name="type" value={form.type} onChange={handleChange} className="input-glass">
                    <option value="mini" className="bg-dark-700">Mini</option>
                    <option value="major" className="bg-dark-700">Major</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-level" className="text-xs text-gray-400 mb-1.5 block">Level</label>
                  <select id="edit-level" name="level" value={form.level} onChange={handleChange} className="input-glass">
                    <option value="general" className="bg-dark-700">General</option>
                    <option value="diploma" className="bg-dark-700">Diploma</option>
                    <option value="btech" className="bg-dark-700">B.Tech</option>
                    <option value="ieee" className="bg-dark-700">IEEE</option>
                    <option value="finalyear" className="bg-dark-700">Final Year</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-diff" className="text-xs text-gray-400 mb-1.5 block">Difficulty</label>
                  <select id="edit-diff" name="difficulty" value={form.difficulty} onChange={handleChange} className="input-glass">
                    <option value="beginner" className="bg-dark-700">Beginner</option>
                    <option value="intermediate" className="bg-dark-700">Intermediate</option>
                    <option value="advanced" className="bg-dark-700">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Technologies & Tags</h2>
              <div>
                <label htmlFor="edit-tech-input" className="text-xs text-gray-400 mb-1.5 block">Technologies</label>
                <div className="flex gap-2">
                  <input id="edit-tech-input" value={techInput} onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    className="input-glass flex-1" placeholder="Add technology and press Enter" />
                  <button type="button" onClick={addTech} className="btn-secondary px-3" aria-label="Add technology">
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.technologies.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-xs px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20">
                        {t}
                        <button type="button" onClick={() => removeTech(t)} aria-label={`Remove ${t}`} className="hover:text-white ml-1">
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="edit-tag-input" className="text-xs text-gray-400 mb-1.5 block">Tags</label>
                <div className="flex gap-2">
                  <input id="edit-tag-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="input-glass flex-1" placeholder="Add tag and press Enter" />
                  <button type="button" onClick={addTag} className="btn-secondary px-3" aria-label="Add tag">
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-xs px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10">
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} aria-label={`Remove #${t}`} className="hover:text-white ml-1">
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Cost, Duration & Links</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="edit-cost-min" className="text-xs text-gray-400 mb-1.5 block">Min Cost (₹)</label>
                  <input id="edit-cost-min" name="estimatedCostMin" type="number" value={form.estimatedCostMin} onChange={handleChange} className="input-glass" min="0" />
                </div>
                <div>
                  <label htmlFor="edit-cost-max" className="text-xs text-gray-400 mb-1.5 block">Max Cost (₹)</label>
                  <input id="edit-cost-max" name="estimatedCostMax" type="number" value={form.estimatedCostMax} onChange={handleChange} className="input-glass" min="0" />
                </div>
                <div>
                  <label htmlFor="edit-duration" className="text-xs text-gray-400 mb-1.5 block">Duration</label>
                  <input id="edit-duration" name="duration" value={form.duration} onChange={handleChange} className="input-glass" placeholder="e.g. 2-3 days" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="edit-video" className="text-xs text-gray-400 mb-1.5 block">Demo Video URL</label>
                  <input id="edit-video" name="demoVideoUrl" type="url" value={form.demoVideoUrl} onChange={handleChange} className="input-glass" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label htmlFor="edit-github" className="text-xs text-gray-400 mb-1.5 block">GitHub URL</label>
                  <input id="edit-github" name="githubUrl" type="url" value={form.githubUrl} onChange={handleChange} className="input-glass" placeholder="https://github.com/..." />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="trainingAvailable" checked={form.trainingAvailable} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                <span className="text-sm text-gray-300">Training Available</span>
              </label>
              {form.trainingAvailable && (
                <div>
                  <label htmlFor="edit-training" className="text-xs text-gray-400 mb-1.5 block">Training Details</label>
                  <textarea id="edit-training" name="trainingDetails" value={form.trainingDetails} onChange={handleChange} rows={3} className="input-glass resize-none" />
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Add More Images</h2>
              <div>
                <label htmlFor="edit-images" className="text-xs text-gray-400 mb-1.5 block">Upload New Images (appended to existing)</label>
                <input id="edit-images" type="file" multiple accept="image/*" onChange={(e) => setNewImages(Array.from(e.target.files))} className="input-glass" />
                {newImages.length > 0 && <p className="text-xs text-gray-400 mt-2">{newImages.length} new image(s) selected</p>}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white text-lg">Publish Settings</h2>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-300">Featured Project</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-300">Published</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4" aria-hidden="true" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate('/admin/projects')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdminEditProject;