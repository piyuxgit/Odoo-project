const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/:tripId', notesController.getNotes);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
