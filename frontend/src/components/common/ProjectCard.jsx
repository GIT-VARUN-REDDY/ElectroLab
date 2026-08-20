import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Zap, ChevronRight } from 'lucide-react';
import { formatNumber, getDifficultyColor, truncate } from '../../utils/helpers';

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%231a1a2e'/%3E%3Ctext x='300' y='210' text-anchor='middle' fill='%23444' font-size='48'%3E%E2%9A%A1%3C/text%3E%3C/svg%3E`;

const ProjectCard = ({ project, index = 0 }) => {
  const { title, slug, images, shortDescription, description, category, type,
    difficulty, views, likes, technologies, estimatedCost, trainingAvailable } = project;

  const image = images?.[0]?.url || PLACEHOLDER;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/projects/${slug}`} aria-label={`View project: ${title}`}>
        <div className="glass rounded-2xl overflow-hidden hover:border-primary-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden bg-dark-700">
            <img
              src={image} alt={`${title} thumbnail`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {category?.name && (
                <span className="text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm"
                  style={{ backgroundColor: (category?.color || '#6366f1') + '30', color: category?.color || '#6366f1', border: `1px solid ${(category?.color || '#6366f1')}40` }}>
                  {category.name}
                </span>
              )}
              <span className="text-xs px-2 py-1 rounded-full bg-dark-700/80 text-gray-300 backdrop-blur-sm border border-white/10 capitalize">{type}</span>
            </div>
            {trainingAvailable && (
              <div className="absolute top-3 right-3">
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" aria-hidden="true" /> Training
                </span>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-white text-lg mb-2 hover:text-primary-400 transition-colors line-clamp-2 leading-tight">{title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{shortDescription || truncate(description, 120)}</p>

            {technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Technologies">
                {technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-xs px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded-md border border-primary-500/20">{tech}</span>
                ))}
                {technologies.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-white/5 text-gray-500 rounded-md">+{technologies.length - 3}</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1" aria-label={`${formatNumber(views)} views`}>
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" /> {formatNumber(views)}
                </span>
                <span className="flex items-center gap-1" aria-label={`${formatNumber(likes)} likes`}>
                  <Heart className="w-3.5 h-3.5" aria-hidden="true" /> {formatNumber(likes)}
                </span>
                {estimatedCost?.min > 0 && <span className="text-yellow-500">₹{estimatedCost.min}–{estimatedCost.max}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
                <ChevronRight className="w-4 h-4 text-gray-600 hover:text-primary-400 transition-all" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProjectCard;