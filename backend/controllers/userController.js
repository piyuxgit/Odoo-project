const prisma = require('../db');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, language_preference, currency_preference } = req.body;
    const data = {};
    if (name) data.name = name;
    if (language_preference) data.language_preference = language_preference;
    if (currency_preference) data.currency_preference = currency_preference;
    if (req.file) data.profile_photo = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, profile_photo: true, language_preference: true, currency_preference: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

// Admin: get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, profile_photo: true, created_at: true, _count: { select: { trips: true } } },
      orderBy: { created_at: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Admin: get analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalStops = await prisma.stop.count();
    const totalActivities = await prisma.activity.count();

    // Top cities by stop count
    const allStops = await prisma.stop.findMany({ select: { city_name: true } });
    const cityCount = {};
    allStops.forEach((s) => {
      if (s.city_name) cityCount[s.city_name] = (cityCount[s.city_name] || 0) + 1;
    });
    const topCities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }));

    // Recent trips
    const recentTrips = await prisma.trip.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { name: true } } },
    });

    res.json({ totalUsers, totalTrips, totalStops, totalActivities, topCities, recentTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
