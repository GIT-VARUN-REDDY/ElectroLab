const User = require('../models/User');
const SavedProject = require('../models/SavedProject');
const { cloudinary } = require('../config/cloudinary');

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, college, course } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, college, course }, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) { next(error); }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.avatar) {
      const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(`electrolab/avatars/${publicId}`).catch(() => {});
    }
    user.avatar = req.file.path;
    await user.save();
    res.json({ success: true, message: 'Avatar updated', avatar: user.avatar });
  } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

const toggleSaveProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const existing = await SavedProject.findOne({ userId, projectId });
    if (existing) { await existing.deleteOne(); return res.json({ success: true, saved: false, message: 'Project removed from saved' }); }
    await SavedProject.create({ userId, projectId });
    res.json({ success: true, saved: true, message: 'Project saved' });
  } catch (error) { next(error); }
};

const getSavedProjects = async (req, res, next) => {
  try {
    const saved = await SavedProject.find({ userId: req.user.id }).sort('-createdAt').populate({ path: 'projectId', populate: { path: 'category', select: 'name slug color' } });
    const projects = saved.map((s) => s.projectId).filter(Boolean);
    res.json({ success: true, data: projects });
  } catch (error) { next(error); }
};

const checkSaved = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const saved = await SavedProject.findOne({ userId: req.user.id, projectId });
    res.json({ success: true, saved: !!saved });
  } catch (error) { next(error); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, verified } = req.query;
    const query = { role: 'user' };
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    if (verified !== undefined) query.isVerified = verified === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);
    res.json({ success: true, data: users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: user.isBlocked });
  } catch (error) { next(error); }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

module.exports = { updateProfile, updateAvatar, changePassword, toggleSaveProject, getSavedProjects, checkSaved, getAllUsers, toggleBlockUser, deleteUser };