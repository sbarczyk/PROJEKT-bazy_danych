// controllers/exerciseController.js
const Exercise = require('../models/Exercise');

// GET /api/exercises
// – wszyscy (możesz nawet zdjąć protect, jeśli chcesz pełen public)
exports.getAllExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json({ success: true, count: exercises.length, data: exercises });
  } catch (err) {
    next(err);
  }
};

// GET /api/exercises/:id
exports.getExerciseById = async (req, res, next) => {
  try {
    const ex = await Exercise.findById(req.params.id);
    if (!ex) return res.status(404).json({ success:false, message:'Nie znaleziono ćwiczenia.' });
    res.json({ success: true, data: ex });
  } catch (err) {
    next(err);
  }
};

// POST /api/exercises
// – tylko admin
exports.createExercise = async (req, res, next) => {
  try {
    const ex = await Exercise.create({
      ...req.body,
      createdBy: req.user.id // admin albo null jeśli systemowe
    });
    res.status(201).json({ success: true, data: ex });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/exercises/:id
// – tylko admin
exports.updateExercise = async (req, res, next) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success:false, message:'Nie znaleziono ćwiczenia.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/exercises/:id
// – tylko admin
exports.deleteExercise = async (req, res, next) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success:false, message:'Nie znaleziono ćwiczenia.' });
    res.json({ success: true, message:'Ćwiczenie usunięte.' });
  } catch (err) {
    next(err);
  }
};
