const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// GET /api/workouts
exports.getAllWorkouts = async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { user: req.user.id };
    const workouts = await Workout.find(filter)
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
    const workout = await Workout.findById(req.params.id);
    if (!workout)
      return res.status(404).json({ success: false, message: 'Nie znaleziono' });

    // 1) autoryzacja
    if (workout.user.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ success: false, message: 'Brak uprawnień' });

    // 2) opcjonalna walidacja ćwiczeń, jeżeli użytkownik je aktualizuje
    if (req.body.exercises) {
      const ids = req.body.exercises.map(e => e.exercise);
      const found = await Exercise.countDocuments({ _id: { $in: ids } });
      if (found !== ids.length)
        return res.status(400).json({
          success: false,
          message: 'Co najmniej jedno ćwiczenie nie istnieje'
        });
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/workouts/:id
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout)
      return res.status(404).json({ success: false, message: 'Nie znaleziono' });

    if (workout.user.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ success: false, message: 'Brak uprawnień' });

    await workout.deleteOne();
    res.json({ success: true, message: 'Usunięto trening' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.createWorkout = async (req, res) => {
  try {
    // 1) sprawdź, czy przesłano tablicę exercises
    const exercisesIds = (req.body.exercises || []).map(e => e.exercise);

    // 2) zweryfikuj, czy każde ID jest w bazie
    const found = await Exercise.countDocuments({ _id: { $in: exercisesIds } });
    if (found !== exercisesIds.length)
      return res.status(400).json({
        success: false,
        message: 'Co najmniej jedno ćwiczenie nie istnieje'
      });

    // 3) zapisz workout z przypisaniem do usera
    const workout = new Workout({ ...req.body, user: req.user.id });
    const saved   = await workout.save();
    res.status(201).json({ success: true, data: saved });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};