import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminAddProject = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', category: '',
    subcategory: '', type: 'mini', level: 'general', difficulty: 'beginner',
    technologies: [], tags: [], components: [],
    estimatedCostMin: '', estimatedCostMax: '', duration: '',
    trainingAvailable: false, trainingDetails: '',
    demoVideoUrl: '', githubUrl: '', isFeatured: false, isPublished: true,
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => { if (data.success) setCategories(data.data); });
  }, []);

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
      images.forEach((img) => fd.append('images', img));
      const { data } = await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { toast.success('Project created!'); navigate('/admin/projects'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Add Project" />
        <main className="flex-1 p-6" id="main-content">
          <button onClick={() => navigate('/admin/projects')} className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-6" aria-label="Back to projects">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Projects
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" aria-label="Add project form">
            {/* Basic Info */}
            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Basic Information</h2>
              <div>
                <label htmlFor="proj-title" className="text-xs text-gray-400 mb-1.5 block">Title *</label>
                <input id="proj-title" name="title" value={form.title} onChange={handleChange} required aria-required="true" className="input-glass" placeholder="Project title" />
              </div>
              <div>
                <label htmlFor="proj-short" className="text-xs text-gray-400 mb-1.5 block">Short Description (for card preview)</label>
                <input id="proj-short" name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-glass" placeholder="One line summary" maxLength={300} />
              </div>
              <div>
                <label htmlFor="proj-desc" className="text-xs text-gray-400 mb-1.5 block">Full Description *</label>
                <textarea id="proj-desc" name="description" value={form.description} onChange={handleChange} required aria-required="true" rows={6} className="input-glass resize-none" placeholder="Detailed project description" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="proj-category" className="text-xs text-gray-400 mb-1.5 block">Category *</label>
                  <select id="proj-category" name="category" value={form.category} onChange={handleChange} required aria-required="true" className="input-glass">
                    <option value="" className="bg-dark-700">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id} className="bg-dark-700">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="proj-sub" className="text-xs text-gray-400 mb-1.5 block">Subcategory</label>
                  <input id="proj-sub" name="subcategory" value={form.subcategory} onChange={handleChange} className="input-glass" placeholder="Optional subcategory" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label htmlFor="proj-type" className="text-xs text-gray-400 mb-1.5 block">Type</label>
                  <select id="proj-type" name="type" value={form.type} onChange={handleChange} className="input-glass">
                    <option value="mini" className="bg-dark-700">Mini</option>
                    <option value="major" className="bg-dark-700">Major</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="proj-level" className="text-xs text-gray-400 mb-1.5 block">Level</label>
                  <select id="proj-level" name="level" value={form.level} onChange={handleChange} className="input-glass">
                    <option value="general" className="bg-dark-700">General</option>
                    <option value="diploma" className="bg-dark-700">Diploma</option>
                    <option value="btech" className="bg-dark-700">B.Tech</option>
                    <option value="ieee" className="bg-dark-700">IEEE</option>
                    <option value="finalyear" className="bg-dark-700">Final Year</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="proj-diff" className="text-xs text-gray-400 mb-1.5 block">Difficulty</label>
                  <select id="proj-diff" name="difficulty" value={form.difficulty} onChange={handleChange} className="input-glass">
                    <option value="beginner" className="bg-dark-700">Beginner</option>
                    <option value="intermediate" className="bg-dark-700">Intermediate</option>
                    <option value="advanced" className="bg-dark-700">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technologies & Tags */}
            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Technologies & Tags</h2>
              <div>
                <label htmlFor="tech-input" className="text-xs text-gray-400 mb-1.5 block">Technologies</label>
                <div className="flex gap-2">
                  <input id="tech-input" value={techInput} onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    className="input-glass flex-1" placeholder="Type technology and press Enter" />
                  <button type="button" onClick={addTech} className="btn-secondary px-3" aria-label="Add technology">
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3" aria-label="Added technologies">
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
                <label htmlFor="tag-input" className="text-xs text-gray-400 mb-1.5 block">Tags</label>
                <div className="flex gap-2">
                  <input id="tag-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="input-glass flex-1" placeholder="Type tag and press Enter" />
                  <button type="button" onClick={addTag} className="btn-secondary px-3" aria-label="Add tag">
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3" aria-label="Added tags">
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

            {/* Cost, Duration & Links */}
            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Cost, Duration & Links</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="cost-min" className="text-xs text-gray-400 mb-1.5 block">Min Cost (₹)</label>
                  <input id="cost-min" name="estimatedCostMin" type="number" value={form.estimatedCostMin} onChange={handleChange} className="input-glass" placeholder="0" min="0" />
                </div>
                <div>
                  <label htmlFor="cost-max" className="text-xs text-gray-400 mb-1.5 block">Max Cost (₹)</label>
                  <input id="cost-max" name="estimatedCostMax" type="number" value={form.estimatedCostMax} onChange={handleChange} className="input-glass" placeholder="0" min="0" />
                </div>
                <div>
                  <label htmlFor="proj-duration" className="text-xs text-gray-400 mb-1.5 block">Duration</label>
                  <input id="proj-duration" name="duration" value={form.duration} onChange={handleChange} className="input-glass" placeholder="e.g. 2-3 days" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="proj-video" className="text-xs text-gray-400 mb-1.5 block">Demo Video URL (YouTube)</label>
                  <input id="proj-video" name="demoVideoUrl" type="url" value={form.demoVideoUrl} onChange={handleChange} className="input-glass" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label htmlFor="proj-github" className="text-xs text-gray-400 mb-1.5 block">GitHub URL</label>
                  <input id="proj-github" name="githubUrl" type="url" value={form.githubUrl} onChange={handleChange} className="input-glass" placeholder="https://github.com/..." />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="trainingAvailable" checked={form.trainingAvailable} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-300">Training Available</span>
                </label>
                {form.trainingAvailable && (
                  <div className="mt-3">
                    <label htmlFor="training-details" className="text-xs text-gray-400 mb-1.5 block">Training Details</label>
                    <textarea id="training-details" name="trainingDetails" value={form.trainingDetails} onChange={handleChange} rows={3} className="input-glass resize-none" placeholder="Describe what training includes..." />
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-lg">Images</h2>
              <div>
                <label htmlFor="proj-images" className="text-xs text-gray-400 mb-1.5 block">Upload Images (max 10, 5MB each)</label>
                <input id="proj-images" type="file" multiple accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input-glass" aria-label="Upload project images" />
                {images.length > 0 && <p className="text-xs text-gray-400 mt-2">{images.length} image(s) selected</p>}
              </div>
            </div>

            {/* Publish Settings */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white text-lg">Publish Settings</h2>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-300">Featured Project</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-300">Published (visible to users)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  : <Save className="w-4 h-4" aria-hidden="true" />
                }
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button type="button" onClick={() => navigate('/admin/projects')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdminAddProject;