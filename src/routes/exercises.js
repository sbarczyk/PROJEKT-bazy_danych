// routes/exercises.js
const router = require('express').Router();
const ctrl = require('../controllers/exercises');

// GET /api/exercises/categories - musi być przed /:id
router.get('/categories', ctrl.getCategories);

// CRUD endpoints
router.get('/', ctrl.getAllExercises);
router.get('/:id', ctrl.getExerciseById);
router.post('/', ctrl.createExercise);
router.put('/:id', ctrl.updateExercise);
router.delete('/:id', ctrl.deleteExercise);

module.exports = router;
