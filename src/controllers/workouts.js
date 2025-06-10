const Workout = require('../models/Workout');

// GET /api/workouts
exports.getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user?.id })
      .populate('exercises.exercise', 'name')
      .sort({ date: -1 });
    res.json({ success: true, count: workouts.length, data: workouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/workouts/:id
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('exercises.exercise', 'name');
    if (!workout) return res.status(404).json({ success: false, message: 'Nie znaleziono' });
    res.json({ success: true, data: workout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/workouts
exports.createWorkout = async (req, res) => {
  try {
    const w = new Workout({ ...req.body, user: req.user?.id });
    const saved = await w.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/workouts/:id
exports.updateWorkout = async (req, res) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Nie znaleziono' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/workouts/:id
exports.deleteWorkout = async (req, res) => {
  try {
    const del = await Workout.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ success: false, message: 'Nie znaleziono' });
    res.json({ success: true, message: 'Usunięto trening' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
