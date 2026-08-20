const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Project title is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: 300 },
    images: [{ url: String, publicId: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String, default: '' },
    type: { type: String, enum: ['mini', 'major'], default: 'mini' },
    level: { type: String, enum: ['diploma', 'btech', 'ieee', 'finalyear', 'general'], default: 'general' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    technologies: [String],
    components: [{ name: String, quantity: Number, optional: { type: Boolean, default: false } }],
    estimatedCost: { min: { type: Number, default: 0 }, max: { type: Number, default: 0 }, currency: { type: String, default: 'INR' } },
    duration: { type: String, default: '' },
    trainingAvailable: { type: Boolean, default: false },
    trainingDetails: { type: String, default: '' },
    demoVideoUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    documentUrl: { url: String, publicId: String },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ category: 1, isPublished: 1 });
projectSchema.index({ isFeatured: 1, views: -1 });
projectSchema.index({ slug: 1 });

projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);