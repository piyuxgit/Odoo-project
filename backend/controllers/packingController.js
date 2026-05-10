const prisma = require('../db');

// Get packing items for a trip
exports.getItems = async (req, res) => {
  try {
    const items = await prisma.packingItem.findMany({
      where: { trip_id: req.params.tripId },
      orderBy: { category: 'asc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packing items' });
  }
};

// Add packing item
exports.addItem = async (req, res) => {
  try {
    const { trip_id, item_name, category } = req.body;
    const item = await prisma.packingItem.create({
      data: { trip_id, item_name, category: category || 'Other' },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add packing item' });
  }
};

// Toggle packed status
exports.toggleItem = async (req, res) => {
  try {
    const item = await prisma.packingItem.findUnique({ where: { item_id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const updated = await prisma.packingItem.update({
      where: { item_id: req.params.id },
      data: { packed_status: !item.packed_status },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle packing item' });
  }
};

// Delete packing item
exports.deleteItem = async (req, res) => {
  try {
    await prisma.packingItem.delete({ where: { item_id: req.params.id } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete packing item' });
  }
};

// Reset all items for a trip
exports.resetItems = async (req, res) => {
  try {
    await prisma.packingItem.updateMany({
      where: { trip_id: req.params.tripId },
      data: { packed_status: false },
    });
    res.json({ message: 'Packing list reset' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset packing list' });
  }
};
