const prisma = require('../db');

// Upsert budget for a trip
exports.upsertBudget = async (req, res) => {
  try {
    const { trip_id, transport_est, stay_est, food_est, activities_est } = req.body;
    const budget = await prisma.budget.upsert({
      where: { trip_id },
      update: { transport_est, stay_est, food_est, activities_est },
      create: { trip_id, transport_est: transport_est || 0, stay_est: stay_est || 0, food_est: food_est || 0, activities_est: activities_est || 0 },
    });
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save budget' });
  }
};

// Get budget for a trip
exports.getBudget = async (req, res) => {
  try {
    const budget = await prisma.budget.findUnique({ where: { trip_id: req.params.tripId } });
    if (!budget) return res.json({ transport_est: 0, stay_est: 0, food_est: 0, activities_est: 0 });
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
};
