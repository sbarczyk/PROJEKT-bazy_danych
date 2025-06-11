const router = require('express').Router();
const ctrl = require('../controllers/workouts');

router.get('/',    ctrl.getAllWorkouts);
router.get('/:id', ctrl.getWorkoutById);
router.post('/',   ctrl.createWorkout);
router.put('/:id', ctrl.updateWorkout);
router.delete('/:id', ctrl.deleteWorkout);

module.exports = router;
