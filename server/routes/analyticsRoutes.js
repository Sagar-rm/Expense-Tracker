const express = require('express');
const router = express.Router();
const {
    getMonthlySummary, getSpendingTrends,
    getPrediction, getCategoryAnalysis
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/monthly-summary', getMonthlySummary);
router.get('/trends', getSpendingTrends);
router.get('/prediction', getPrediction);
router.get('/categories', getCategoryAnalysis);

module.exports = router;
