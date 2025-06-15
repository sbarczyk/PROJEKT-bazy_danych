// controllers/exerciseController.js
const Exercise = require("../models/Exercise");

// Pobierz wszystkie ćwiczenia
exports.getAllExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 }); // Pobierz i posortuj ćwiczenia
    res.json({ success: true, count: exercises.length, data: exercises });
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Pobierz ćwiczenie po ID
exports.getExerciseById = async (req, res, next) => {
  try {
    const ex = await Exercise.findById(req.params.id); // Znajdź ćwiczenie po ID
    if (!ex)
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono ćwiczenia." }); // Ćwiczenie nie znalezione
    res.json({ success: true, data: ex });
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Utwórz nowe ćwiczenie - Tylko dla administratora
exports.createExercise = async (req, res, next) => {
  try {
    const ex = await Exercise.create({
      ...req.body,
      createdBy: req.user.id, // Ustaw twórcę ćwiczenia
    });
    res.status(201).json({ success: true, data: ex });
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Zaktualizuj ćwiczenie - Tylko dla administratora
exports.updateExercise = async (req, res, next) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Aktualizuj z walidacją
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono ćwiczenia." }); // Ćwiczenie nie znalezione
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};

// Usuń ćwiczenie - Tylko dla administratora
exports.deleteExercise = async (req, res, next) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id); // Usuń ćwiczenie po ID
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono ćwiczenia." }); // Ćwiczenie nie znalezione
    res.json({ success: true, message: "Ćwiczenie usunięte." });
  } catch (err) {
    next(err); // Przekaż błąd do następnego middleware
  }
};
