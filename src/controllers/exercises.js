// controllers/exercises.js
const Exercise = require('../models/Exercise');

// GET /api/exercises - pobierz wszystkie ćwiczenia
exports.getAllExercises = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isPublic: true };

    // Filtrowanie po kategorii
    if (category) {
      query.category = category;
    }

    // Wyszukiwanie po nazwie
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(query)
      .populate('createdBy', 'name')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania ćwiczeń',
      error: error.message
    });
  }
};

// GET /api/exercises/:id - pobierz konkretne ćwiczenie
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Ćwiczenie nie zostało znalezione'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania ćwiczenia',
      error: error.message
    });
  }
};

// POST /api/exercises - dodaj nowe ćwiczenie
exports.createExercise = async (req, res) => {
  try {
    const exerciseData = {
      ...req.body,
      createdBy: req.user?.id || null // Na razie bez autentykacji
    };

    const exercise = new Exercise(exerciseData);
    await exercise.save();

    res.status(201).json({
      success: true,
      message: 'Ćwiczenie zostało utworzone',
      data: exercise
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Błąd walidacji danych',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Błąd podczas tworzenia ćwiczenia',
      error: error.message
    });
  }
};

// PUT /api/exercises/:id - aktualizuj ćwiczenie
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Ćwiczenie nie zostało znalezione'
      });
    }

    res.json({
      success: true,
      message: 'Ćwiczenie zostało zaktualizowane',
      data: exercise
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Błąd walidacji danych',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Błąd podczas aktualizacji ćwiczenia',
      error: error.message
    });
  }
};

// DELETE /api/exercises/:id - usuń ćwiczenie
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Ćwiczenie nie zostało znalezione'
      });
    }

    res.json({
      success: true,
      message: 'Ćwiczenie zostało usunięte'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd podczas usuwania ćwiczenia',
      error: error.message
    });
  }
};

// GET /api/exercises/categories - pobierz dostępne kategorie
exports.getCategories = async (req, res) => {
  try {
    const categories = await Exercise.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania kategorii',
      error: error.message
    });
  }
};