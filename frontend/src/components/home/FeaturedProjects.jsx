import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProjectCard from '../common/ProjectCard';
import SkeletonCard from '../common/SkeletonCard';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects?featured=true&limit=6')
      .then(({ data }) => { if (data.success) setProjects(data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-dark-800/30" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2 block">Handpicked for You</span>
            <h2 id="featured-heading" className="text-4xl font-black text-white">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link to="/projects" className="btn-secondary flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.map((project, i) => <ProjectCard key={project._id} project={project} index={i} />)
          }
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;