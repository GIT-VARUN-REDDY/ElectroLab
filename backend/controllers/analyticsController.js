const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Project = require('../models/Project');
const Category = require('../models/Category');
const Contact = require('../models/Contact');

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProjects, totalCategories, totalContacts, recentUsers] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Project.countDocuments({ isPublished: true }),
      Category.countDocuments({ isActive: true }),
      Contact.countDocuments({ status: 'new' }),
      User.find({ role: 'user' }).sort('-createdAt').limit(5).select('name email createdAt isVerified'),
    ]);

    const projectStats = await Project.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: '$likes' } } },
    ]);

    const topProjects = await Project.find({ isPublished: true })
      .sort({ views: -1 }).limit(5)
      .select('title views likes slug').populate('category', 'name');

    const categoryStats = await Project.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', count: 1, views: 1 } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers, totalProjects, totalCategories,
        newContacts: totalContacts,
        totalViews: projectStats[0]?.totalViews || 0,
        totalLikes: projectStats[0]?.totalLikes || 0,
        recentUsers, topProjects, categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAnalyticsData = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const analyticsData = await Analytics.find({
      date: { $gte: startDate.toISOString().split('T')[0] },
    }).sort('date');
    res.json({ success: true, data: analyticsData });
  } catch (error) {
    next(error);
  }
};

const trackVisit = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { visits: 1 } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAnalyticsData, trackVisit };