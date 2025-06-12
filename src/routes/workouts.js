// routes/workouts.js
const express             = require('express');
// const { protect }         = require('../middleware/auth');
const { adminOnly, protect }       = require('../middleware/auth');
const workoutController   = require('../controllers/workouts');

const router = express.Router();

// publiczne GET-y
router.get('/',       workoutController.getAllWorkouts);
router.get('/:id',    workoutController.getWorkoutById);

// modyfikacje tylko dla admina
router.post('/',      protect, adminOnly, workoutController.createWorkout);
router.patch('/:id',  protect, adminOnly, workoutController.updateWorkout);
router.delete('/:id', protect, adminOnly, workoutController.deleteWorkout);

module.exports = router;
