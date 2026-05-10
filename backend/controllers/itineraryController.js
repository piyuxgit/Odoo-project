const prisma = require('../db');
const axios = require('axios');

const geocodeCity = async (cityName) => {
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q: cityName, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'TraveloopApp/1.0' }
    });
    if (res.data && res.data.length > 0) {
      return { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) };
    }
  } catch (err) {
    console.error('Geocoding error:', err.message);
  }
  return { lat: null, lng: null };
};

// Add a stop to a trip
exports.addStop = async (req, res) => {
  try {
    const { trip_id, city_name, arrival_date, departure_date, order_index } = req.body;
    const trip = await prisma.trip.findFirst({
      where: { trip_id, user_id: req.user.id },
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const coords = await geocodeCity(city_name);

    const stop = await prisma.stop.create({
      data: { trip_id, city_name, arrival_date, departure_date, order_index: order_index || 0, lat: coords.lat, lng: coords.lng },
    });
    res.status(201).json(stop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add stop' });
  }
};

// Update a stop
exports.updateStop = async (req, res) => {
  try {
    const { city_name, arrival_date, departure_date, order_index } = req.body;
    let data = { city_name, arrival_date, departure_date, order_index };
    if (city_name) {
      const coords = await geocodeCity(city_name);
      data.lat = coords.lat;
      data.lng = coords.lng;
    }
    const stop = await prisma.stop.update({
      where: { stop_id: req.params.id },
      data,
    });
    res.json(stop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update stop' });
  }
};

// Delete a stop
exports.deleteStop = async (req, res) => {
  try {
    await prisma.stop.delete({ where: { stop_id: req.params.id } });
    res.json({ message: 'Stop deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete stop' });
  }
};

// Reorder stops
exports.reorderStops = async (req, res) => {
  try {
    const { stops } = req.body; // array of { stop_id, order_index }
    const updates = stops.map((s) =>
      prisma.stop.update({
        where: { stop_id: s.stop_id },
        data: { order_index: s.order_index },
      })
    );
    await prisma.$transaction(updates);
    res.json({ message: 'Stops reordered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder stops' });
  }
};

// Add activity to stop
exports.addActivityToStop = async (req, res) => {
  try {
    const { stop_id, title, category, estimated_cost, duration, scheduled_time, notes } = req.body;
    // Create a standalone activity and link it
    const activity = await prisma.activity.create({
      data: { title, category: category || 'General', estimated_cost: estimated_cost || 0, duration: duration || 60 },
    });
    const tripActivity = await prisma.tripActivity.create({
      data: { stop_id, activity_id: activity.activity_id, scheduled_time, notes },
      include: { activity: true },
    });
    res.status(201).json(tripActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
};

// Remove activity from stop
exports.removeActivityFromStop = async (req, res) => {
  try {
    await prisma.tripActivity.delete({ where: { trip_activity_id: req.params.id } });
    res.json({ message: 'Activity removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove activity' });
  }
};
