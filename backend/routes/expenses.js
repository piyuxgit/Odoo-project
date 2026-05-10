const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, expenseController.addExpense);
router.get('/:trip_id', authMiddleware, expenseController.getExpenses);
router.delete('/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;
