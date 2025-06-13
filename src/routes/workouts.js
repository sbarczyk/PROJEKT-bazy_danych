const express           = require('express');
const { protect }       = require('../middleware/auth');   // <-- adminOnly usunięte
const workoutController = require('../controllers/workouts');

const router = express.Router();

// GET – wystarczy protect, żeby znać req.user.
// Jeśli chcesz, by lista zwracała tylko własne workouty, 
// filtr zrobisz w kontrolerze (user vs admin).
router.get('/',    protect, workoutController.getAllWorkouts);
router.get('/:id', protect, workoutController.getWorkoutById);

// modyfikacje dostępne dla KAŻDEGO zalogowanego
router.post('/',      protect, workoutController.createWorkout);
router.patch('/:id',  protect, workoutController.updateWorkout);
router.delete('/:id', protect, workoutController.deleteWorkout);

module.exports = router;
