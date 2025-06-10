const router = require('express').Router();
const ctrl = require('../controllers/exercises');

// Przykładowy endpoint
router.get('/', ctrl.getAllExercises);

module.exports = router;
