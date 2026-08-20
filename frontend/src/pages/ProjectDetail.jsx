import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Github, Play, Download, Share2, Bookmark, BookmarkCheck, Tag, Clock, Cpu, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatNumber, getDifficultyColor, getLevelBadge, getYouTubeId } from '../utils/helpers';
import ProjectCard from '../components/common/ProjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='800' height='500' fill='%231a1a2e'/%3E%3Ctext x='400' y='260' text-anchor='middle' fill='%23444' font-size='64'%3E%E2%9A%A1%3C/text%3E%3C/svg%3E`;

const YTEmbed = ({ videoId, title }) => {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  if (!playing) {
    return (
      <button onClick={() => setPlaying(true)} className="relative w-full aspect-video rounded-xl overflow-hidden bg-dark-700 group" aria-label={`Play demo video: ${title}`}>
        <img src={thumb} alt={`${title} video thumbnail`} className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-white ml-1" aria-hidden="true" />
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-700">
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title={`${title} demo video`}
        className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/projects/${slug}`).then(({ data }) => {
      if (data.success) {
        setProject(data.data); setRelated(data.related || []); setLikeCount(data.data.likes);
        if (user && data.data.likedBy) setLiked(data.data.likedBy.some((id) => id === user.id || id?._id === user.id));
      }
    }).finally(() => setLoading(false));

    if (isAuthenticated) {
      api.get(`/users/saved/check/${slug}`).then(({ data }) => { if (data.success) setSaved(data.saved); }).catch(() => {});
    }
  }, [slug, user, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Login to like projects');
    const prev = { liked, likeCount };
    setLiked(!liked); setLikeCount((c) => liked ? c - 1 : c + 1);
    try { await api.post(`/projects/${project._id}/like`); }
    catch { setLiked(prev.liked); setLikeCount(prev.likeCount); toast.error('Failed to update like'); }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Login to save projects');
    const prevSaved = saved; setSaved(!saved);
    try { const { data } = await api.post(`/users/save/${project._id}`); toast.success(data.message); }
    catch { setSaved(prevSaved); toast.error('Failed to save project'); }
  };

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!'); };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!project) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
      <Link to="/projects" className="btn-primary">Browse Projects</Link>
    </div>
  );

  const youtubeId = getYouTubeId(project.demoVideoUrl);
  const images = project.images?.length > 0 ? project.images : [{ url: PLACEHOLDER }];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <Link to="/projects" className="hover:text-primary-400 transition-colors">Projects</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-300 truncate max-w-64" aria-current="page">{project.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="relative h-80 sm:h-96 bg-dark-700">
                <motion.img key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  src={images[activeImage]?.url} alt={`${project.title} — image ${activeImage + 1}`}
                  className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar" role="group" aria-label="Project image thumbnails">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} aria-label={`View image ${i + 1}`} aria-pressed={i === activeImage}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-primary-500' : 'border-transparent hover:border-white/20'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: (project.category?.color || '#6366f1') + '20', color: project.category?.color || '#6366f1', border: `1px solid ${(project.category?.color || '#6366f1')}30` }}>
                  {project.category?.name}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full border capitalize ${getDifficultyColor(project.difficulty)}`}>{project.difficulty}</span>
                <span className="text-sm px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 capitalize">{project.type} project</span>
                <span className="text-sm px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">{getLevelBadge(project.level)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">{project.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1.5" aria-label={`${formatNumber(project.views)} views`}>
                  <Eye className="w-4 h-4" aria-hidden="true" />{formatNumber(project.views)} views
                </span>
                <span className="flex items-center gap-1.5" aria-label={`${formatNumber(likeCount)} likes`}>
                  <Heart className="w-4 h-4" aria-hidden="true" />{formatNumber(likeCount)} likes
                </span>
                <span>By {project.createdBy}</span>
                <span>Added {formatDate(project.createdAt)}</span>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            {project.technologies?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary-400" aria-hidden="true" /> Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2" aria-label="Technologies used">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg border border-primary-500/20 text-sm font-medium">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {project.components?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Components Required</h2>
                <ul className="grid sm:grid-cols-2 gap-2" aria-label="Required components">
                  {project.components.map((comp, i) => (
                    <li key={i} className="flex items-center justify-between py-2 px-3 bg-dark-700/50 rounded-lg">
                      <span className="text-gray-300 text-sm">{comp.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">×{comp.quantity || 1}</span>
                        {comp.optional && <span className="text-xs text-yellow-500">Optional</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {youtubeId && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-red-400" aria-hidden="true" /> Demo Video
                </h2>
                <YTEmbed videoId={youtubeId} title={project.title} />
              </div>
            )}

            {project.tags?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary-400" aria-hidden="true" /> Tags
                </h2>
                <div className="flex flex-wrap gap-2" aria-label="Project tags">
                  {project.tags.map((tag) => (
                    <Link key={tag} to={`/projects?search=${tag}`} className="px-3 py-1 glass rounded-full text-sm text-gray-400 hover:text-primary-400 hover:border-primary-500/30 transition-all">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6" aria-label="Project actions and details">
            <div className="glass rounded-2xl p-6 space-y-3">
              <button onClick={handleLike} aria-pressed={liked} aria-label={liked ? 'Unlike project' : 'Like project'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all border ${liked ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'glass border-white/10 text-gray-300 hover:border-red-500/30 hover:text-red-400'}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} aria-hidden="true" />
                {liked ? 'Liked' : 'Like'} ({formatNumber(likeCount)})
              </button>
              <button onClick={handleSave} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save project'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all border ${saved ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'glass border-white/10 text-gray-300 hover:border-primary-500/30 hover:text-primary-400'}`}>
                {saved ? <BookmarkCheck className="w-5 h-5" aria-hidden="true" /> : <Bookmark className="w-5 h-5" aria-hidden="true" />}
                {saved ? 'Saved' : 'Save Project'}
              </button>
              <button onClick={handleShare} aria-label="Copy link to clipboard"
                className="w-full flex items-center justify-center gap-2 py-3 glass rounded-xl text-gray-300 hover:text-white hover:border-white/20 transition-all border border-white/10">
                <Share2 className="w-5 h-5" aria-hidden="true" /> Share
              </button>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="View on GitHub (opens in new tab)"
                  className="w-full flex items-center justify-center gap-2 py-3 glass rounded-xl text-gray-300 hover:text-white hover:border-white/20 transition-all border border-white/10">
                  <Github className="w-5 h-5" aria-hidden="true" /> GitHub <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
              {project.documentUrl?.url && (
                <a href={project.documentUrl.url} target="_blank" rel="noopener noreferrer" aria-label="Download project PDF"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all">
                  <Download className="w-5 h-5" aria-hidden="true" /> Download PDF
                </a>
              )}
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white text-lg">Project Details</h2>
              <dl className="space-y-3">
                {project.estimatedCost?.min > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <dt className="text-gray-400 text-sm">Estimated Cost</dt>
                    <dd className="text-yellow-400 font-semibold text-sm">₹{project.estimatedCost.min} – ₹{project.estimatedCost.max}</dd>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <dt className="text-gray-400 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden="true" />Duration</dt>
                    <dd className="text-white text-sm">{project.duration}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <dt className="text-gray-400 text-sm">Project Type</dt>
                  <dd className="text-white text-sm capitalize">{project.type}</dd>
                </div>
                <div className="flex items-center justify-between py-2">
                  <dt className="text-gray-400 text-sm">Difficulty</dt>
                  <dd className={`text-sm capitalize ${getDifficultyColor(project.difficulty).split(' ')[0]}`}>{project.difficulty}</dd>
                </div>
              </dl>
            </div>

            {project.trainingAvailable && (
              <div className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-green-400" aria-hidden="true" />
                  <h2 className="font-bold text-green-400">Training Available</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">{project.trainingDetails || 'Get hands-on training for this project from our expert mentors.'}</p>
                <Link to="/support" className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition-colors">
                  Request Training
                </Link>
              </div>
            )}

            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-4">Have questions about this project?</p>
              <Link to="/support" className="btn-primary w-full justify-center">Contact Us</Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-black text-white mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;