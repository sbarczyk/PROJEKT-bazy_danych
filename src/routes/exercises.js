// routes/exercises.js
const express               = require('express');
const { protect, adminOnly }= require('../middleware/auth');
const ec                    = require('../controllers/exercises');

const router = express.Router();

// 1) Publiczne GET-y (lub protect jeśli chcesz tylko zalogowanych)
router.get('/',      ec.getAllExercises);
router.get('/:id',   ec.getExerciseById);

// 2) Modyfikacje tylko dla admina
router.post('/',     protect, adminOnly, ec.createExercise);
router.patch('/:id', protect, adminOnly, ec.updateExercise);
router.delete('/:id',protect, adminOnly, ec.deleteExercise);

module.exports = router;
