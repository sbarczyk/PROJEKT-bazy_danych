const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

// Pobierz wszystkie treningi
exports.getAllWorkouts = async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { user: req.user.id }; // Filtruj na podstawie roli użytkownika
    const workouts = await Workout.find(filter)
      .populate("exercises.exercise", "name") // Dołącz dane ćwiczeń
      .sort({ date: -1 }); // Sortuj malejąco według daty
    res.json({ success: true, count: workouts.length, data: workouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Pobierz trening po ID
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate(
      "exercises.exercise",
      "name"
    ); // Dołącz dane ćwiczeń
    if (!workout)
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono" }); // Trening nie znaleziony
    res.json({ success: true, data: workout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Utwórz nowy trening
exports.createWorkout = async (req, res) => {
  try {
    const w = new Workout({ ...req.body, user: req.user?.id }); // Utwórz nowy trening
    const saved = await w.save(); // Zapisz trening
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Zaktualizuj trening
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id); // Znajdź trening po ID
    if (!workout)
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono" }); // Trening nie znaleziony

    // Autoryzacja
    if (workout.user.toString() !== req.user.id && !req.user.isAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Brak uprawnień" }); // Brak uprawnień

    // Opcjonalna walidacja ćwiczeń
    if (req.body.exercises) {
      const ids = req.body.exercises.map((e) => e.exercise);
      const found = await Exercise.countDocuments({ _id: { $in: ids } });
      if (found !== ids.length)
        return res.status(400).json({
          success: false,
          message: "Co najmniej jedno ćwiczenie nie istnieje",
        });
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Aktualizuj z walidacją
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

// Usuń trening
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id); // Znajdź trening po ID
    if (!workout)
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono" }); // Trening nie znaleziony

    if (workout.user.toString() !== req.user.id && !req.user.isAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Brak uprawnień" }); // Brak uprawnień

    await workout.deleteOne(); // Usuń trening
    res.json({ success: true, message: "Usunięto trening" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Obsługa błędów
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const exercisesIds = (req.body.exercises || []).map((e) => e.exercise);

    const uniqueIds = [...new Set(exercisesIds.map((id) => id.toString()))];

    const found = await Exercise.countDocuments({ _id: { $in: uniqueIds } });

    if (found !== uniqueIds.length) {
      return res.status(400).json({
        success: false,
        message: "Co najmniej jedno ćwiczenie nie istnieje",
      });
    }

    const workout = new Workout({ ...req.body, user: req.user.id });
    const saved = await workout.save();

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
