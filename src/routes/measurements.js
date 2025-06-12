const express             = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const mc                  = require('../controllers/measurements');

const router = express.Router();

// każdym user widzi SWÓJ pomiar i może nim zarządzać bez podawania ID:
router.get('/',      protect, mc.getMy);
router.post('/',     protect, mc.create);
router.patch('/',    protect, mc.updateMy);
router.delete('/',   protect, mc.deleteMy);

// Admin ma dodatkowo dostęp do wszystkich po ID:
router.get('/all',   protect, adminOnly, mc.getAll);
router.patch('/:userid', protect, adminOnly, mc.updateByUser);
router.delete('/:userId',protect, adminOnly, mc.deleteByUser);

module.exports = router;
