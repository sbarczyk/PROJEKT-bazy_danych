// routes/reports.js
const express = require('express');
const router  = express.Router();

// middleware do autoryzacji
const { protect, adminOnly } = require('../middleware/auth');

// kontroler z logiką raportów
const reports = require('../controllers/reports');

/**
 *  GET /api/reports/leaderboard
 *  Zwraca tablicę użytkowników posortowanych malejąco po polu `points`.
 *  Dostęp tylko dla zalogowanego admina.
 */
router.get('/leaderboard', protect, adminOnly, reports.leaderboard);

// możesz tu w przyszłości dodać kolejne raporty, np.:
// router.get('/events/popularity', protect, adminOnly, reports.eventsPopularity);
router.get(
  '/top-sets/:userId',
  protect,                  // użytkownik musi być zalogowany
  reports.topSetsPerMonth
);

module.exports = router;
