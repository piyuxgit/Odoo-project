const prisma = require('../db');
const { v4: uuidv4 } = require('uuid');

// Share a trip publicly
exports.shareTrip = async (req, res) => {
  try {
    const { trip_id } = req.body;
    const trip = await prisma.trip.findFirst({
      where: { trip_id, user_id: req.user.id },
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const existing = await prisma.sharedTrip.findUnique({ where: { trip_id } });
    if (existing) return res.json(existing);

    const slug = trip.trip_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) + '-' + uuidv4().slice(0, 8);
    const shared = await prisma.sharedTrip.create({
      data: { trip_id, public_url_slug: slug },
    });
    res.status(201).json(shared);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to share trip' });
  }
};

// Get shared trip by slug (public, no auth needed)
exports.getSharedTrip = async (req, res) => {
  try {
    const shared = await prisma.sharedTrip.findUnique({
      where: { public_url_slug: req.params.slug },
      include: {
        trip: {
          include: {
            user: { select: { name: true, profile_photo: true } },
            stops: {
              orderBy: { order_index: 'asc' },
              include: { activities: { include: { activity: true } } },
            },
            budget: true,
          },
        },
      },
    });
    if (!shared) return res.status(404).json({ error: 'Shared trip not found' });

    // Increment views
    await prisma.sharedTrip.update({
      where: { share_id: shared.share_id },
      data: { views: shared.views + 1 },
    });

    res.json({ ...shared, views: shared.views + 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shared trip' });
  }
};

// Copy a shared trip to user's account
exports.copyTrip = async (req, res) => {
  try {
    const shared = await prisma.sharedTrip.findUnique({
      where: { public_url_slug: req.params.slug },
      include: {
        trip: {
          include: {
            stops: {
              orderBy: { order_index: 'asc' },
              include: { activities: { include: { activity: true } } },
            },
          },
        },
      },
    });
    if (!shared) return res.status(404).json({ error: 'Shared trip not found' });

    const src = shared.trip;
    const newTrip = await prisma.trip.create({
      data: {
        trip_name: src.trip_name + ' (Copy)',
        description: src.description,
        start_date: src.start_date,
        end_date: src.end_date,
        user_id: req.user.id,
      },
    });

    for (const stop of src.stops) {
      const newStop = await prisma.stop.create({
        data: {
          trip_id: newTrip.trip_id,
          city_name: stop.city_name,
          arrival_date: stop.arrival_date,
          departure_date: stop.departure_date,
          order_index: stop.order_index,
        },
      });
      for (const ta of stop.activities) {
        await prisma.tripActivity.create({
          data: {
            stop_id: newStop.stop_id,
            activity_id: ta.activity_id,
            scheduled_time: ta.scheduled_time,
            notes: ta.notes,
          },
        });
      }
    }

    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to copy trip' });
  }
};

// Unshare
exports.unshareTrip = async (req, res) => {
  try {
    await prisma.sharedTrip.delete({ where: { trip_id: req.params.tripId } });
    res.json({ message: 'Trip unshared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unshare trip' });
  }
};
