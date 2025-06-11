const router = require('express').Router();
const ctrl = require('../controllers/events');

router.get('/',     ctrl.getAllEvents);
router.get('/:id',  ctrl.getEventById);
router.post('/',    ctrl.createEvent);
router.post('/:id/register', ctrl.register);
// PUT, DELETE wg potrzeb

module.exports = router;
