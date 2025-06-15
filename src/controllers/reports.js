const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const User = require("../models/User");

// Generowanie rankingu użytkowników
exports.leaderboard = async (req, res) => {
  const top = parseInt(req.query.top) || 10; // Ustal liczbę najlepszych użytkowników
  const data = await User.aggregate([
    { $project: { name: 1, points: 1 } },
    { $sort: { points: -1 } }, // Sortowanie według punktów malejąco
    { $limit: top }, // Ograniczenie do top N użytkowników
  ]);
  res.json({ success: true, data });
};

// Generowanie raportu z największą liczbą serii na miesiąc
exports.topSetsPerMonth = async (req, res) => {
  try {
    const { userId } = req.params;
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (!year || !month) {
      return res
        .status(400)
        .json({ success: false, message: "Podaj year i month" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const uid = new mongoose.Types.ObjectId(userId);

    const data = await Workout.aggregate([
      { $match: { user: uid, date: { $gte: start, $lte: end } } }, // Filtruj treningi użytkownika w danym miesiącu
      { $unwind: "$exercises" },
      {
        $project: {
          exercise: "$exercises.exercise",
          setsCount: { $size: "$exercises.sets" },
        },
      },
      { $group: { _id: "$exercise", totalSets: { $sum: "$setsCount" } } }, // Grupowanie po ćwiczeniu
      { $sort: { totalSets: -1 } }, // Sortowanie po liczbie serii malejąco
      { $limit: 5 }, // Ograniczenie do 5 ćwiczeń
      {
        $lookup: {
          from: "exercises",
          localField: "_id",
          foreignField: "_id",
          as: "exerciseInfo",
        },
      },
      { $unwind: "$exerciseInfo" },
      {
        $project: {
          exerciseId: "$_id",
          name: "$exerciseInfo.name",
          totalSets: 1,
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Liczba treningów na miesiąc
exports.workoutCountPerMonth = async (req, res) => {
  try {
    const { userId } = req.params;
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (!year || !month || month < 1 || month > 12)
      return res.status(400).json({
        success: false,
        message: "Podaj poprawne parametry year i month (1-12)",
      });

    const start = new Date(year, month - 1, 1); // Początek miesiąca
    const end = new Date(year, month, 0, 23, 59, 59, 999); // Koniec miesiąca

    const count = await Workout.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: start, $lte: end },
    });

    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};
