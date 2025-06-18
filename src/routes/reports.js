// routes/reports.js
const express = require('express');
const router  = express.Router();

// middleware do autoryzacji
const { protect, adminOnly } = require('../middleware/auth');

// kontroler z logiką raportów
const reports = require('../controllers/reports');

router.get('/leaderboard', protect, reports.leaderboard);



router.get(
  '/top-sets/:userId',
  protect,                  // użytkownik musi być zalogowany
  reports.topSetsPerMonth
);

router.get('/workout-count/:userId', protect, reports.workoutCountPerMonth);

module.exports = router;
