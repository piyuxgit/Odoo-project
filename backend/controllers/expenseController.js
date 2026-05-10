const prisma = require('../db');

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { trip_id, category, amount, description, date } = req.body;
    const expense = await prisma.expense.create({
      data: {
        trip_id,
        category: category || 'Other',
        amount: Number(amount) || 0,
        description,
        date
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

// Get expenses for a trip
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { trip_id: req.params.trip_id },
      orderBy: { date: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    await prisma.expense.delete({ where: { expense_id: req.params.id } });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
