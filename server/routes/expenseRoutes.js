const express = require('express');
const router = express.Router();
const {
    addExpense, getExpenses, getExpense,
    updateExpense, deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getExpenses).post(addExpense);
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

module.exports = router;
