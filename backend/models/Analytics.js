import mongoose from 'mongoose';

const DailyStatsSchema = new mongoose.Schema({
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  }
}, { _id: false });

const AnalyticsSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0
  },
  projectClicks: {
    type: Number,
    default: 0
  },
  resumeDownloads: {
    type: Number,
    default: 0
  },
  dailyStats: [DailyStatsSchema]
}, {
  timestamps: true
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

export default Analytics;
