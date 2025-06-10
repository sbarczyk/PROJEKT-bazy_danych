const router = require('express').Router();
const ctrl = require('../controllers/measurements');

router.get('/',    ctrl.getAllMeasurements);
router.get('/:id', ctrl.getMeasurementById);
router.post('/',   ctrl.createMeasurement);
router.put('/:id', ctrl.updateMeasurement);
router.delete('/:id', ctrl.deleteMeasurement);

module.exports = router;
