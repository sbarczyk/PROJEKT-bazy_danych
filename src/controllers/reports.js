const mongoose = require('mongoose');
const Workout  = require('../models/Workout');


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




exports.topSetsPerMonth = async (req, res) => {
  try {
    const { userId } = req.params;
    const year  = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (!year || !month) {
      return res.status(400).json({ success:false, message:'Podaj year i month' });
    }

    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 0, 23, 59, 59, 999);
    const uid   = new mongoose.Types.ObjectId(userId);        // ← KLUCZ

    const data = await Workout.aggregate([
      { $match: { user: uid, date: { $gte: start, $lte: end } } },
      { $unwind: '$exercises' },
      { $project: {
          exercise: '$exercises.exercise',
          setsCount: { $size: '$exercises.sets' }
      }},
      { $group: { _id: '$exercise', totalSets: { $sum: '$setsCount' } } },
      { $sort: { totalSets: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'exercises',
          localField: '_id',
          foreignField: '_id',
          as: 'exerciseInfo'
      }},
      { $unwind: '$exerciseInfo' },
      { $project: {
          exerciseId: '$_id',
          name: '$exerciseInfo.name',
          totalSets: 1,
          _id: 0
      }}
    ]);

    res.json({ success:true, data });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};


exports.workoutCountPerMonth = async (req, res) => {
  try {
    const { userId } = req.params;
    const year  = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (!year || !month || month < 1 || month > 12)
      return res.status(400).json({
        success: false,
        message: 'Podaj poprawne parametry year i month (1-12)'
      });

    const start = new Date(year, month - 1, 1);                     // 1-ego 00:00
    const end   = new Date(year, month, 0, 23, 59, 59, 999);        // ostatni dzień

    const count = await Workout.countDocuments({
      user:  new mongoose.Types.ObjectId(userId),
      date: { $gte: start, $lte: end }
    });

    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
