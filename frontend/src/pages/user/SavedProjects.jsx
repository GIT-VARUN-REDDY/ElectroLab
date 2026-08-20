import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProjectCard from '../../components/common/ProjectCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';

const SavedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/saved')
      .then(({ data }) => { if (data.success) setProjects(data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
          <Bookmark className="w-8 h-8 text-primary-400" aria-hidden="true" />
          <h1 className="text-3xl font-black text-white">Saved <span className="gradient-text">Projects</span></h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading saved projects">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No saved projects yet"
            desc="Browse projects and save the ones you like"
            action={<Link to="/projects" className="btn-primary">Browse Projects</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => <ProjectCard key={project._id} project={project} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProjects;