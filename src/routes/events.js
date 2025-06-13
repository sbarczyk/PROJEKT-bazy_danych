const router  = require('express').Router();
const ctrl    = require('../controllers/events');
const { protect, adminOnly } = require('../middleware/auth');

// PUBLIC
router.get('/',        ctrl.getAllEvents);
router.get('/:id',     ctrl.getEventById);

// ADMIN
router.post('/',       protect, adminOnly, ctrl.createEvent);
router.patch('/:id',   protect, adminOnly, ctrl.updateEvent);
router.delete('/:id',  protect, adminOnly, ctrl.deleteEvent);

// USER / ADMIN
router.post('/:id/register',   protect, ctrl.register);
router.post('/:id/unregister', protect, ctrl.unregister);

module.exports = router;
