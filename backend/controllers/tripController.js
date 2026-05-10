const prisma = require('../db');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { trip_name, description, start_date, end_date } = req.body;
    const trip = await prisma.trip.create({
      data: {
        trip_name,
        description: description || '',
        start_date,
        end_date,
        cover_image: req.file ? `/uploads/${req.file.filename}` : null,
        user_id: req.user.id,
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

// Get all trips for a user
exports.getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { user_id: req.user.id },
      include: {
        stops: true,
        budget: true,
        _count: { select: { stops: true, notes: true, packing_items: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};

// Get single trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { trip_id: req.params.id, user_id: req.user.id },
      include: {
        stops: {
          orderBy: { order_index: 'asc' },
          include: {
            activities: { include: { activity: true } },
            notes: true,
          },
        },
        budget: true,
        packing_items: true,
        notes: { orderBy: { created_at: 'desc' } },
        shared_trip: true,
      },
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
};

// Update trip
exports.updateTrip = async (req, res) => {
  try {
    const { trip_name, description, start_date, end_date } = req.body;
    const data = { trip_name, description, start_date, end_date };
    if (req.file) data.cover_image = `/uploads/${req.file.filename}`;

    const trip = await prisma.trip.updateMany({
      where: { trip_id: req.params.id, user_id: req.user.id },
      data,
    });
    if (trip.count === 0) return res.status(404).json({ error: 'Trip not found' });
    const updated = await prisma.trip.findUnique({ where: { trip_id: req.params.id } });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
};

// Delete trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { trip_id: req.params.id, user_id: req.user.id },
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    await prisma.trip.delete({ where: { trip_id: req.params.id } });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalTrips = await prisma.trip.count({ where: { user_id: req.user.id } });
    const totalStops = await prisma.stop.count({
      where: { trip: { user_id: req.user.id } },
    });
    const budgets = await prisma.budget.findMany({
      where: { trip: { user_id: req.user.id } },
    });
    const totalBudget = budgets.reduce(
      (sum, b) => sum + b.transport_est + b.stay_est + b.food_est + b.activities_est,
      0
    );
    res.json({ totalTrips, totalStops, totalBudget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
