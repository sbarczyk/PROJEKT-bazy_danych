// controllers/reports.js
const User = require('../models/User');
exports.leaderboard = async (req, res) => {
  const top = parseInt(req.query.top) || 10;
  const data = await User.aggregate([
    { $project: { name: 1, points: 1 } },
    { $sort: { points: -1 } },
    { $limit: top }
  ]);
  res.json({ success: true, data });
};
