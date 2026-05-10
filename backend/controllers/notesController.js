const prisma = require('../db');

// Get notes for a trip
exports.getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { trip_id: req.params.tripId },
      orderBy: { created_at: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Create a note
exports.createNote = async (req, res) => {
  try {
    const { trip_id, stop_id, note_content } = req.body;
    const note = await prisma.note.create({
      data: { trip_id, stop_id: stop_id || null, note_content },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: { note_id: req.params.id },
      data: { note_content: req.body.note_content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    await prisma.note.delete({ where: { note_id: req.params.id } });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
