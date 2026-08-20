const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    visits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    projectViews: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);