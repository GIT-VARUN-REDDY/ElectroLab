const Project = require('../models/Project');
const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');

const getProjects = async (req, res, next) => {
  try {
    const { search, category, type, level, difficulty, featured, page = 1, limit = 12, sort = '-createdAt', tags } = req.query;
    const query = { isPublished: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (type) query.type = type;
    if (level) query.level = level;
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query).populate('category', 'name slug color icon').sort(sort).skip(skip).limit(parseInt(limit)).select('-likedBy -__v'),
      Project.countDocuments(query),
    ]);

    res.json({ success: true, data: projects, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) } });
  } catch (error) { next(error); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isPublished: true }).populate('category', 'name slug color icon');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.views += 1;
    await project.save({ validateBeforeSave: false });

    const related = await Project.find({ category: project.category._id, _id: { $ne: project._id }, isPublished: true })
      .limit(4).select('title slug images shortDescription views likes category').populate('category', 'name slug color');

    res.json({ success: true, data: project, related });
  } catch (error) { next(error); }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, shortDescription, category, subcategory, type, level, difficulty, technologies, components,
      estimatedCostMin, estimatedCostMax, duration, trainingAvailable, trainingDetails, demoVideoUrl, githubUrl, tags, isFeatured, isPublished } = req.body;

    const images = req.files ? req.files.map((f) => ({ url: f.path, publicId: f.filename })) : [];

    const project = await Project.create({
      title, description, shortDescription, category, subcategory, type, level, difficulty,
      technologies: technologies ? JSON.parse(technologies) : [],
      components: components ? JSON.parse(components) : [],
      estimatedCost: { min: estimatedCostMin || 0, max: estimatedCostMax || 0 },
      duration, trainingAvailable: trainingAvailable === 'true', trainingDetails, demoVideoUrl, githubUrl,
      images, tags: tags ? JSON.parse(tags) : [],
      isFeatured: isFeatured === 'true', isPublished: isPublished !== 'false',
      createdBy: req.user.name || 'Admin',
    });

    await Category.findByIdAndUpdate(category, { $inc: { projectCount: 1 } });
    await project.populate('category', 'name slug');
    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) { next(error); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) updates.images = [...project.images, ...req.files.map((f) => ({ url: f.path, publicId: f.filename }))];
    if (updates.technologies && typeof updates.technologies === 'string') updates.technologies = JSON.parse(updates.technologies);
    if (updates.components && typeof updates.components === 'string') updates.components = JSON.parse(updates.components);
    if (updates.tags && typeof updates.tags === 'string') updates.tags = JSON.parse(updates.tags);
    if (updates.estimatedCostMin !== undefined) { updates.estimatedCost = { min: updates.estimatedCostMin, max: updates.estimatedCostMax }; delete updates.estimatedCostMin; delete updates.estimatedCostMax; }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('category', 'name slug');
    res.json({ success: true, message: 'Project updated successfully', data: updatedProject });
  } catch (error) { next(error); }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    for (const image of project.images) { if (image.publicId) await cloudinary.uploader.destroy(image.publicId); }
    if (project.documentUrl?.publicId) await cloudinary.uploader.destroy(project.documentUrl.publicId, { resource_type: 'raw' });
    await Category.findByIdAndUpdate(project.category, { $inc: { projectCount: -1 } });
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) { next(error); }
};

const toggleLike = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const userId = req.user.id.toString();
    const alreadyLiked = project.likedBy.map((id) => id.toString()).includes(userId);
    if (alreadyLiked) { project.likedBy.pull(req.user.id); project.likes = Math.max(0, project.likes - 1); }
    else { project.likedBy.push(req.user.id); project.likes += 1; }

    await project.save({ validateBeforeSave: false });
    res.json({ success: true, liked: !alreadyLiked, likes: project.likes });
  } catch (error) { next(error); }
};

const getTrending = async (req, res, next) => {
  try {
    const projects = await Project.find({ isPublished: true }).sort({ views: -1, likes: -1 }).limit(6)
      .select('title slug images shortDescription views likes category').populate('category', 'name slug color');
    res.json({ success: true, data: projects });
  } catch (error) { next(error); }
};

const adminGetProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query).populate('category', 'name').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);

    res.json({ success: true, data: projects, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

const deleteProjectImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    await cloudinary.uploader.destroy(publicId);
    project.images = project.images.filter((img) => img.publicId !== publicId);
    await project.save();
    res.json({ success: true, message: 'Image deleted', images: project.images });
  } catch (error) { next(error); }
};

const uploadDocument = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    if (project.documentUrl?.publicId) await cloudinary.uploader.destroy(project.documentUrl.publicId, { resource_type: 'raw' });
    project.documentUrl = { url: req.file.path, publicId: req.file.filename };
    await project.save();
    res.json({ success: true, message: 'Document uploaded', documentUrl: project.documentUrl });
  } catch (error) { next(error); }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, toggleLike, getTrending, adminGetProjects, deleteProjectImage, uploadDocument };