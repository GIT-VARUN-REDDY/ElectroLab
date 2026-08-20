import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProjectCard from '../components/common/ProjectCard';
import SkeletonCard from '../components/common/SkeletonCard';
import EmptyState from '../components/common/EmptyState';
import useDebounce from '../hooks/useDebounce';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-likes', label: 'Most Liked' },
];
const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced'];
const TYPE_OPTIONS = ['mini', 'major'];
const LEVEL_OPTIONS = [
  { value: 'diploma', label: 'Diploma' }, { value: 'btech', label: 'B.Tech' },
  { value: 'ieee', label: 'IEEE' }, { value: 'finalyear', label: 'Final Year' }, { value: 'general', label: 'General' },
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: '', level: '', difficulty: '',
    sort: '-createdAt',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchProjects = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort: filters.sort });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.category) params.set('category', filters.category);
      if (filters.type) params.set('type', filters.type);
      if (filters.level) params.set('level', filters.level);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);

      const { data } = await api.get(`/projects?${params}`);
      if (data.success) { setProjects(data.data); setPagination(data.pagination); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters, debouncedSearch]);

  useEffect(() => { api.get('/categories').then(({ data }) => { if (data.success) setCategories(data.data); }); }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchProjects(1);
    const newParams = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== '-createdAt') newParams[k] = v; });
    setSearchParams(newParams, { replace: true });
  }, [filters, debouncedSearch]);

  useEffect(() => { if (currentPage > 1) fetchProjects(currentPage); }, [currentPage]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ search: '', category: '', type: '', level: '', difficulty: '', sort: '-createdAt' });
  const hasActiveFilters = filters.category || filters.type || filters.level || filters.difficulty;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Explore <span className="gradient-text">Projects</span></h1>
          <p className="text-gray-400 text-lg" aria-live="polite">
            {pagination.total > 0 ? `${pagination.total} projects available` : 'Browse our project library'}
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6" role="search" aria-label="Project search and filters">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
            <label htmlFor="project-search" className="sr-only">Search projects</label>
            <input id="project-search" type="search" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search projects, technologies..." className="input-glass pl-12 w-full" />
          </div>
          <div>
            <label htmlFor="sort-select" className="sr-only">Sort projects</label>
            <select id="sort-select" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-glass sm:w-48">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-dark-700">{o.label}</option>)}
            </select>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls="filter-panel"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${hasActiveFilters || showFilters ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'glass text-gray-300 hover:border-primary-500/30'}`}>
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary-400 rounded-full" aria-label="Active filters applied" />}
          </button>
        </div>

        {showFilters && (
          <motion.div id="filter-panel" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6" role="region" aria-label="Filter options">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <label htmlFor="category-filter" className="text-xs text-gray-400 mb-2 block font-medium">Category</label>
                <select id="category-filter" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="input-glass">
                  <option value="" className="bg-dark-700">All Categories</option>
                  {categories.map((cat) => <option key={cat._id} value={cat._id} className="bg-dark-700">{cat.name}</option>)}
                </select>
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-2 block font-medium" id="type-label">Project Type</span>
                <div className="flex gap-2" role="group" aria-labelledby="type-label">
                  {['', ...TYPE_OPTIONS].map((t) => (
                    <button key={t} onClick={() => updateFilter('type', t)} aria-pressed={filters.type === t}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filters.type === t ? 'bg-primary-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                      {t || 'All'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="level-filter" className="text-xs text-gray-400 mb-2 block font-medium">Level</label>
                <select id="level-filter" value={filters.level} onChange={(e) => updateFilter('level', e.target.value)} className="input-glass">
                  <option value="" className="bg-dark-700">All Levels</option>
                  {LEVEL_OPTIONS.map((l) => <option key={l.value} value={l.value} className="bg-dark-700">{l.label}</option>)}
                </select>
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-2 block font-medium" id="diff-label">Difficulty</span>
                <div className="flex gap-1.5" role="group" aria-labelledby="diff-label">
                  {['', ...DIFFICULTY_OPTIONS].map((d) => (
                    <button key={d} onClick={() => updateFilter('difficulty', d)} aria-pressed={filters.difficulty === d}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${filters.difficulty === d ? 'bg-primary-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                      {d || 'All'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-red-400 text-sm hover:text-red-300 transition-colors mt-4" aria-label="Clear all filters">
                <X className="w-4 h-4" aria-hidden="true" /> Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState icon="🔍" title="No projects found" desc="Try adjusting your search or filters"
            action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => <ProjectCard key={project._id} project={project} index={i} />)}
          </div>
        )}

        {pagination.pages > 1 && (
          <nav className="flex items-center justify-center gap-3 mt-12" aria-label="Pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 glass rounded-xl disabled:opacity-30 hover:border-primary-500/40 transition-all" aria-label="Previous page">
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).filter((p) => Math.abs(p - currentPage) <= 2).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} aria-current={p === currentPage ? 'page' : undefined}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${p === currentPage ? 'bg-primary-600 text-white' : 'glass text-gray-400 hover:text-white hover:border-primary-500/30'}`}>
                {p}
              </button>
            ))}
            <button disabled={currentPage === pagination.pages} onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 glass rounded-xl disabled:opacity-30 hover:border-primary-500/40 transition-all" aria-label="Next page">
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Projects;