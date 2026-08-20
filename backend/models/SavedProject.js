const mongoose = require('mongoose');

const savedProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

savedProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true });
savedProjectSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SavedProject', savedProjectSchema);